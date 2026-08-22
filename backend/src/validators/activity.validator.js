const { body, param, query } = require('express-validator');
const { ACTIVITY_CATEGORIES } = require('../constants/expenseCategories');

const createActivityValidation = [
  body('cityId')
    .notEmpty()
    .withMessage('City ID is required')
    .isMongoId()
    .withMessage('City ID must be a valid MongoDB ObjectId'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Activity name is required')
    .isLength({ max: 150 }),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }),
  body('category')
    .optional()
    .isIn(Object.values(ACTIVITY_CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(ACTIVITY_CATEGORIES).join(', ')}`),
  body('image')
    .optional()
    .trim(),
  body('durationMinutes')
    .optional()
    .isInt({ min: 1 }),
  body('estimatedCost')
    .optional()
    .isNumeric()
    .custom(val => val >= 0),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }),
  body('popularityScore')
    .optional()
    .isInt({ min: 0, max: 100 }),
  body('tags')
    .optional()
    .isArray()
];

const updateActivityValidation = [
  param('activityId')
    .isMongoId()
    .withMessage('Invalid Activity ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty(),
  body('description')
    .optional()
    .trim(),
  body('category')
    .optional()
    .isIn(Object.values(ACTIVITY_CATEGORIES)),
  body('image')
    .optional()
    .trim(),
  body('durationMinutes')
    .optional()
    .isInt({ min: 1 }),
  body('estimatedCost')
    .optional()
    .isNumeric()
    .custom(val => val >= 0),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }),
  body('popularityScore')
    .optional()
    .isInt({ min: 0, max: 100 }),
  body('tags')
    .optional()
    .isArray()
];

const activityQueryValidation = [
  query('cityId')
    .optional()
    .isMongoId(),
  query('city')
    .optional()
    .trim(),
  query('category')
    .optional()
    .trim(),
  query('search')
    .optional()
    .trim(),
  query('minCost')
    .optional()
    .isNumeric(),
  query('maxCost')
    .optional()
    .isNumeric(),
  query('duration')
    .optional()
    .isNumeric(),
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }),
  query('minRating')
    .optional()
    .isFloat({ min: 0, max: 5 }),
  query('tag')
    .optional()
    .trim(),
  query('sort')
    .optional()
    .trim(),
  query('sortBy')
    .optional()
    .trim(),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc', 'ASC', 'DESC', '1', '-1']),
  query('page')
    .optional()
    .isInt({ min: 1 }),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
];

module.exports = {
  createActivityValidation,
  updateActivityValidation,
  activityQueryValidation
};
