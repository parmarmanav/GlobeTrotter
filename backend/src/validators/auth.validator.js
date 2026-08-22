const { body } = require('express-validator');

const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phoneNumber').optional().trim(),
  body('city').optional().trim(),
  body('country').optional().trim()
];

const loginValidation = [
  body('identifier').trim().notEmpty().withMessage('Email or Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const forgotPasswordValidation = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Must be a valid email address')
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').notEmpty().withMessage('New password is required').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
};
