const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const upload = require('../middlewares/upload.middleware');
const { updateProfileValidation, updatePreferencesValidation } = require('../validators/user.validator');

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users / Profile]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', protect, userController.getProfile);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users / Profile]
 *     security:
 *       - bearerAuth: []
 */
router.put('/me', protect, updateProfileValidation, validate, userController.updateProfile);

/**
 * @swagger
 * /users/me/preferences:
 *   patch:
 *     summary: Update travel preferences & saved destinations
 *     tags: [Users / Profile]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/me/preferences', protect, updatePreferencesValidation, validate, userController.updatePreferences);

/**
 * @swagger
 * /users/me/profile-image:
 *   post:
 *     summary: Upload/update profile image
 *     tags: [Users / Profile]
 *     security:
 *       - bearerAuth: []
 */
router.post('/me/profile-image', protect, upload.single('profileImage'), userController.updateProfileImage);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete / Deactivate current user account
 *     tags: [Users / Profile]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/me', protect, userController.deleteAccount);

module.exports = router;
