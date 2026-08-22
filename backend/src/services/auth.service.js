const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

class AuthService {
  static async registerUser(userData) {
    const { firstName, lastName, username, email, password, phoneNumber, city, country } = userData;

    // Check duplicate email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      const error = new Error('Email is already registered');
      error.statusCode = 400;
      throw error;
    }

    // Check duplicate username
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      const error = new Error('Username is already taken');
      error.statusCode = 400;
      throw error;
    }

    // Create user (pre-save hook hashes passwordHash)
    const user = await User.create({
      firstName,
      lastName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash: password,
      phoneNumber: phoneNumber || '',
      city: city || '',
      country: country || ''
    });

    const token = generateToken({ id: user._id, role: user.role });

    const userObj = user.toObject();
    delete userObj.passwordHash;

    return { user: userObj, token };
  }

  static async loginUser({ identifier, password }) {
    if (!identifier || !password) {
      const error = new Error('Please provide email/username and password');
      error.statusCode = 400;
      throw error;
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }]
    }).select('+passwordHash');

    if (!user) {
      const error = new Error('Invalid email/username or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email/username or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({ id: user._id, role: user.role });

    const userObj = user.toObject();
    delete userObj.passwordHash;

    return { user: userObj, token };
  }

  static async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const error = new Error('No user found with that email address');
      error.statusCode = 404;
      throw error;
    }

    // Generate reset token (simple dev implementation)
    const resetToken = generateToken({ id: user._id, type: 'reset' });
    return { message: 'Password reset token generated', resetToken };
  }

  static async resetPassword({ token, newPassword }) {
    const { verifyToken } = require('../utils/generateToken');
    const decoded = verifyToken(token);

    if (!decoded || decoded.type !== 'reset') {
      const error = new Error('Invalid or expired reset token');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    user.passwordHash = newPassword;
    await user.save();

    return { message: 'Password reset successful' };
  }
}

module.exports = AuthService;
