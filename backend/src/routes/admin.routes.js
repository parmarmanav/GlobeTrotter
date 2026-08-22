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

// Require authentication and ADMIN role for all routes in this router
router.use(protect);
router.use(restrictTo('ADMIN'));

/**
 * Analytics Routes
 */
router.get('/analytics', adminController.getAnalytics);
router.get('/analytics/overview', adminController.getOverviewAnalytics);
router.get('/analytics/users', adminController.getUserAnalytics);
router.get('/analytics/trips', adminController.getTripAnalytics);
router.get('/analytics/cities', adminController.getCityAnalytics);
router.get('/analytics/activities', adminController.getActivityAnalytics);

/**
 * User Management Routes
 */
router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUserById);
router.patch('/users/:userId/status', adminController.updateUserStatus);
router.patch('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router;
