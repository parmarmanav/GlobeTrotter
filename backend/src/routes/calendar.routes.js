const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller');
const { protect, optionalAuth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Calendar & Timeline
 *     description: Travel timeline, schedule calendar events, and agenda views
 */

/**
 * @swagger
 * /calendar:
 *   get:
 *     summary: Get all upcoming, active and planned trip calendar events for current user
 *     tags: [Calendar & Timeline]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Calendar events
 */
router.get('/', protect, calendarController.getUserCalendar);

/**
 * @swagger
 * /calendar/trips/{tripId}:
 *   get:
 *     summary: Get calendar events and timeline specifically for a single trip
 *     tags: [Calendar & Timeline]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trip calendar events
 */
router.get('/trips/:tripId', optionalAuth, calendarController.getTripCalendar);

module.exports = router;
