const express = require('express');
const router = express.Router();
const publicTripController = require('../controllers/publicTrip.controller');
const { protect } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Public Trips & Sharing
 *     description: Public trip sharing, social browsing and trip copying
 */

/**
 * @swagger
 * /public/trips/{slug}:
 *   get:
 *     summary: View a public trip by unique shareable slug
 *     tags: [Public Trips & Sharing]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Public trip details
 *       404:
 *         description: Public trip not found
 */
router.get('/trips/:slug', publicTripController.getPublicTripBySlug);

/**
 * @swagger
 * /public/trips/{slug}/copy:
 *   post:
 *     summary: Copy an existing public trip to current user's profile
 *     tags: [Public Trips & Sharing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Trip cloned successfully
 */
router.post('/trips/:slug/copy', protect, publicTripController.copyPublicTrip);

module.exports = router;
