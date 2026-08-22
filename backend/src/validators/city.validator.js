const { body, param, query } = require('express-validator');

const createCityValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('City name is required')
    .isLength({ max: 100 }),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 100 }),
  body('region')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }),
  body('image')
    .optional()
    .trim(),
  body('latitude')
    .optional()
    .isNumeric(),
  body('longitude')
    .optional()
    .isNumeric(),
  body('costIndex')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Cost index must be between 1 and 5'),
  body('popularityScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Popularity score must be between 0 and 100'),
  body('tags')
    .optional()
    .isArray()
];

const updateCityValidation = [
  param('cityId')
    .isMongoId()
    .withMessage('Invalid City ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty(),
  body('country')
    .optional()
    .trim()
    .notEmpty(),
  body('region')
    .optional()
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('image')
    .optional()
    .trim(),
  body('costIndex')
    .optional()
    .isInt({ min: 1, max: 5 }),
  body('popularityScore')
    .optional()
    .isInt({ min: 0, max: 100 }),
  body('tags')
    .optional()
    .isArray()
];

const cityQueryValidation = [
  query('search')
    .optional()
    .trim(),
  query('country')
    .optional()
    .trim(),
  query('region')
    .optional()
    .trim(),
  query('costIndex')
    .optional()
    .isInt({ min: 1, max: 5 }),
  query('minCost')
    .optional()
    .isNumeric(),
  query('maxCost')
    .optional()
    .isNumeric(),
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
  createCityValidation,
  updateCityValidation,
  cityQueryValidation
};
