const { body } = require('express-validator');

const updateProfileValidation = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().trim().isEmail().withMessage('Must be a valid email address'),
  body('phoneNumber').optional().trim(),
  body('city').optional().trim(),
  body('country').optional().trim(),
  body('bio').optional().trim()
];

const updatePreferencesValidation = [
  body('language').optional().trim(),
  body('interests').optional().isArray().withMessage('Interests must be an array of strings'),
  body('preferredBudgetRange').optional().isObject().withMessage('Preferred budget range must be an object'),
  body('savedDestinations').optional().isArray().withMessage('Saved destinations must be an array of Mongo ObjectIds')
];

module.exports = {
  updateProfileValidation,
  updatePreferencesValidation
};
