const User = require('../models/User');
const Trip = require('../models/Trip');
const City = require('../models/City');
const Activity = require('../models/Activity');
const CommunityPost = require('../models/CommunityPost');
const PublicTrip = require('../models/PublicTrip');

class AnalyticsService {
  /**
   * Get comprehensive dashboard and admin system metrics
   */
  static async getPlatformAnalytics() {
    const [
      totalUsers,
      totalTrips,
      publicTripsCount,
      totalCities,
      totalActivities,
      totalPosts,
      popularDestinations,
      recentUsers,
      recentTrips
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Trip.countDocuments({}),
      Trip.countDocuments({ isPublic: true }),
      City.countDocuments({}),
      Activity.countDocuments({}),
      CommunityPost.countDocuments({}),
      City.find({}).sort({ popularityScore: -1 }).limit(5).lean(),
      User.find({}).select('-passwordHash').sort({ createdAt: -1 }).limit(5).lean(),
      Trip.find({}).populate('userId', 'firstName lastName username').sort({ createdAt: -1 }).limit(5).lean()
    ]);

    // Aggregate trip status breakdown
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
      overview: {
        totalUsers,
        totalTrips,
        publicTripsCount,
        totalCities,
        totalActivities,
        totalPosts
      },
      tripStatusBreakdown: statusCounts,
      popularDestinations,
      recentUsers,
      recentTrips
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
   * Update user role or status (Admin only)
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
}

module.exports = AnalyticsService;
