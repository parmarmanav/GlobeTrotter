const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');
const activityController = require('../controllers/activity.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validation.middleware');
const {
  createCityValidation,
  updateCityValidation,
  cityQueryValidation
} = require('../validators/city.validator');
const { activityQueryValidation } = require('../validators/activity.validator');

/**
 * @swagger
 * tags:
 *   - name: Cities / Destinations
 *     description: City catalog, discovery, filtering and management
 */

/**
 * @swagger
 * /cities/featured/top:
 *   get:
 *     summary: Get featured and top popular destinations
 *     tags: [Cities / Destinations]
 *     responses:
 *       200:
 *         description: Top destinations retrieved
 */
router.get('/featured/top', cityController.getFeaturedCities);

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Discover and search cities with filtering and pagination
 *     tags: [Cities / Destinations]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: country
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: costIndex
 *         schema: { type: integer, minimum: 1, maximum: 5 }
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [popularity_desc, popularity_asc, cost_asc, cost_desc, name_asc, name_desc] }
 *     responses:
 *       200:
 *         description: List of cities
 */
router.get('/', cityQueryValidation, validate, cityController.getCities);

/**
 * @swagger
 * /cities/search:
 *   get:
 *     summary: Search and filter cities
 *     tags: [Cities / Destinations]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: country
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: minCost
 *         schema: { type: number }
 *       - in: query
 *         name: maxCost
 *         schema: { type: number }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', cityQueryValidation, validate, cityController.getCities);

/**
 * @swagger
 * /cities/{cityId}:
 *   get:
 *     summary: Get city details and top activities
 *     tags: [Cities / Destinations]
 *     parameters:
 *       - in: path
 *         name: cityId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: City details
 */
router.get('/:cityId', cityController.getCityById);

/**
 * @swagger
 * /cities/{cityId}/activities:
 *   get:
 *     summary: Get activities available in a specific city
 *     tags: [Cities / Destinations]
 *     parameters:
 *       - in: path
 *         name: cityId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: City activities
 */
router.get('/:cityId/activities', activityQueryValidation, validate, activityController.getActivitiesByCity);

/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Create new destination city (Admin / Seed)
 *     tags: [Cities / Destinations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: City created
 */
router.post('/', protect, restrictTo('ADMIN'), createCityValidation, validate, cityController.createCity);

/**
 * @swagger
 * /cities/{cityId}:
 *   put:
 *     summary: Update city details (Admin)
 *     tags: [Cities / Destinations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: City updated
 */
router.put('/:cityId', protect, restrictTo('ADMIN'), updateCityValidation, validate, cityController.updateCity);

/**
 * @swagger
 * /cities/{cityId}:
 *   delete:
 *     summary: Delete city (Admin)
 *     tags: [Cities / Destinations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: City deleted
 */
router.delete('/:cityId', protect, restrictTo('ADMIN'), cityController.deleteCity);

module.exports = router;
