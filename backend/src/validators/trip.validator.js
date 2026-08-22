const { body, query, param } = require('express-validator');
const TRIP_STATUS = require('../constants/tripStatus');

const createTripValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Trip name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Trip name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('coverImage')
    .optional()
    .trim()
    .isString()
    .withMessage('Cover image must be a valid string URL or path'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .toDate()
    .withMessage('Start date must be a valid date (YYYY-MM-DD)'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .toDate()
    .withMessage('End date must be a valid date (YYYY-MM-DD)')
    .custom((endDate, { req }) => {
      if (req.body.startDate && new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error('End date must be on or after start date');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(Object.values(TRIP_STATUS))
    .withMessage(`Status must be one of: ${Object.values(TRIP_STATUS).join(', ')}`),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('budget.totalBudget')
    .optional()
    .isNumeric()
    .withMessage('Total budget must be a number')
    .custom((val) => val >= 0)
    .withMessage('Total budget cannot be negative'),
  body('budget.currency')
    .optional()
    .trim()
    .isLength({ min: 2, max: 5 })
    .withMessage('Currency code must be 2 to 5 characters')
];

const updateTripValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Trip name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Trip name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('coverImage')
    .optional()
    .trim()
    .isString(),
  body('startDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('End date must be a valid date')
    .custom((endDate, { req }) => {
      if (req.body.startDate && new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error('End date must be on or after start date');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(Object.values(TRIP_STATUS))
    .withMessage(`Status must be one of: ${Object.values(TRIP_STATUS).join(', ')}`),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('budget.totalBudget')
    .optional()
    .isNumeric()
    .withMessage('Total budget must be a number')
    .custom((val) => val >= 0)
    .withMessage('Total budget cannot be negative'),
  body('budget.currency')
    .optional()
    .trim()
    .isLength({ min: 2, max: 5 })
];

const tripQueryValidation = [
  query('search')
    .optional()
    .trim(),
  query('status')
    .optional()
    .isIn([...Object.values(TRIP_STATUS), 'ALL', 'all'])
    .withMessage(`Status filter must be one of: ${Object.values(TRIP_STATUS).join(', ')}, ALL`),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date filter must be a valid date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date filter must be a valid date'),
  query('sort')
    .optional()
    .trim(),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be an integer >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const addStopValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  body('cityId')
    .optional()
    .isMongoId()
    .withMessage('City ID must be a valid MongoDB ObjectId'),
  body('cityName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City name cannot be empty'),
  body('country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty'),
  body('startDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('End date must be a valid date'),
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

const updateStopValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  param('stopId')
    .isMongoId()
    .withMessage('Invalid Stop ID'),
  body('cityId')
    .optional()
    .isMongoId()
    .withMessage('City ID must be a valid MongoDB ObjectId'),
  body('cityName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City name cannot be empty'),
  body('country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty'),
  body('startDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('End date must be a valid date'),
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

const reorderStopsValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  body('stops')
    .isArray({ min: 1 })
    .withMessage('Stops must be a non-empty array of stop objects or stop IDs')
];

module.exports = {
  createTripValidation,
  updateTripValidation,
  tripQueryValidation,
  addStopValidation,
  updateStopValidation,
  reorderStopsValidation
};
