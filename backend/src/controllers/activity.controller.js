const DiscoveryService = require('../services/discovery.service');
const ApiResponse = require('../utils/apiResponse');

class ActivityController {
  static async getActivities(req, res, next) {
    try {
      const { activities, meta } = await DiscoveryService.getActivities(req.query);
      return ApiResponse.success(res, 'Activities retrieved successfully', activities, 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getActivitiesByCity(req, res, next) {
    try {
      const query = { ...req.query, cityId: req.params.cityId };
      const { activities, meta } = await DiscoveryService.getActivities(query);
      return ApiResponse.success(res, 'City activities retrieved successfully', activities, 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getActivityById(req, res, next) {
    try {
      const activity = await DiscoveryService.getActivityById(req.params.activityId);
      return ApiResponse.success(res, 'Activity details retrieved successfully', activity, 200);
    } catch (error) {
      next(error);
    }
  }

  static async createActivity(req, res, next) {
    try {
      const activity = await DiscoveryService.createActivity(req.body);
      return ApiResponse.success(res, 'Activity created successfully', activity, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateActivity(req, res, next) {
    try {
      const updatedActivity = await DiscoveryService.updateActivity(req.params.activityId, req.body);
      return ApiResponse.success(res, 'Activity updated successfully', updatedActivity, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteActivity(req, res, next) {
    try {
      const result = await DiscoveryService.deleteActivity(req.params.activityId);
      return ApiResponse.success(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivityController;
