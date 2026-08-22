const TripService = require('../services/trip.service');
const ApiResponse = require('../utils/apiResponse');

class TripController {
  // ----------------------------------------------------
  // TRIP CRUD
  // ----------------------------------------------------

  static async createTrip(req, res, next) {
    try {
      const trip = await TripService.createTrip(req.user._id, req.body);
      return ApiResponse.success(res, 'Trip created successfully', trip, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getTrips(req, res, next) {
    try {
      const { trips, meta } = await TripService.getUserTrips(req.user._id, req.query);
      return ApiResponse.success(res, 'Trips retrieved successfully', trips, 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getTripById(req, res, next) {
    try {
      const trip = await TripService.getTripById(req.params.tripId, req.user);
      return ApiResponse.success(res, 'Trip details retrieved successfully', trip, 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateTrip(req, res, next) {
    try {
      const updatedTrip = await TripService.updateTrip(
        req.params.tripId,
        req.user._id,
        req.body,
        req.user.role
      );
      return ApiResponse.success(res, 'Trip updated successfully', updatedTrip, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTrip(req, res, next) {
    try {
      await TripService.deleteTrip(req.params.tripId, req.user._id, req.user.role);
      return ApiResponse.success(res, 'Trip deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------------------------------------
  // STOP MANAGEMENT
  // ----------------------------------------------------

  static async addStop(req, res, next) {
    try {
      const result = await TripService.addStop(
        req.params.tripId,
        req.user._id,
        req.body,
        req.user.role
      );
      return ApiResponse.success(res, 'Stop added to trip successfully', result.stop, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getStops(req, res, next) {
    try {
      const stops = await TripService.getStops(req.params.tripId, req.user);
      return ApiResponse.success(res, 'Trip stops retrieved successfully', stops, 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateStop(req, res, next) {
    try {
      const updatedStop = await TripService.updateStop(
        req.params.tripId,
        req.params.stopId,
        req.user._id,
        req.body,
        req.user.role
      );
      return ApiResponse.success(res, 'Stop updated successfully', updatedStop, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteStop(req, res, next) {
    try {
      const result = await TripService.deleteStop(
        req.params.tripId,
        req.params.stopId,
        req.user._id,
        req.user.role
      );
      return ApiResponse.success(res, result.message, result.remainingStops, 200);
    } catch (error) {
      next(error);
    }
  }

  static async reorderStops(req, res, next) {
    try {
      const stops = await TripService.reorderStops(
        req.params.tripId,
        req.user._id,
        req.body.stops,
        req.user.role
      );
      return ApiResponse.success(res, 'Stops reordered successfully', stops, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TripController;
