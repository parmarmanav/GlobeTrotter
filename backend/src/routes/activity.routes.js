const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validation.middleware');
const {
  createActivityValidation,
  updateActivityValidation,
  activityQueryValidation
} = require('../validators/activity.validator');

/**
 * @swagger
 * tags:
 *   - name: Activities
 *     description: Activity catalog, category filtering, search and recommendations
 */

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Discover and search activities across cities
 *     tags: [Activities]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: cityId
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [SIGHTSEEING, FOOD, ADVENTURE, CULTURE, SHOPPING, NATURE, ENTERTAINMENT, OTHER] }
 *       - in: query
 *         name: maxCost
 *         schema: { type: number }
 *       - in: query
 *         name: minRating
 *         schema: { type: number }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [popularity_desc, rating_desc, cost_asc, cost_desc, name_asc] }
 *     responses:
 *       200:
 *         description: List of activities
 */
router.get('/', activityQueryValidation, validate, activityController.getActivities);

/**
 * @swagger
 * /activities/{activityId}:
 *   get:
 *     summary: Get single activity details
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Activity details
 */
router.get('/:activityId', activityController.getActivityById);

/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Create new activity (Admin / Curators)
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Activity created
 */
router.post('/', protect, restrictTo('ADMIN'), createActivityValidation, validate, activityController.createActivity);

/**
 * @swagger
 * /activities/{activityId}:
 *   put:
 *     summary: Update activity details (Admin)
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity updated
 */
router.put('/:activityId', protect, restrictTo('ADMIN'), updateActivityValidation, validate, activityController.updateActivity);

/**
 * @swagger
 * /activities/{activityId}:
 *   delete:
 *     summary: Delete activity (Admin)
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity deleted
 */
router.delete('/:activityId', protect, restrictTo('ADMIN'), activityController.deleteActivity);

module.exports = router;
