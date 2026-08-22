const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: User overview, upcoming trips, recent plans, and travel statistics
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get personalized user dashboard overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     welcomeMessage: { type: string, example: "Welcome back, John!" }
 *                     upcomingTrips: { type: array }
 *                     recentTrips: { type: array }
 *                     popularDestinations: { type: array }
 *                     budgetHighlights:
 *                       type: object
 *                       properties:
 *                         totalTrips: { type: integer, example: 5 }
 *                         activeTripsCount: { type: integer, example: 2 }
 *                         completedTripsCount: { type: integer, example: 3 }
 *                         totalBudgetPlanned: { type: number, example: 5000 }
 *                         totalExpensesLogged: { type: number, example: 1200 }
 *                         currency: { type: string, example: "USD" }
 */
router.get('/', protect, dashboardController.getDashboard);

module.exports = router;
