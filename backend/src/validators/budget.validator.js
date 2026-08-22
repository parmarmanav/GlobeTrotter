const { body, param, query } = require('express-validator');
const { EXPENSE_CATEGORIES } = require('../constants/expenseCategories');

const createExpenseValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Expense title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('amount')
    .notEmpty()
    .withMessage('Expense amount is required')
    .isNumeric()
    .withMessage('Amount must be a valid number')
    .custom(val => val > 0)
    .withMessage('Amount must be greater than 0'),
  body('category')
    .optional()
    .isIn(Object.values(EXPENSE_CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(EXPENSE_CATEGORIES).join(', ')}`),
  body('currency')
    .optional()
    .trim()
    .isLength({ min: 2, max: 5 })
    .withMessage('Currency must be 2 to 5 characters'),
  body('date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Date must be a valid ISO date'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const updateExpenseValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  param('expenseId')
    .isMongoId()
    .withMessage('Invalid Expense ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 }),
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom(val => val > 0)
    .withMessage('Amount must be greater than 0'),
  body('category')
    .optional()
    .isIn(Object.values(EXPENSE_CATEGORIES)),
  body('currency')
    .optional()
    .trim()
    .isLength({ min: 2, max: 5 }),
  body('date')
    .optional()
    .isISO8601()
    .toDate(),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
];

const updateBudgetValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  body('totalBudget')
    .notEmpty()
    .withMessage('totalBudget is required')
    .isNumeric()
    .withMessage('totalBudget must be a number')
    .custom(val => val >= 0)
    .withMessage('totalBudget cannot be negative'),
  body('currency')
    .optional()
    .trim()
    .isLength({ min: 2, max: 5 })
];

const expenseQueryValidation = [
  param('tripId')
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  query('category')
    .optional()
    .trim(),
  query('search')
    .optional()
    .trim(),
  query('startDate')
    .optional()
    .isISO8601(),
  query('endDate')
    .optional()
    .isISO8601(),
  query('sort')
    .optional()
    .trim(),
  query('page')
    .optional()
    .isInt({ min: 1 }),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
];

module.exports = {
  createExpenseValidation,
  updateExpenseValidation,
  updateBudgetValidation,
  expenseQueryValidation
};
