const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const PublicTrip = require('../models/PublicTrip');
const User = require('../models/User');
const { generateUniqueSlug } = require('../utils/slugGenerator');

class PublicTripService {
  /**
   * Publish a trip to make it public and generate a shareable slug
   */
  static async publishTrip(tripId, user) {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== user._id.toString() && user.role !== 'ADMIN') {
      const error = new Error('Forbidden: You do not own this trip');
      error.statusCode = 403;
      throw error;
    }

    trip.isPublic = true;
    await trip.save();

    let publicTrip = await PublicTrip.findOne({ tripId });

    if (!publicTrip) {
      const slugTitle = `${trip.name} ${user.username || 'trip'}`;
      const slug = generateUniqueSlug(slugTitle);

      publicTrip = await PublicTrip.create({
        tripId: trip._id,
        ownerId: trip.userId,
        slug,
        isActive: true
      });
    } else {
      publicTrip.isActive = true;
      await publicTrip.save();
    }

    return {
      tripId: trip._id,
      name: trip.name,
      isPublic: true,
      slug: publicTrip.slug,
      shareUrl: `/public/trips/${publicTrip.slug}`,
      publishedAt: publicTrip.updatedAt
    };
  }

  /**
   * Unpublish a trip to make it private again
   */
  static async unpublishTrip(tripId, user) {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== user._id.toString() && user.role !== 'ADMIN') {
      const error = new Error('Forbidden: You do not own this trip');
      error.statusCode = 403;
      throw error;
    }

    trip.isPublic = false;
    await trip.save();

    const publicTrip = await PublicTrip.findOne({ tripId });
    if (publicTrip) {
      publicTrip.isActive = false;
      await publicTrip.save();
    }

    return {
      tripId: trip._id,
      isPublic: false,
      message: 'Trip has been unpublished and is now private'
    };
  }

  /**
   * Get public trip details by shareable slug (sanitized read-only view)
   */
  static async getPublicTripBySlug(slug) {
    const publicTrip = await PublicTrip.findOne({ slug, isActive: true })
      .populate('ownerId', 'firstName lastName username profileImage bio city country')
      .lean();

    if (!publicTrip) {
      const error = new Error('Public trip not found or has been made private');
      error.statusCode = 404;
      throw error;
    }

    const trip = await Trip.findById(publicTrip.tripId)
      .populate('stops.cityId', 'name country region image costIndex')
      .populate('itineraryDays.activities.activityId', 'name description category image estimatedCost durationMinutes rating')
      .lean();

    if (!trip || !trip.isPublic) {
      const error = new Error('This trip is no longer publicly available');
      error.statusCode = 404;
      throw error;
    }

    // Filter out private notes and internal details
    const sanitizedStops = (trip.stops || []).map(s => ({
      _id: s._id,
      cityId: s.cityId,
      cityName: s.cityName,
      country: s.country,
      startDate: s.startDate,
      endDate: s.endDate,
      sequenceOrder: s.sequenceOrder
    }));

    const sanitizedItinerary = (trip.itineraryDays || []).map(day => ({
      _id: day._id,
      dayNumber: day.dayNumber,
      date: day.date,
      title: day.title,
      activities: (day.activities || []).map(act => ({
        _id: act._id,
        activityId: act.activityId,
        title: act.title,
        description: act.description,
        startTime: act.startTime,
        endTime: act.endTime,
        estimatedCost: act.estimatedCost,
        category: act.category,
        sequenceOrder: act.sequenceOrder
      }))
    }));

    return {
      slug: publicTrip.slug,
      tripId: trip._id,
      name: trip.name,
      description: trip.description,
      coverImage: trip.coverImage,
      startDate: trip.startDate,
      endDate: trip.endDate,
      status: trip.status,
      owner: publicTrip.ownerId,
      stops: sanitizedStops,
      itineraryDays: sanitizedItinerary,
      budget: {
        totalBudget: trip.budget ? trip.budget.totalBudget : 0,
        currency: trip.budget ? trip.budget.currency : 'USD'
      },
      createdAt: trip.createdAt
    };
  }

  /**
   * Copy a public trip to current user's account
   */
  static async copyPublicTrip(slug, currentUser) {
    const publicTrip = await PublicTrip.findOne({ slug, isActive: true }).lean();

    if (!publicTrip) {
      const error = new Error('Public trip not found');
      error.statusCode = 404;
      throw error;
    }

    const sourceTrip = await Trip.findById(publicTrip.tripId).lean();

    if (!sourceTrip || !sourceTrip.isPublic) {
      const error = new Error('Source trip is not publicly available to copy');
      error.statusCode = 404;
      throw error;
    }

    // Clone stops without original IDs
    const clonedStops = (sourceTrip.stops || []).map(s => ({
      cityId: s.cityId,
      cityName: s.cityName,
      country: s.country,
      startDate: s.startDate,
      endDate: s.endDate,
      sequenceOrder: s.sequenceOrder,
      notes: s.notes || ''
    }));

    // Clone itinerary days and activities without original IDs
    const clonedItineraryDays = (sourceTrip.itineraryDays || []).map(day => ({
      dayNumber: day.dayNumber,
      date: day.date,
      title: day.title,
      notes: day.notes || '',
      activities: (day.activities || []).map(act => ({
        activityId: act.activityId,
        title: act.title,
        description: act.description,
        startTime: act.startTime,
        endTime: act.endTime,
        estimatedCost: act.estimatedCost,
        category: act.category,
        sequenceOrder: act.sequenceOrder,
        notes: act.notes || ''
      }))
    }));

    // Create new personal trip copy for current user
    const newTrip = new Trip({
      userId: currentUser._id,
      name: `Copy of ${sourceTrip.name}`,
      description: sourceTrip.description,
      coverImage: sourceTrip.coverImage,
      startDate: sourceTrip.startDate,
      endDate: sourceTrip.endDate,
      status: 'PLANNED',
      isPublic: false,
      stops: clonedStops,
      itineraryDays: clonedItineraryDays,
      budget: {
        totalBudget: sourceTrip.budget ? sourceTrip.budget.totalBudget : 0,
        currency: sourceTrip.budget ? sourceTrip.budget.currency : 'USD'
      },
      expenses: []
    });

    await newTrip.save();

    return {
      message: 'Trip copied successfully to your personal account',
      trip: newTrip
    };
  }
}

module.exports = PublicTripService;
