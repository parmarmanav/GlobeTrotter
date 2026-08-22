const User = require('../models/User');
const City = require('../models/City');

class UserService {
  static async getUserProfile(userId) {
    const user = await User.findById(userId)
      .select('-passwordHash')
      .populate('preferences.savedDestinations');

    if (!user) {
      const error = new Error('User profile not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  static async updateUserProfile(userId, updateData) {
    const allowedFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'city', 'country', 'bio'];
    const filteredUpdates = {};

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updateData[key];
      }
    });

    // Check duplicate email if changing email
    if (filteredUpdates.email) {
      const existing = await User.findOne({
        email: filteredUpdates.email.toLowerCase(),
        _id: { $ne: userId }
      });
      if (existing) {
        const error = new Error('Email is already in use by another account');
        error.statusCode = 400;
        throw error;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: filteredUpdates }, { new: true, runValidators: true }).select('-passwordHash');

    return updatedUser;
  }

  static async updatePreferences(userId, preferencesData) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (preferencesData.language !== undefined) {
      user.preferences.language = preferencesData.language;
    }
    if (preferencesData.interests !== undefined) {
      user.preferences.interests = preferencesData.interests;
    }
    if (preferencesData.preferredBudgetRange !== undefined) {
      user.preferences.preferredBudgetRange = {
        ...user.preferences.preferredBudgetRange,
        ...preferencesData.preferredBudgetRange
      };
    }
    if (preferencesData.savedDestinations !== undefined) {
      user.preferences.savedDestinations = preferencesData.savedDestinations;
    }

    await user.save();
    return User.findById(userId).select('-passwordHash').populate('preferences.savedDestinations');
  }

  static async updateProfileImage(userId, profileImage) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { profileImage } },
      { new: true }
    ).select('-passwordHash');

    return updatedUser;
  }

  static async deleteAccount(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Soft delete by deactivating user
    user.isActive = false;
    await user.save();

    return { message: 'Account successfully deleted/deactivated' };
  }

  /**
   * Save a destination city to user preferences
   */
  static async addSavedDestination(userId, cityId) {
    const city = await City.findById(cityId);
    if (!city) {
      const error = new Error('City not found');
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (!user.preferences) user.preferences = {};
    if (!Array.isArray(user.preferences.savedDestinations)) {
      user.preferences.savedDestinations = [];
    }

    const cityIdStr = cityId.toString();
    const alreadySaved = user.preferences.savedDestinations.some(
      id => id.toString() === cityIdStr
    );

    if (!alreadySaved) {
      user.preferences.savedDestinations.push(cityId);
      await user.save();
    }

    const updatedUser = await User.findById(userId)
      .select('-passwordHash')
      .populate('preferences.savedDestinations');

    return {
      message: 'Destination saved successfully',
      savedDestinations: updatedUser.preferences.savedDestinations
    };
  }

  /**
   * Remove a saved destination from user preferences
   */
  static async removeSavedDestination(userId, cityId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.preferences && Array.isArray(user.preferences.savedDestinations)) {
      const cityIdStr = cityId.toString();
      user.preferences.savedDestinations = user.preferences.savedDestinations.filter(
        id => id.toString() !== cityIdStr
      );
      await user.save();
    }

    const updatedUser = await User.findById(userId)
      .select('-passwordHash')
      .populate('preferences.savedDestinations');

    return {
      message: 'Destination removed from saved list',
      savedDestinations: (updatedUser.preferences && updatedUser.preferences.savedDestinations) || []
    };
  }

  /**
   * Get all saved destinations for user
   */
  static async getSavedDestinations(userId) {
    const user = await User.findById(userId)
      .populate('preferences.savedDestinations')
      .lean();

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return (user.preferences && user.preferences.savedDestinations) || [];
  }
}

module.exports = UserService;
