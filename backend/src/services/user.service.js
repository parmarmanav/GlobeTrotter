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
}

module.exports = UserService;
