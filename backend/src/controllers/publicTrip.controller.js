const PublicTripService = require('../services/publicTrip.service');
const ApiResponse = require('../utils/apiResponse');

class PublicTripController {
  /**
   * Publish a trip (Make public & generate slug)
   */
  static async publishTrip(req, res, next) {
    try {
      const result = await PublicTripService.publishTrip(req.params.tripId, req.user);
      return ApiResponse.success(res, 'Trip published successfully to community', result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unpublish a trip (Make private)
   */
  static async unpublishTrip(req, res, next) {
    try {
      const result = await PublicTripService.unpublishTrip(req.params.tripId, req.user);
      return ApiResponse.success(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get public trip view by slug
   */
  static async getPublicTripBySlug(req, res, next) {
    try {
      const trip = await PublicTripService.getPublicTripBySlug(req.params.slug);
      return ApiResponse.success(res, 'Public trip retrieved successfully', trip, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Copy a public trip to user account
   */
  static async copyPublicTrip(req, res, next) {
    try {
      const result = await PublicTripService.copyPublicTrip(req.params.slug, req.user);
      return ApiResponse.success(res, result.message, result.trip, 201);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicTripController;
