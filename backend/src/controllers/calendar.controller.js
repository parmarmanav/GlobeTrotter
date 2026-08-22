const Trip = require('../models/Trip');
const ApiResponse = require('../utils/apiResponse');

class CalendarController {
  /**
   * Get calendar and timeline events for a specific trip
   */
  static async getTripCalendar(req, res, next) {
    try {
      const trip = await Trip.findById(req.params.tripId)
        .populate('stops.cityId', 'name country')
        .populate('itineraryDays.activities.activityId', 'name category durationMinutes');

      if (!trip) {
        return ApiResponse.error(res, 'Trip not found', 404);
      }

      const isOwner = req.user && trip.userId.toString() === req.user._id.toString();
      const isAdmin = req.user && req.user.role === 'ADMIN';

      if (!isOwner && !isAdmin && !trip.isPublic) {
        return ApiResponse.error(res, 'Access denied. This trip is private', 403);
      }

      const events = [];

      // 1. Overall Trip Event
      events.push({
        id: `trip-${trip._id}`,
        type: 'TRIP',
        title: trip.name,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        status: trip.status,
        color: '#4F46E5', // Indigo
        allDay: true
      });

      // 2. Stop Events
      if (Array.isArray(trip.stops)) {
        trip.stops.forEach(stop => {
          if (stop.startDate || stop.endDate) {
            events.push({
              id: `stop-${stop._id}`,
              tripId: trip._id,
              type: 'STOP',
              title: `Stop: ${stop.cityName}, ${stop.country}`,
              cityName: stop.cityName,
              country: stop.country,
              startDate: stop.startDate || trip.startDate,
              endDate: stop.endDate || stop.startDate || trip.endDate,
              notes: stop.notes,
              sequenceOrder: stop.sequenceOrder,
              color: '#0D9488', // Teal
              allDay: true
            });
          }
        });
      }

      // 3. Day-Wise Activities Events
      if (Array.isArray(trip.itineraryDays)) {
        trip.itineraryDays.forEach(day => {
          if (Array.isArray(day.activities)) {
            day.activities.forEach(activity => {
              events.push({
                id: `activity-${activity._id}`,
                tripId: trip._id,
                dayId: day._id,
                dayNumber: day.dayNumber,
                type: 'ACTIVITY',
                title: activity.title,
                description: activity.description,
                date: day.date,
                startTime: activity.startTime || '',
                endTime: activity.endTime || '',
                category: activity.category,
                estimatedCost: activity.estimatedCost,
                color: '#F59E0B', // Amber
                allDay: !activity.startTime
              });
            });
          }
        });
      }

      return ApiResponse.success(res, 'Trip calendar events retrieved successfully', {
        tripId: trip._id,
        tripName: trip.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        events
      }, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all aggregated calendar events for current user
   */
  static async getUserCalendar(req, res, next) {
    try {
      const trips = await Trip.find({ userId: req.user._id })
        .populate('stops.cityId', 'name country')
        .lean();

      const events = [];

      trips.forEach(trip => {
        // Overall Trip Event
        events.push({
          id: `trip-${trip._id}`,
          type: 'TRIP',
          tripId: trip._id,
          title: trip.name,
          startDate: trip.startDate,
          endDate: trip.endDate,
          status: trip.status,
          color: '#4F46E5',
          allDay: true
        });

        // Stops
        if (Array.isArray(trip.stops)) {
          trip.stops.forEach(stop => {
            if (stop.startDate || stop.endDate) {
              events.push({
                id: `stop-${stop._id}`,
                tripId: trip._id,
                tripName: trip.name,
                type: 'STOP',
                title: `${trip.name} - ${stop.cityName}`,
                startDate: stop.startDate || trip.startDate,
                endDate: stop.endDate || stop.startDate || trip.endDate,
                color: '#0D9488',
                allDay: true
              });
            }
          });
        }

        // Activities
        if (Array.isArray(trip.itineraryDays)) {
          trip.itineraryDays.forEach(day => {
            if (Array.isArray(day.activities)) {
              day.activities.forEach(activity => {
                events.push({
                  id: `activity-${activity._id}`,
                  tripId: trip._id,
                  tripName: trip.name,
                  type: 'ACTIVITY',
                  title: `${activity.title} (${trip.name})`,
                  date: day.date,
                  startTime: activity.startTime,
                  endTime: activity.endTime,
                  category: activity.category,
                  color: '#F59E0B',
                  allDay: !activity.startTime
                });
              });
            }
          });
        }
      });

      return ApiResponse.success(res, 'User calendar events retrieved successfully', events, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CalendarController;
