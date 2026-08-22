const AnalyticsService = require('../services/analytics.service');
const ApiResponse = require('../utils/apiResponse');

class AdminController {
  static async getAnalytics(req, res, next) {
    try {
      const analytics = await AnalyticsService.getPlatformAnalytics();
      return ApiResponse.success(res, 'Admin platform analytics retrieved successfully', analytics, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getOverviewAnalytics(req, res, next) {
    try {
      const overview = await AnalyticsService.getOverviewAnalytics();
      return ApiResponse.success(res, 'Overview analytics retrieved successfully', overview, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getUserAnalytics(req, res, next) {
    try {
      const userAnalytics = await AnalyticsService.getUserAnalytics();
      return ApiResponse.success(res, 'User analytics retrieved successfully', userAnalytics, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getTripAnalytics(req, res, next) {
    try {
      const tripAnalytics = await AnalyticsService.getTripAnalytics();
      return ApiResponse.success(res, 'Trip analytics retrieved successfully', tripAnalytics, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getCityAnalytics(req, res, next) {
    try {
      const cityAnalytics = await AnalyticsService.getCityAnalytics();
      return ApiResponse.success(res, 'City analytics retrieved successfully', cityAnalytics, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getActivityAnalytics(req, res, next) {
    try {
      const activityAnalytics = await AnalyticsService.getActivityAnalytics();
      return ApiResponse.success(res, 'Activity analytics retrieved successfully', activityAnalytics, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const { users, meta } = await AnalyticsService.getUsers(req.query);
      return ApiResponse.success(res, 'Users retrieved successfully', users, 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const user = await AnalyticsService.getUserById(req.params.userId);
      return ApiResponse.success(res, 'User retrieved successfully', user, 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateUserStatus(req, res, next) {
    try {
      const { isActive } = req.body;
      const updatedUser = await AnalyticsService.updateUserStatus(req.params.userId, isActive);
      return ApiResponse.success(res, 'User status updated successfully', updatedUser, 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req, res, next) {
    try {
      const { role } = req.body;
      const updatedUser = await AnalyticsService.updateUserRole(req.params.userId, role);
      return ApiResponse.success(res, 'User role updated successfully', updatedUser, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const result = await AnalyticsService.deleteUser(req.params.userId);
      return ApiResponse.success(res, result.message, null, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
