const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   - name: Admin & Analytics
 *     description: Platform monitoring, analytics and user role management
 */

// All admin routes require authentication and ADMIN role
router.use(protect);
router.use(restrictTo('ADMIN'));

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get comprehensive platform metrics and analytics
 *     tags: [Admin & Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform analytics
 */
router.get('/analytics', adminController.getAnalytics);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List platform users with pagination & search
 *     tags: [Admin & Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 */
router.get('/users', adminController.getUsers);

/**
 * @swagger
 * /admin/users/{userId}/role:
 *   patch:
 *     summary: Change user role (ADMIN / USER)
 *     tags: [Admin & Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [USER, ADMIN] }
 *     responses:
 *       200:
 *         description: User role updated
 */
router.patch('/users/:userId/role', adminController.updateUserRole);

module.exports = router;
