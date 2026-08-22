const DiscoveryService = require('../services/discovery.service');
const ApiResponse = require('../utils/apiResponse');

class CityController {
  static async getCities(req, res, next) {
    try {
      const { cities, meta } = await DiscoveryService.getCities(req.query);
      return ApiResponse.success(res, 'Cities retrieved successfully', cities, 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getFeaturedCities(req, res, next) {
    try {
      const cities = await DiscoveryService.getFeaturedCities(req.query.limit || 6);
      return ApiResponse.success(res, 'Featured destinations retrieved successfully', cities, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getCityById(req, res, next) {
    try {
      const city = await DiscoveryService.getCityById(req.params.cityId);
      return ApiResponse.success(res, 'City details retrieved successfully', city, 200);
    } catch (error) {
      next(error);
    }
  }

  static async createCity(req, res, next) {
    try {
      const city = await DiscoveryService.createCity(req.body);
      return ApiResponse.success(res, 'City created successfully', city, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateCity(req, res, next) {
    try {
      const updatedCity = await DiscoveryService.updateCity(req.params.cityId, req.body);
      return ApiResponse.success(res, 'City updated successfully', updatedCity, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCity(req, res, next) {
    try {
      const result = await DiscoveryService.deleteCity(req.params.cityId);
      return ApiResponse.success(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CityController;
