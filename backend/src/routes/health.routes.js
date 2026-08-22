const express = require('express');
const router = express.Router();
const { checkHealth } = require('../controllers/health.controller');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: GlobeTrotter API is running
 */
router.get('/health', checkHealth);

module.exports = router;
