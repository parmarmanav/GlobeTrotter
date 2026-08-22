const UserService = require('../services/user.service');
const ApiResponse = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    const profile = await UserService.getUserProfile(req.user._id);
    return ApiResponse.success(res, 'User profile fetched successfully', { user: profile }, 200);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await UserService.updateUserProfile(req.user._id, req.body);
    return ApiResponse.success(res, 'Profile updated successfully', { user: updatedUser }, 200);
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const updatedUser = await UserService.updatePreferences(req.user._id, req.body);
    return ApiResponse.success(res, 'User preferences updated successfully', { user: updatedUser }, 200);
  } catch (error) {
    next(error);
  }
};

const updateProfileImage = async (req, res, next) => {
  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.profileImage) {
      imageUrl = req.body.profileImage;
    } else {
      return ApiResponse.error(res, 'Please provide an image file or profileImage URL', 400);
    }

    const updatedUser = await UserService.updateProfileImage(req.user._id, imageUrl);
    return ApiResponse.success(res, 'Profile image updated successfully', { user: updatedUser }, 200);
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const result = await UserService.deleteAccount(req.user._id);
    return ApiResponse.success(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

const addSavedDestination = async (req, res, next) => {
  try {
    const result = await UserService.addSavedDestination(req.user._id, req.params.cityId);
    return ApiResponse.success(res, result.message, result.savedDestinations, 200);
  } catch (error) {
    next(error);
  }
};

const removeSavedDestination = async (req, res, next) => {
  try {
    const result = await UserService.removeSavedDestination(req.user._id, req.params.cityId);
    return ApiResponse.success(res, result.message, result.savedDestinations, 200);
  } catch (error) {
    next(error);
  }
};

const getSavedDestinations = async (req, res, next) => {
  try {
    const destinations = await UserService.getSavedDestinations(req.user._id);
    return ApiResponse.success(res, 'Saved destinations retrieved successfully', destinations, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  updateProfileImage,
  deleteAccount,
  addSavedDestination,
  removeSavedDestination,
  getSavedDestinations
};
