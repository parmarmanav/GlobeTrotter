const ItineraryService = require('../services/itinerary.service');
const ApiResponse = require('../utils/apiResponse');

class ItineraryController {
  // ----------------------------------------------------
  // ITINERARY DAYS
  // ----------------------------------------------------

  static async getItinerary(req, res, next) {
    try {
      const itinerary = await ItineraryService.getItinerary(req.params.tripId, req.user);
      return ApiResponse.success(res, 'Itinerary retrieved successfully', itinerary, 200);
    } catch (error) {
      next(error);
    }
  }

  static async addDay(req, res, next) {
    try {
      const day = await ItineraryService.addDay(
        req.params.tripId,
        req.user._id,
        req.body,
        req.user.role
      );
      return ApiResponse.success(res, 'Itinerary day added successfully', day, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateDay(req, res, next) {
    try {
      const updatedDay = await ItineraryService.updateDay(
        req.params.tripId,
        req.params.dayId,
        req.user._id,
        req.body,
        req.user.role
      );
      return ApiResponse.success(res, 'Itinerary day updated successfully', updatedDay, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteDay(req, res, next) {
    try {
      const result = await ItineraryService.deleteDay(
        req.params.tripId,
        req.params.dayId,
        req.user._id,
        req.user.role
      );
      return ApiResponse.success(res, result.message, result.remainingDays, 200);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------------------------------------
  // ITINERARY ACTIVITIES
  // ----------------------------------------------------

  static async addActivity(req, res, next) {
    try {
      const activity = await ItineraryService.addActivity(
        req.params.tripId,
        req.params.dayId,
        req.user._id,
        req.body,
        req.user.role
      );
      return ApiResponse.success(res, 'Activity added to itinerary day successfully', activity, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateActivity(req, res, next) {
    try {
      const updatedActivity = await ItineraryService.updateActivity(
        req.params.tripId,
        req.params.dayId,
        req.params.itemId,
        req.user._id,
        req.body,
        req.user.role
      );
      return ApiResponse.success(res, 'Activity updated successfully', updatedActivity, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteActivity(req, res, next) {
    try {
      const result = await ItineraryService.deleteActivity(
        req.params.tripId,
        req.params.dayId,
        req.params.itemId,
        req.user._id,
        req.user.role
      );
      return ApiResponse.success(res, result.message, result.remainingActivities, 200);
    } catch (error) {
      next(error);
    }
  }

  static async reorderActivities(req, res, next) {
    try {
      const activities = await ItineraryService.reorderActivities(
        req.params.tripId,
        req.params.dayId,
        req.user._id,
        req.body.activities,
        req.user.role
      );
      return ApiResponse.success(res, 'Activities reordered successfully', activities, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ItineraryController;
