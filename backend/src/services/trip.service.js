const Trip = require('../models/Trip');
const City = require('../models/City');
const TRIP_STATUS = require('../constants/tripStatus');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

class TripService {
  /**
   * Helper to derive trip status based on dates if not explicitly provided
   */
  static deriveTripStatus(startDate, endDate, explicitStatus) {
    if (explicitStatus && Object.values(TRIP_STATUS).includes(explicitStatus)) {
      return explicitStatus;
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < now) {
      return TRIP_STATUS.COMPLETED;
    } else if (start <= now && now <= end) {
      return TRIP_STATUS.ONGOING;
    } else {
      return TRIP_STATUS.PLANNED;
    }
  }

  /**
   * Create a new trip
   */
  static async createTrip(userId, tripData) {
    const { name, description, coverImage, startDate, endDate, status, isPublic, budget, stops, itineraryDays } = tripData;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      const error = new Error('End date must be on or after start date');
      error.statusCode = 400;
      throw error;
    }

    const tripStatus = this.deriveTripStatus(start, end, status);

    const newTrip = new Trip({
      userId,
      name,
      description: description || '',
      coverImage: coverImage || '',
      startDate: start,
      endDate: end,
      status: tripStatus,
      isPublic: isPublic || false,
      budget: {
        totalBudget: (budget && budget.totalBudget) || 0,
        currency: (budget && budget.currency) || 'USD'
      },
      stops: stops || [],
      itineraryDays: itineraryDays || []
    });

    await newTrip.save();
    return newTrip;
  }

  /**
   * Get user trips with search, status filtering, date range, sort, pagination, and classification
   */
  static async getUserTrips(userId, queryParams = {}) {
    const { page, limit, skip } = getPaginationParams(queryParams);
    const { search, status, startDate, endDate, sort } = queryParams;

    const filter = { userId };

    // Search query
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { description: regex },
        { 'stops.cityName': regex },
        { 'stops.country': regex }
      ];
    }

    // Status filter
    if (status && status.toUpperCase() !== 'ALL') {
      filter.status = status.toUpperCase();
    }

    // Date range filter
    if (startDate) {
      filter.startDate = { $gte: new Date(startDate) };
    }
    if (endDate) {
      filter.endDate = { ...filter.endDate, $lte: new Date(endDate) };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort) {
      if (sort === 'startDate_asc') sortOption = { startDate: 1 };
      else if (sort === 'startDate_desc') sortOption = { startDate: -1 };
      else if (sort === 'name_asc') sortOption = { name: 1 };
      else if (sort === 'name_desc') sortOption = { name: -1 };
      else if (sort === 'createdAt_asc') sortOption = { createdAt: 1 };
      else if (sort === 'createdAt_desc') sortOption = { createdAt: -1 };
    }

    const [trips, totalCount] = await Promise.all([
      Trip.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate('stops.cityId', 'name country image popularityScore')
        .lean(),
      Trip.countDocuments(filter)
    ]);

    // Categorize trips for UI tabs (Upcoming, Ongoing, Completed)
    const now = new Date();
    const allUserTrips = await Trip.find({ userId }).select('startDate endDate status').lean();
    
    const upcomingCount = allUserTrips.filter(t => t.status === TRIP_STATUS.PLANNED || new Date(t.startDate) > now).length;
    const ongoingCount = allUserTrips.filter(t => t.status === TRIP_STATUS.ONGOING || (new Date(t.startDate) <= now && new Date(t.endDate) >= now)).length;
    const completedCount = allUserTrips.filter(t => t.status === TRIP_STATUS.COMPLETED || new Date(t.endDate) < now).length;

    const meta = {
      ...getPaginationMeta(totalCount, page, limit),
      counts: {
        total: allUserTrips.length,
        upcoming: upcomingCount,
        ongoing: ongoingCount,
        completed: completedCount
      }
    };

    return { trips, meta };
  }

  /**
   * Get single trip by ID with ownership or public access check
   */
  static async getTripById(tripId, user) {
    const trip = await Trip.findById(tripId)
      .populate('stops.cityId', 'name country region image costIndex popularityScore tags')
      .populate('itineraryDays.activities.activityId', 'name description category image estimatedCost rating durationMinutes')
      .populate('userId', 'firstName lastName username email profileImage');

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    const isOwner = user && trip.userId && trip.userId._id.toString() === user._id.toString();
    const isAdmin = user && user.role === 'ADMIN';

    if (!isOwner && !isAdmin && !trip.isPublic) {
      const error = new Error('Access denied. This trip is private');
      error.statusCode = 403;
      throw error;
    }

    return trip;
  }

  /**
   * Update trip details
   */
  static async updateTrip(tripId, userId, updateData, userRole = 'USER') {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not have permission to update this trip');
      error.statusCode = 403;
      throw error;
    }

    // Validate dates if updated
    const start = updateData.startDate ? new Date(updateData.startDate) : trip.startDate;
    const end = updateData.endDate ? new Date(updateData.endDate) : trip.endDate;

    if (end < start) {
      const error = new Error('End date must be on or after start date');
      error.statusCode = 400;
      throw error;
    }

    if (updateData.name !== undefined) trip.name = updateData.name;
    if (updateData.description !== undefined) trip.description = updateData.description;
    if (updateData.coverImage !== undefined) trip.coverImage = updateData.coverImage;
    if (updateData.startDate !== undefined) trip.startDate = start;
    if (updateData.endDate !== undefined) trip.endDate = end;
    if (updateData.status !== undefined) trip.status = updateData.status;
    if (updateData.isPublic !== undefined) trip.isPublic = updateData.isPublic;

    if (updateData.budget) {
      if (updateData.budget.totalBudget !== undefined) {
        trip.budget.totalBudget = Number(updateData.budget.totalBudget);
      }
      if (updateData.budget.currency !== undefined) {
        trip.budget.currency = updateData.budget.currency;
      }
    }

    await trip.save();
    return trip;
  }

  /**
   * Delete a trip
   */
  static async deleteTrip(tripId, userId, userRole = 'USER') {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not have permission to delete this trip');
      error.statusCode = 403;
      throw error;
    }

    await Trip.findByIdAndDelete(tripId);
    return { id: tripId };
  }

  // ----------------------------------------------------
  // STOP MANAGEMENT
  // ----------------------------------------------------

  /**
   * Add a stop to a trip
   */
  static async addStop(tripId, userId, stopData, userRole = 'USER') {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not own this trip');
      error.statusCode = 403;
      throw error;
    }

    let cityName = stopData.cityName;
    let country = stopData.country;

    // If cityId provided, verify and populate cityName/country if not present
    if (stopData.cityId) {
      const city = await City.findById(stopData.cityId);
      if (!city) {
        const error = new Error('City not found');
        error.statusCode = 404;
        throw error;
      }
      cityName = cityName || city.name;
      country = country || city.country;
    }

    if (!cityName || !country) {
      const error = new Error('City name and country are required for a stop');
      error.statusCode = 400;
      throw error;
    }

    // Validate dates if provided
    if (stopData.startDate && stopData.endDate) {
      if (new Date(stopData.endDate) < new Date(stopData.startDate)) {
        const error = new Error('Stop end date must be on or after stop start date');
        error.statusCode = 400;
        throw error;
      }
    }

    const sequenceOrder = stopData.sequenceOrder || (trip.stops.length + 1);

    const newStop = {
      cityId: stopData.cityId || undefined,
      cityName,
      country,
      startDate: stopData.startDate ? new Date(stopData.startDate) : undefined,
      endDate: stopData.endDate ? new Date(stopData.endDate) : undefined,
      sequenceOrder,
      notes: stopData.notes || ''
    };

    trip.stops.push(newStop);
    await trip.save();

    const createdStop = trip.stops[trip.stops.length - 1];
    return { stop: createdStop, stops: trip.stops };
  }

  /**
   * Get all stops for a trip
   */
  static async getStops(tripId, user) {
    const trip = await Trip.findById(tripId).populate('stops.cityId', 'name country image popularityScore');

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    const isOwner = user && trip.userId.toString() === user._id.toString();
    const isAdmin = user && user.role === 'ADMIN';

    if (!isOwner && !isAdmin && !trip.isPublic) {
      const error = new Error('Access denied. This trip is private');
      error.statusCode = 403;
      throw error;
    }

    const sortedStops = [...trip.stops].sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0));
    return sortedStops;
  }

  /**
   * Update a stop within a trip
   */
  static async updateStop(tripId, stopId, userId, updateData, userRole = 'USER') {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not own this trip');
      error.statusCode = 403;
      throw error;
    }

    const stop = trip.stops.id(stopId);
    if (!stop) {
      const error = new Error('Stop not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.cityId) {
      const city = await City.findById(updateData.cityId);
      if (!city) {
        const error = new Error('City not found');
        error.statusCode = 404;
        throw error;
      }
      stop.cityId = city._id;
      if (!updateData.cityName) stop.cityName = city.name;
      if (!updateData.country) stop.country = city.country;
    }

    if (updateData.cityName !== undefined) stop.cityName = updateData.cityName;
    if (updateData.country !== undefined) stop.country = updateData.country;
    if (updateData.notes !== undefined) stop.notes = updateData.notes;
    if (updateData.sequenceOrder !== undefined) stop.sequenceOrder = Number(updateData.sequenceOrder);

    if (updateData.startDate !== undefined) {
      stop.startDate = updateData.startDate ? new Date(updateData.startDate) : undefined;
    }
    if (updateData.endDate !== undefined) {
      stop.endDate = updateData.endDate ? new Date(updateData.endDate) : undefined;
    }

    if (stop.startDate && stop.endDate && stop.endDate < stop.startDate) {
      const error = new Error('Stop end date must be on or after stop start date');
      error.statusCode = 400;
      throw error;
    }

    await trip.save();
    return stop;
  }

  /**
   * Delete a stop from a trip
   */
  static async deleteStop(tripId, stopId, userId, userRole = 'USER') {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not own this trip');
      error.statusCode = 403;
      throw error;
    }

    const stop = trip.stops.id(stopId);
    if (!stop) {
      const error = new Error('Stop not found');
      error.statusCode = 404;
      throw error;
    }

    trip.stops.pull({ _id: stopId });

    // Re-sequence remaining stops
    trip.stops.forEach((s, idx) => {
      s.sequenceOrder = idx + 1;
    });

    await trip.save();
    return { message: 'Stop removed successfully', remainingStops: trip.stops };
  }

  /**
   * Reorder stops within a trip
   */
  static async reorderStops(tripId, userId, stopsOrder, userRole = 'USER') {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not own this trip');
      error.statusCode = 403;
      throw error;
    }

    // stopsOrder can be an array of IDs in new order or array of { stopId, sequenceOrder }
    if (Array.isArray(stopsOrder)) {
      if (typeof stopsOrder[0] === 'string' || stopsOrder[0] instanceof String) {
        // Array of IDs: ['id1', 'id2', 'id3']
        stopsOrder.forEach((id, index) => {
          const stop = trip.stops.id(id);
          if (stop) {
            stop.sequenceOrder = index + 1;
          }
        });
      } else if (typeof stopsOrder[0] === 'object' && stopsOrder[0] !== null) {
        // Array of objects: [{ stopId: '...', sequenceOrder: 1 }, ...]
        stopsOrder.forEach((item) => {
          const id = item.stopId || item._id || item.id;
          const stop = trip.stops.id(id);
          if (stop && item.sequenceOrder !== undefined) {
            stop.sequenceOrder = Number(item.sequenceOrder);
          }
        });
      }
    }

    // Sort stops in-memory
    trip.stops.sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0));

    await trip.save();
    return trip.stops;
  }
}

module.exports = TripService;
