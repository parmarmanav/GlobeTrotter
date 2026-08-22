const { body, param } = require('express-validator');
const { ACTIVITY_CATEGORIES } = require('../constants/expenseCategories');

const addDayValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  body('dayNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Day number must be a positive integer'),
  body('date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Date must be a valid date'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const updateDayValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  param('dayId')
    .isMongoId()
    .withMessage('Invalid Day ID'),
  body('dayNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Day number must be a positive integer'),
  body('date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Date must be a valid date'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const addActivityValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  param('dayId')
    .isMongoId()
    .withMessage('Invalid Day ID'),
  body('activityId')
    .optional()
    .isMongoId()
    .withMessage('Activity ID must be a valid MongoDB ObjectId'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Activity title cannot be empty')
    .isLength({ max: 150 })
    .withMessage('Title cannot exceed 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('startTime')
    .optional()
    .trim(),
  body('endTime')
    .optional()
    .trim(),
  body('estimatedCost')
    .optional()
    .isNumeric()
    .withMessage('Estimated cost must be a number')
    .custom((val) => val >= 0)
    .withMessage('Estimated cost cannot be negative'),
  body('category')
    .optional()
    .isIn(Object.values(ACTIVITY_CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(ACTIVITY_CATEGORIES).join(', ')}`),
  body('sequenceOrder')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sequence order must be a positive integer'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const updateActivityValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  param('dayId')
    .isMongoId()
    .withMessage('Invalid Day ID'),
  param('itemId')
    .isMongoId()
    .withMessage('Invalid Activity Item ID'),
  body('activityId')
    .optional()
    .isMongoId()
    .withMessage('Activity ID must be a valid MongoDB ObjectId'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Activity title cannot be empty')
    .isLength({ max: 150 }),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }),
  body('startTime')
    .optional()
    .trim(),
  body('endTime')
    .optional()
    .trim(),
  body('estimatedCost')
    .optional()
    .isNumeric()
    .withMessage('Estimated cost must be a number')
    .custom((val) => val >= 0),
  body('category')
    .optional()
    .isIn(Object.values(ACTIVITY_CATEGORIES)),
  body('sequenceOrder')
    .optional()
    .isInt({ min: 1 }),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
];

const reorderActivitiesValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  param('dayId')
    .isMongoId()
    .withMessage('Invalid Day ID'),
  body('activities')
    .isArray({ min: 1 })
    .withMessage('Activities must be a non-empty array of activity objects or item IDs')
];

module.exports = {
  addDayValidation,
  updateDayValidation,
  addActivityValidation,
  updateActivityValidation,
  reorderActivitiesValidation
};
