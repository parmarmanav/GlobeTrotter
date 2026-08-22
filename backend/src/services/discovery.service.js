const mongoose = require('mongoose');
const City = require('../models/City');
const Activity = require('../models/Activity');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

class DiscoveryService {
  // ----------------------------------------------------
  // CITY DISCOVERY & SEARCH
  // ----------------------------------------------------

  /**
   * Get all cities with search, filter, and pagination
   */
  static async getCities(queryParams = {}) {
    const { page, limit, skip } = getPaginationParams(queryParams);
    const { search, country, region, costIndex, minCost, maxCost, tag, sort, sortBy, sortOrder } = queryParams;

    const filter = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { country: regex },
        { region: regex },
        { description: regex },
        { tags: { $in: [regex] } }
      ];
    }

    if (country) {
      filter.country = new RegExp(`^${country.trim()}$`, 'i');
    }

    if (region) {
      filter.region = new RegExp(`^${region.trim()}$`, 'i');
    }

    if (minCost !== undefined && minCost !== '' && maxCost !== undefined && maxCost !== '') {
      filter.costIndex = { $gte: Number(minCost), $lte: Number(maxCost) };
    } else if (minCost !== undefined && minCost !== '') {
      filter.costIndex = { $gte: Number(minCost) };
    } else if (maxCost !== undefined && maxCost !== '') {
      filter.costIndex = { $lte: Number(maxCost) };
    } else if (costIndex) {
      filter.costIndex = Number(costIndex);
    }

    if (tag) {
      filter.tags = { $in: [new RegExp(tag.trim(), 'i')] };
    }

    let sortOption = { popularityScore: -1, createdAt: -1 };
    if (sort === 'popularity_asc') sortOption = { popularityScore: 1 };
    else if (sort === 'popularity_desc') sortOption = { popularityScore: -1 };
    else if (sort === 'cost_asc') sortOption = { costIndex: 1 };
    else if (sort === 'cost_desc') sortOption = { costIndex: -1 };
    else if (sort === 'name_asc') sortOption = { name: 1 };
    else if (sort === 'name_desc') sortOption = { name: -1 };

    if (sortBy) {
      const order = sortOrder === 'asc' || sortOrder === '1' || sortOrder === 1 ? 1 : -1;
      if (sortBy === 'cost' || sortBy === 'costIndex') sortOption = { costIndex: order };
      else if (sortBy === 'popularity' || sortBy === 'popularityScore') sortOption = { popularityScore: order };
      else if (sortBy === 'name') sortOption = { name: order };
      else if (sortBy === 'createdAt') sortOption = { createdAt: order };
    }

    const [cities, total] = await Promise.all([
      City.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
      City.countDocuments(filter)
    ]);

    const meta = getPaginationMeta(total, page, limit);
    return { cities, meta };
  }

  /**
   * Get top featured destinations
   */
  static async getFeaturedCities(limit = 6) {
    const cities = await City.find({})
      .sort({ popularityScore: -1, createdAt: -1 })
      .limit(Number(limit))
      .lean();
    return cities;
  }

  /**
   * Get single city with its activities
   */
  static async getCityById(cityId) {
    const city = await City.findById(cityId).lean();

    if (!city) {
      const error = new Error('City not found');
      error.statusCode = 404;
      throw error;
    }

    const activities = await Activity.find({ cityId })
      .sort({ popularityScore: -1, rating: -1 })
      .limit(20)
      .lean();

    return { ...city, activities };
  }

  /**
   * Create city (Admin)
   */
  static async createCity(cityData) {
    const existing = await City.findOne({
      name: new RegExp(`^${cityData.name.trim()}$`, 'i'),
      country: new RegExp(`^${cityData.country.trim()}$`, 'i')
    });

    if (existing) {
      const error = new Error('City with this name and country already exists');
      error.statusCode = 400;
      throw error;
    }

    const city = new City({
      name: cityData.name,
      country: cityData.country,
      region: cityData.region || '',
      description: cityData.description || '',
      image: cityData.image || '',
      latitude: cityData.latitude,
      longitude: cityData.longitude,
      costIndex: cityData.costIndex !== undefined ? Number(cityData.costIndex) : 1,
      popularityScore: cityData.popularityScore !== undefined ? Number(cityData.popularityScore) : 50,
      tags: cityData.tags || []
    });

    await city.save();
    return city;
  }

  /**
   * Update city (Admin)
   */
  static async updateCity(cityId, updateData) {
    const city = await City.findById(cityId);

    if (!city) {
      const error = new Error('City not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.name !== undefined) city.name = updateData.name;
    if (updateData.country !== undefined) city.country = updateData.country;
    if (updateData.region !== undefined) city.region = updateData.region;
    if (updateData.description !== undefined) city.description = updateData.description;
    if (updateData.image !== undefined) city.image = updateData.image;
    if (updateData.latitude !== undefined) city.latitude = updateData.latitude;
    if (updateData.longitude !== undefined) city.longitude = updateData.longitude;
    if (updateData.costIndex !== undefined) city.costIndex = Number(updateData.costIndex);
    if (updateData.popularityScore !== undefined) city.popularityScore = Number(updateData.popularityScore);
    if (updateData.tags !== undefined) city.tags = updateData.tags;

    await city.save();
    return city;
  }

  /**
   * Delete city (Admin)
   */
  static async deleteCity(cityId) {
    const city = await City.findByIdAndDelete(cityId);

    if (!city) {
      const error = new Error('City not found');
      error.statusCode = 404;
      throw error;
    }

    // Also remove associated activities
    await Activity.deleteMany({ cityId });
    return { message: 'City and associated activities removed successfully', id: cityId };
  }

  // ----------------------------------------------------
  // ACTIVITY DISCOVERY & SEARCH
  // ----------------------------------------------------

  /**
   * Get activities across all cities with filters
   */
  static async getActivities(queryParams = {}) {
    const { page, limit, skip } = getPaginationParams(queryParams);
    const {
      cityId,
      city,
      category,
      search,
      minCost,
      maxCost,
      duration,
      rating,
      minRating,
      tag,
      sort,
      sortBy,
      sortOrder
    } = queryParams;

    const filter = {};

    if (cityId) {
      filter.cityId = cityId;
    } else if (city && city.trim() !== '') {
      if (mongoose.Types.ObjectId.isValid(city.trim())) {
        filter.cityId = city.trim();
      } else {
        const matchingCities = await City.find(
          { name: new RegExp(city.trim(), 'i') },
          '_id'
        ).lean();
        filter.cityId = { $in: matchingCities.map(c => c._id) };
      }
    }

    if (category && category.toUpperCase() !== 'ALL') {
      filter.category = category.toUpperCase();
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { description: regex },
        { tags: { $in: [regex] } }
      ];
    }

    if (minCost !== undefined && minCost !== '' && maxCost !== undefined && maxCost !== '') {
      filter.estimatedCost = { $gte: Number(minCost), $lte: Number(maxCost) };
    } else if (minCost !== undefined && minCost !== '') {
      filter.estimatedCost = { $gte: Number(minCost) };
    } else if (maxCost !== undefined && maxCost !== '') {
      filter.estimatedCost = { $lte: Number(maxCost) };
    }

    if (duration !== undefined && duration !== '') {
      filter.durationMinutes = { $lte: Number(duration) };
    }

    const ratingFilter = rating !== undefined && rating !== '' ? rating : minRating;
    if (ratingFilter !== undefined && ratingFilter !== '') {
      filter.rating = { $gte: Number(ratingFilter) };
    }

    if (tag) {
      filter.tags = { $in: [new RegExp(tag.trim(), 'i')] };
    }

    let sortOption = { popularityScore: -1, rating: -1 };
    if (sort === 'popularity_desc') sortOption = { popularityScore: -1 };
    else if (sort === 'rating_desc') sortOption = { rating: -1 };
    else if (sort === 'cost_asc') sortOption = { estimatedCost: 1 };
    else if (sort === 'cost_desc') sortOption = { estimatedCost: -1 };
    else if (sort === 'name_asc') sortOption = { name: 1 };

    if (sortBy) {
      const order = sortOrder === 'asc' || sortOrder === '1' || sortOrder === 1 ? 1 : -1;
      if (sortBy === 'cost' || sortBy === 'estimatedCost') sortOption = { estimatedCost: order };
      else if (sortBy === 'popularity' || sortBy === 'popularityScore') sortOption = { popularityScore: order };
      else if (sortBy === 'rating') sortOption = { rating: order };
      else if (sortBy === 'name') sortOption = { name: order };
      else if (sortBy === 'duration' || sortBy === 'durationMinutes') sortOption = { durationMinutes: order };
    }

    const [activities, total] = await Promise.all([
      Activity.find(filter)
        .populate('cityId', 'name country image')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Activity.countDocuments(filter)
    ]);

    const meta = getPaginationMeta(total, page, limit);
    return { activities, meta };
  }

  /**
   * Get single activity by ID
   */
  static async getActivityById(activityId) {
    const activity = await Activity.findById(activityId)
      .populate('cityId', 'name country region image costIndex')
      .lean();

    if (!activity) {
      const error = new Error('Activity not found');
      error.statusCode = 404;
      throw error;
    }

    return activity;
  }

  /**
   * Create activity (Admin)
   */
  static async createActivity(activityData) {
    const city = await City.findById(activityData.cityId);
    if (!city) {
      const error = new Error('Referenced City not found');
      error.statusCode = 404;
      throw error;
    }

    const activity = new Activity({
      cityId: activityData.cityId,
      name: activityData.name,
      description: activityData.description || '',
      category: activityData.category || 'SIGHTSEEING',
      image: activityData.image || '',
      durationMinutes: activityData.durationMinutes !== undefined ? Number(activityData.durationMinutes) : 60,
      estimatedCost: activityData.estimatedCost !== undefined ? Number(activityData.estimatedCost) : 0,
      rating: activityData.rating !== undefined ? Number(activityData.rating) : 4.5,
      popularityScore: activityData.popularityScore !== undefined ? Number(activityData.popularityScore) : 50,
      tags: activityData.tags || []
    });

    await activity.save();
    return activity;
  }

  /**
   * Update activity (Admin)
   */
  static async updateActivity(activityId, updateData) {
    const activity = await Activity.findById(activityId);

    if (!activity) {
      const error = new Error('Activity not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.cityId) {
      const city = await City.findById(updateData.cityId);
      if (!city) {
        const error = new Error('Referenced City not found');
        error.statusCode = 404;
        throw error;
      }
      activity.cityId = updateData.cityId;
    }

    if (updateData.name !== undefined) activity.name = updateData.name;
    if (updateData.description !== undefined) activity.description = updateData.description;
    if (updateData.category !== undefined) activity.category = updateData.category;
    if (updateData.image !== undefined) activity.image = updateData.image;
    if (updateData.durationMinutes !== undefined) activity.durationMinutes = Number(updateData.durationMinutes);
    if (updateData.estimatedCost !== undefined) activity.estimatedCost = Number(updateData.estimatedCost);
    if (updateData.rating !== undefined) activity.rating = Number(updateData.rating);
    if (updateData.popularityScore !== undefined) activity.popularityScore = Number(updateData.popularityScore);
    if (updateData.tags !== undefined) activity.tags = updateData.tags;

    await activity.save();
    return activity;
  }

  /**
   * Delete activity (Admin)
   */
  static async deleteActivity(activityId) {
    const activity = await Activity.findByIdAndDelete(activityId);

    if (!activity) {
      const error = new Error('Activity not found');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Activity deleted successfully', id: activityId };
  }
}

module.exports = DiscoveryService;
