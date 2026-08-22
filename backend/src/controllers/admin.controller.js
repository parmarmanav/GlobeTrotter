const AnalyticsService = require('../services/analytics.service');
const ApiResponse = require('../utils/apiResponse');

class AdminController {
  /**
   * Get platform analytics and key metrics
   */
  static async getAnalytics(req, res, next) {
    try {
      const analytics = await AnalyticsService.getPlatformAnalytics();
      return ApiResponse.success(res, 'Admin analytics retrieved successfully', analytics, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * List users for user management
   */
  static async getUsers(req, res, next) {
    try {
      const { users, meta } = await AnalyticsService.getUsers(req.query);
      return ApiResponse.success(res, 'Users retrieved successfully', users, 200, meta);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user role
   */
  static async updateUserRole(req, res, next) {
    try {
      const updatedUser = await AnalyticsService.updateUserRole(req.params.userId, req.body.role);
      return ApiResponse.success(res, 'User role updated successfully', updatedUser, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
