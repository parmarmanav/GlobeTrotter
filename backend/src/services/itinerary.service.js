const Trip = require('../models/Trip');
const Activity = require('../models/Activity');

class ItineraryService {
  /**
   * Get all itinerary days and activities for a trip
   */
  static async getItinerary(tripId, user) {
    const trip = await Trip.findById(tripId).populate(
      'itineraryDays.activities.activityId',
      'name description category image estimatedCost rating durationMinutes'
    );

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

    // Sort days by dayNumber, and activities within each day by sequenceOrder
    const sortedDays = [...trip.itineraryDays]
      .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
      .map(day => {
        const sortedActivities = [...day.activities].sort(
          (a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0)
        );
        const dayObj = day.toObject ? day.toObject() : day;
        dayObj.activities = sortedActivities;
        return dayObj;
      });

    return sortedDays;
  }

  /**
   * Add a new day to the trip itinerary
   */
  static async addDay(tripId, userId, dayData, userRole = 'USER') {
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

    const dayNumber = dayData.dayNumber || (trip.itineraryDays.length + 1);

    // Calculate maximum allowed days if trip has startDate and endDate
    if (trip.startDate && trip.endDate) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end - start);
        const maxDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (trip.itineraryDays.length >= maxDays) {
          const error = new Error(`Cannot add more days. This trip is scheduled for ${maxDays} days maximum.`);
          error.statusCode = 400;
          throw error;
        }

        if (dayNumber > maxDays) {
          const error = new Error(`Day number ${dayNumber} exceeds the maximum ${maxDays}-day duration of this trip.`);
          error.statusCode = 400;
          throw error;
        }
      }
    }

    // Auto-calculate date from trip.startDate + day offset if date not provided
    let dayDate = dayData.date ? new Date(dayData.date) : null;
    if (!dayDate && trip.startDate) {
      const computed = new Date(trip.startDate);
      computed.setDate(computed.getDate() + (dayNumber - 1));
      dayDate = computed;
    }

    const newDay = {
      dayNumber,
      date: dayDate || undefined,
      title: dayData.title || `Day ${dayNumber}`,
      notes: dayData.notes || '',
      activities: []
    };

    trip.itineraryDays.push(newDay);
    await trip.save();

    const createdDay = trip.itineraryDays[trip.itineraryDays.length - 1];
    return createdDay;
  }

  /**
   * Update an itinerary day
   */
  static async updateDay(tripId, dayId, userId, updateData, userRole = 'USER') {
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

    const day = trip.itineraryDays.id(dayId);
    if (!day) {
      const error = new Error('Itinerary day not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.dayNumber !== undefined) day.dayNumber = Number(updateData.dayNumber);
    if (updateData.title !== undefined) day.title = updateData.title;
    if (updateData.notes !== undefined) day.notes = updateData.notes;
    if (updateData.date !== undefined) {
      day.date = updateData.date ? new Date(updateData.date) : undefined;
    }

    await trip.save();
    return day;
  }

  /**
   * Delete an itinerary day
   */
  static async deleteDay(tripId, dayId, userId, userRole = 'USER') {
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

    const day = trip.itineraryDays.id(dayId);
    if (!day) {
      const error = new Error('Itinerary day not found');
      error.statusCode = 404;
      throw error;
    }

    trip.itineraryDays.pull({ _id: dayId });

    // Re-number remaining days
    trip.itineraryDays.forEach((d, idx) => {
      d.dayNumber = idx + 1;
    });

    await trip.save();
    return { message: 'Day removed successfully', remainingDays: trip.itineraryDays };
  }

  /**
   * Add activity to an itinerary day
   */
  static async addActivity(tripId, dayId, userId, activityData, userRole = 'USER') {
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

    const day = trip.itineraryDays.id(dayId);
    if (!day) {
      const error = new Error('Itinerary day not found');
      error.statusCode = 404;
      throw error;
    }

    let title = activityData.title;
    let description = activityData.description || '';
    let category = activityData.category;
    let estimatedCost = activityData.estimatedCost !== undefined ? Number(activityData.estimatedCost) : 0;

    // If activityId from catalog is provided, autofill missing fields
    if (activityData.activityId) {
      const catalogActivity = await Activity.findById(activityData.activityId);
      if (catalogActivity) {
        title = title || catalogActivity.name;
        description = description || catalogActivity.description;
        category = category || catalogActivity.category;
        if (activityData.estimatedCost === undefined) {
          estimatedCost = catalogActivity.estimatedCost || 0;
        }
      }
    }

    if (!title) {
      const error = new Error('Activity title is required');
      error.statusCode = 400;
      throw error;
    }

    const sequenceOrder = activityData.sequenceOrder || (day.activities.length + 1);

    const newActivity = {
      activityId: activityData.activityId || undefined,
      title,
      description,
      startTime: activityData.startTime || '',
      endTime: activityData.endTime || '',
      estimatedCost,
      category: category || 'OTHER',
      sequenceOrder,
      notes: activityData.notes || ''
    };

    day.activities.push(newActivity);
    await trip.save();

    const createdActivity = day.activities[day.activities.length - 1];
    return createdActivity;
  }

  /**
   * Update an activity in an itinerary day
   */
  static async updateActivity(tripId, dayId, itemId, userId, updateData, userRole = 'USER') {
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

    const day = trip.itineraryDays.id(dayId);
    if (!day) {
      const error = new Error('Itinerary day not found');
      error.statusCode = 404;
      throw error;
    }

    const activity = day.activities.id(itemId);
    if (!activity) {
      const error = new Error('Activity item not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.activityId) {
      const catalogActivity = await Activity.findById(updateData.activityId);
      if (catalogActivity) {
        activity.activityId = catalogActivity._id;
        if (!updateData.title) activity.title = catalogActivity.name;
        if (!updateData.description) activity.description = catalogActivity.description;
        if (!updateData.category) activity.category = catalogActivity.category;
      }
    }

    if (updateData.title !== undefined) activity.title = updateData.title;
    if (updateData.description !== undefined) activity.description = updateData.description;
    if (updateData.startTime !== undefined) activity.startTime = updateData.startTime;
    if (updateData.endTime !== undefined) activity.endTime = updateData.endTime;
    if (updateData.estimatedCost !== undefined) activity.estimatedCost = Number(updateData.estimatedCost);
    if (updateData.category !== undefined) activity.category = updateData.category;
    if (updateData.sequenceOrder !== undefined) activity.sequenceOrder = Number(updateData.sequenceOrder);
    if (updateData.notes !== undefined) activity.notes = updateData.notes;

    await trip.save();
    return activity;
  }

  /**
   * Delete an activity from an itinerary day
   */
  static async deleteActivity(tripId, dayId, itemId, userId, userRole = 'USER') {
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

    const day = trip.itineraryDays.id(dayId);
    if (!day) {
      const error = new Error('Itinerary day not found');
      error.statusCode = 404;
      throw error;
    }

    const activity = day.activities.id(itemId);
    if (!activity) {
      const error = new Error('Activity item not found');
      error.statusCode = 404;
      throw error;
    }

    day.activities.pull({ _id: itemId });

    // Re-sequence remaining activities
    day.activities.forEach((act, idx) => {
      act.sequenceOrder = idx + 1;
    });

    await trip.save();
    return { message: 'Activity removed successfully', remainingActivities: day.activities };
  }

  /**
   * Reorder activities within an itinerary day
   */
  static async reorderActivities(tripId, dayId, userId, activitiesOrder, userRole = 'USER') {
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

    const day = trip.itineraryDays.id(dayId);
    if (!day) {
      const error = new Error('Itinerary day not found');
      error.statusCode = 404;
      throw error;
    }

    if (Array.isArray(activitiesOrder)) {
      if (typeof activitiesOrder[0] === 'string' || activitiesOrder[0] instanceof String) {
        // Array of IDs: ['id1', 'id2', ...]
        activitiesOrder.forEach((id, index) => {
          const act = day.activities.id(id);
          if (act) {
            act.sequenceOrder = index + 1;
          }
        });
      } else if (typeof activitiesOrder[0] === 'object' && activitiesOrder[0] !== null) {
        // Array of objects: [{ activityId: '...', sequenceOrder: 1 }, ...]
        activitiesOrder.forEach((item) => {
          const id = item.activityId || item._id || item.id || item.itemId;
          const act = day.activities.id(id);
          if (act && item.sequenceOrder !== undefined) {
            act.sequenceOrder = Number(item.sequenceOrder);
          }
        });
      }
    }

    // Sort in-memory
    day.activities.sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0));

    await trip.save();
    return day.activities;
  }
}

module.exports = ItineraryService;
