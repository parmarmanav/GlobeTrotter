const AuthService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const result = await AuthService.registerUser(req.body);
    return ApiResponse.success(res, 'User registered successfully', result, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await AuthService.loginUser(req.body);
    return ApiResponse.success(res, 'Login successful', result, 200);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await AuthService.forgotPassword(req.body.email);
    return ApiResponse.success(res, result.message, { resetToken: result.resetToken }, 200);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await AuthService.resetPassword(req.body);
    return ApiResponse.success(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    return ApiResponse.success(res, 'Authenticated user profile', { user: req.user }, 200);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // For stateless JWT, logout is handled by client removing the token.
    return ApiResponse.success(res, 'Logged out successfully', null, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  logout
};
