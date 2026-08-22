const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const itineraryController = require('../controllers/itinerary.controller');
const calendarController = require('../controllers/calendar.controller');
const budgetRoutes = require('./budget.routes');
const { protect, optionalAuth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const {
  createTripValidation,
  updateTripValidation,
  tripQueryValidation,
  addStopValidation,
  updateStopValidation,
  reorderStopsValidation
} = require('../validators/trip.validator');
const {
  addDayValidation,
  updateDayValidation,
  addActivityValidation,
  updateActivityValidation,
  reorderActivitiesValidation
} = require('../validators/itinerary.validator');

/**
 * @swagger
 * tags:
 *   - name: Trips
 *     description: Trip planning, management and tracking
 *   - name: Stops
 *     description: Multi-city journey stop management
 *   - name: Itinerary
 *     description: Day-wise itinerary planning and activity scheduling
 */

// ==========================================
// 1. TRIP CRUD ENDPOINTS
// ==========================================

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, startDate, endDate]
 *             properties:
 *               name: { type: string, example: "Europe Adventure" }
 *               description: { type: string, example: "10 day Europe trip" }
 *               coverImage: { type: string }
 *               startDate: { type: string, format: date, example: "2026-10-01" }
 *               endDate: { type: string, format: date, example: "2026-10-10" }
 *               status: { type: string, enum: [PLANNED, ONGOING, COMPLETED, CANCELLED] }
 *               isPublic: { type: boolean }
 *               budget:
 *                 type: object
 *                 properties:
 *                   totalBudget: { type: number, example: 3000 }
 *                   currency: { type: string, example: "USD" }
 *     responses:
 *       201:
 *         description: Trip created successfully
 */
router.post('/', protect, createTripValidation, validate, tripController.createTrip);

/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Get user trips with search, filters, pagination and status counts
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search trip name, description, city, country
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PLANNED, ONGOING, COMPLETED, CANCELLED, ALL] }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [createdAt_desc, createdAt_asc, startDate_asc, startDate_desc, name_asc, name_desc] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Trips retrieved successfully
 */
router.get('/', protect, tripQueryValidation, validate, tripController.getTrips);

/**
 * @swagger
 * /trips/{tripId}:
 *   get:
 *     summary: Get trip details by ID
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trip details retrieved successfully
 *       403:
 *         description: Access denied (private trip)
 *       404:
 *         description: Trip not found
 */
router.get('/:tripId', optionalAuth, tripController.getTripById);

/**
 * @swagger
 * /trips/{tripId}:
 *   put:
 *     summary: Update trip details
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trip updated successfully
 */
router.put('/:tripId', protect, updateTripValidation, validate, tripController.updateTrip);

/**
 * @swagger
 * /trips/{tripId}:
 *   delete:
 *     summary: Delete trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 */
router.delete('/:tripId', protect, tripController.deleteTrip);

// ==========================================
// 2. STOP MANAGEMENT ENDPOINTS
// ==========================================

/**
 * @swagger
 * /trips/{tripId}/stops:
 *   post:
 *     summary: Add a new city stop to the trip
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cityId: { type: string }
 *               cityName: { type: string, example: "Paris" }
 *               country: { type: string, example: "France" }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *               sequenceOrder: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Stop added to trip
 */
router.post('/:tripId/stops', protect, addStopValidation, validate, tripController.addStop);

/**
 * @swagger
 * /trips/{tripId}/stops:
 *   get:
 *     summary: Get all stops for a trip
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Stops retrieved successfully
 */
router.get('/:tripId/stops', optionalAuth, tripController.getStops);

/**
 * @swagger
 * /trips/{tripId}/stops/reorder:
 *   patch:
 *     summary: Reorder trip stops
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stops]
 *             properties:
 *               stops:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stopId: { type: string }
 *                     sequenceOrder: { type: integer }
 *     responses:
 *       200:
 *         description: Stops reordered successfully
 */
router.patch('/:tripId/stops/reorder', protect, reorderStopsValidation, validate, tripController.reorderStops);

/**
 * @swagger
 * /trips/{tripId}/stops/{stopId}:
 *   put:
 *     summary: Update a stop in the trip
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Stop updated successfully
 */
router.put('/:tripId/stops/:stopId', protect, updateStopValidation, validate, tripController.updateStop);

/**
 * @swagger
 * /trips/{tripId}/stops/{stopId}:
 *   delete:
 *     summary: Delete a stop from the trip
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Stop removed successfully
 */
router.delete('/:tripId/stops/:stopId', protect, tripController.deleteStop);

// ==========================================
// 3. ITINERARY & ACTIVITIES ENDPOINTS
// ==========================================

/**
 * @swagger
 * /trips/{tripId}/itinerary:
 *   get:
 *     summary: Get complete trip itinerary (days and activities)
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Itinerary retrieved successfully
 */
router.get('/:tripId/itinerary', optionalAuth, itineraryController.getItinerary);

/**
 * @swagger
 * /trips/{tripId}/itinerary/days:
 *   post:
 *     summary: Add a new day to trip itinerary
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dayNumber: { type: integer, example: 1 }
 *               date: { type: string, format: date, example: "2026-10-01" }
 *               title: { type: string, example: "Day 1 - Arrival in Paris" }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Itinerary day created
 */
router.post('/:tripId/itinerary/days', protect, addDayValidation, validate, itineraryController.addDay);

/**
 * @swagger
 * /trips/{tripId}/itinerary/days/{dayId}:
 *   put:
 *     summary: Update an itinerary day
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Itinerary day updated
 */
router.put('/:tripId/itinerary/days/:dayId', protect, updateDayValidation, validate, itineraryController.updateDay);

/**
 * @swagger
 * /trips/{tripId}/itinerary/days/{dayId}:
 *   delete:
 *     summary: Delete an itinerary day
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Itinerary day removed
 */
router.delete('/:tripId/itinerary/days/:dayId', protect, itineraryController.deleteDay);

/**
 * @swagger
 * /trips/{tripId}/itinerary/days/{dayId}/activities:
 *   post:
 *     summary: Add an activity to an itinerary day
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activityId: { type: string }
 *               title: { type: string, example: "Eiffel Tower Summit Tour" }
 *               description: { type: string }
 *               startTime: { type: string, example: "10:00 AM" }
 *               endTime: { type: string, example: "12:30 PM" }
 *               estimatedCost: { type: number, example: 35 }
 *               category: { type: string, enum: [SIGHTSEEING, FOOD, ADVENTURE, CULTURE, SHOPPING, NATURE, ENTERTAINMENT, OTHER] }
 *               sequenceOrder: { type: integer, example: 1 }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Activity added to day
 */
router.post('/:tripId/itinerary/days/:dayId/activities', protect, addActivityValidation, validate, itineraryController.addActivity);

/**
 * @swagger
 * /trips/{tripId}/itinerary/days/{dayId}/activities/reorder:
 *   patch:
 *     summary: Reorder activities within an itinerary day
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [activities]
 *             properties:
 *               activities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId: { type: string }
 *                     sequenceOrder: { type: integer }
 *     responses:
 *       200:
 *         description: Activities reordered successfully
 */
router.patch(
  '/:tripId/itinerary/days/:dayId/activities/reorder',
  protect,
  reorderActivitiesValidation,
  validate,
  itineraryController.reorderActivities
);

/**
 * @swagger
 * /trips/{tripId}/itinerary/days/{dayId}/activities/{itemId}:
 *   put:
 *     summary: Update an activity item in an itinerary day
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Activity updated successfully
 */
router.put(
  '/:tripId/itinerary/days/:dayId/activities/:itemId',
  protect,
  updateActivityValidation,
  validate,
  itineraryController.updateActivity
);

/**
 * @swagger
 * /trips/{tripId}/itinerary/days/{dayId}/activities/{itemId}:
 *   delete:
 *     summary: Delete an activity item from an itinerary day
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Activity removed from day
 */
router.delete(
  '/:tripId/itinerary/days/:dayId/activities/:itemId',
  protect,
  itineraryController.deleteActivity
);

// ==========================================
// 4. BUDGET, EXPENSES & CALENDAR INTEGRATIONS
// ==========================================

/**
 * @swagger
 * /trips/{tripId}/calendar:
 *   get:
 *     summary: Get calendar timeline events for a trip
 *     tags: [Calendar & Timeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Calendar events
 */
router.get('/:tripId/calendar', optionalAuth, calendarController.getTripCalendar);

// Mount budget & expenses sub-routes
router.use('/:tripId/budget', budgetRoutes);
router.use('/:tripId', budgetRoutes);

module.exports = router;
