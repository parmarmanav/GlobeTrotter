const DashboardService = require('../services/dashboard.service');
const ApiResponse = require('../utils/apiResponse');

class DashboardController {
  static async getDashboard(req, res, next) {
    try {
      const data = await DashboardService.getDashboardData(req.user._id, req.user);
      return ApiResponse.success(res, 'Dashboard data retrieved successfully', data, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DashboardController;
