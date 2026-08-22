const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('../validators/auth.validator');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, username, email, password]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phoneNumber: { type: string }
 *               city: { type: string }
 *               country: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', registerValidation, validate, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier: { type: string, description: "Email or Username" }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', loginValidation, validate, authController.login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset token
 *     tags: [Authentication]
 */
router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Authentication]
 */
router.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', protect, authController.getMe);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 */
router.post('/logout', authController.logout);

module.exports = router;
