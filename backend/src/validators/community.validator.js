const { body, param, query } = require('express-validator');

const createPostValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Post title is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content is required')
    .isLength({ min: 5, max: 5000 })
    .withMessage('Content must be between 5 and 5000 characters'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of URLs'),
  body('images.*')
    .optional()
    .trim()
    .isString(),
  body('tripId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid Trip ID'),
  body('cityId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid City ID'),
  body('activityId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid Activity ID')
];

const updatePostValidation = [
  param('postId')
    .isMongoId()
    .withMessage('Invalid Post ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 3, max: 150 }),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ min: 5, max: 5000 }),
  body('images')
    .optional()
    .isArray(),
  body('tripId')
    .optional({ checkFalsy: true })
    .isMongoId(),
  body('cityId')
    .optional({ checkFalsy: true })
    .isMongoId(),
  body('activityId')
    .optional({ checkFalsy: true })
    .isMongoId()
];

const postQueryValidation = [
  query('search')
    .optional()
    .trim(),
  query('cityId')
    .optional()
    .isMongoId(),
  query('tripId')
    .optional()
    .isMongoId(),
  query('userId')
    .optional()
    .isMongoId(),
  query('sort')
    .optional()
    .trim(),
  query('sortBy')
    .optional()
    .trim(),
  query('page')
    .optional()
    .isInt({ min: 1 }),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
];

const addCommentValidation = [
  param('postId')
    .isMongoId()
    .withMessage('Invalid Post ID'),
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Comment text is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters')
];

module.exports = {
  createPostValidation,
  updatePostValidation,
  postQueryValidation,
  addCommentValidation
};
