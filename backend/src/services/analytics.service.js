const User = require('../models/User');
const Trip = require('../models/Trip');
const City = require('../models/City');
const Activity = require('../models/Activity');
const CommunityPost = require('../models/CommunityPost');
const PublicTrip = require('../models/PublicTrip');

class AnalyticsService {
  /**
   * Get overview metrics
   */
  static async getOverviewAnalytics() {
    const [
      totalUsers,
      activeUsers,
      totalTrips,
      publicTripsCount,
      totalCities,
      totalActivities,
      totalPosts
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isActive: true }),
      Trip.countDocuments({}),
      Trip.countDocuments({ isPublic: true }),
      City.countDocuments({}),
      Activity.countDocuments({}),
      CommunityPost.countDocuments({})
    ]);

    // Trip status breakdown aggregation
    const tripsByStatus = await Trip.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusCounts = {
      PLANNED: 0,
      ONGOING: 0,
      COMPLETED: 0,
      CANCELLED: 0
    };

    tripsByStatus.forEach(item => {
      if (item._id && statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    return {
      totalUsers,
      activeUsers,
      totalTrips,
      publicTripsCount,
      totalCities,
      totalActivities,
      totalPosts,
      tripsByStatus: statusCounts
    };
  }

  /**
   * Get platform analytics summary (Backward compatibility)
   */
  static async getPlatformAnalytics() {
    const overview = await this.getOverviewAnalytics();
    const [popularDestinations, recentUsers, recentTrips] = await Promise.all([
      City.find({}).sort({ popularityScore: -1 }).limit(5).lean(),
      User.find({}).select('-passwordHash').sort({ createdAt: -1 }).limit(5).lean(),
      Trip.find({}).populate('userId', 'firstName lastName username').sort({ createdAt: -1 }).limit(5).lean()
    ]);

    return {
      overview: {
        totalUsers: overview.totalUsers,
        totalTrips: overview.totalTrips,
        publicTripsCount: overview.publicTripsCount,
        totalCities: overview.totalCities,
        totalActivities: overview.totalActivities,
        totalPosts: overview.totalPosts
      },
      tripStatusBreakdown: overview.tripsByStatus,
      popularDestinations,
      recentUsers,
      recentTrips
    };
  }

  /**
   * Get User Analytics
   */
  static async getUserAnalytics() {
    const [totalUsers, activeUsers, inactiveUsers, roleBreakdown] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }])
    ]);

    const roles = { USER: 0, ADMIN: 0 };
    roleBreakdown.forEach(item => {
      if (item._id && roles[item._id] !== undefined) {
        roles[item._id] = item.count;
      }
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      roleBreakdown: roles
    };
  }

  /**
   * Get Trip Analytics
   */
  static async getTripAnalytics() {
    const [totalTrips, publicTrips, privateTrips, statusAggregation, budgetStats] = await Promise.all([
      Trip.countDocuments({}),
      Trip.countDocuments({ isPublic: true }),
      Trip.countDocuments({ isPublic: false }),
      Trip.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Trip.aggregate([
        {
          $group: {
            _id: null,
            totalBudgetSum: { $sum: '$budget.totalBudget' },
            avgBudget: { $avg: '$budget.totalBudget' }
          }
        }
      ])
    ]);

    const statusCounts = { PLANNED: 0, ONGOING: 0, COMPLETED: 0, CANCELLED: 0 };
    statusAggregation.forEach(item => {
      if (item._id && statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    return {
      totalTrips,
      publicTrips,
      privateTrips,
      statusBreakdown: statusCounts,
      financials: {
        totalBudgetSum: budgetStats[0]?.totalBudgetSum || 0,
        averageTripBudget: Math.round(budgetStats[0]?.avgBudget || 0)
      }
    };
  }

  /**
   * Get City Analytics (Popularity & Trip Stops aggregation)
   */
  static async getCityAnalytics() {
    const topCitiesByStops = await Trip.aggregate([
      { $unwind: '$stops' },
      { $group: { _id: '$stops.cityId', cityName: { $first: '$stops.cityName' }, totalStops: { $sum: 1 } } },
      { $sort: { totalStops: -1 } },
      { $limit: 10 }
    ]);

    const topRatedCities = await City.find({}).sort({ popularityScore: -1 }).limit(10).lean();

    return {
      topCitiesByStops,
      topRatedCities
    };
  }

  /**
   * Get Activity Analytics (Itinerary usage & ratings)
   */
  static async getActivityAnalytics() {
    const topActivitiesByItinerary = await Trip.aggregate([
      { $unwind: '$itineraryDays' },
      { $unwind: '$itineraryDays.activities' },
      {
        $group: {
          _id: '$itineraryDays.activities.activityId',
          title: { $first: '$itineraryDays.activities.title' },
          totalUsage: { $sum: 1 }
        }
      },
      { $sort: { totalUsage: -1 } },
      { $limit: 10 }
    ]);

    const categoryDistribution = await Activity.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    return {
      topActivitiesByItinerary,
      categoryDistribution
    };
  }

  /**
   * List all users with filtering for admin management
   */
  static async getUsers(queryParams = {}) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (queryParams.search) {
      const regex = new RegExp(queryParams.search.trim(), 'i');
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { username: regex },
        { email: regex }
      ];
    }
    if (queryParams.role) {
      filter.role = queryParams.role.toUpperCase();
    }
    if (queryParams.status !== undefined) {
      filter.isActive = queryParams.status === 'true' || queryParams.status === true;
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    return {
      users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get user details by ID
   */
  static async getUserById(userId) {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Update user status (Active/Inactive)
   */
  static async updateUserStatus(userId, isActive) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    user.isActive = isActive;
    await user.save();

    return User.findById(userId).select('-passwordHash');
  }

  /**
   * Update user role (Admin only)
   */
  static async updateUserRole(userId, newRole) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    user.role = newRole;
    await user.save();

    return User.findById(userId).select('-passwordHash');
  }

  /**
   * Delete user (Admin only)
   */
  static async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    await User.findByIdAndDelete(userId);
    return { message: 'User deleted successfully' };
  }
}

module.exports = AnalyticsService;
