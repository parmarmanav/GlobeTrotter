const express = require('express');
const router = express.Router({ mergeParams: true });
const budgetController = require('../controllers/budget.controller');
const { protect, optionalAuth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const {
  createExpenseValidation,
  updateExpenseValidation,
  updateBudgetValidation,
  expenseQueryValidation
} = require('../validators/budget.validator');

/**
 * @swagger
 * tags:
 *   - name: Budget & Expenses
 *     description: Trip expense tracking, budget estimation and category breakdowns
 */

/**
 * @swagger
 * /trips/{tripId}/budget:
 *   get:
 *     summary: Get trip budget summary, remaining funds and category expense breakdown
 *     tags: [Budget & Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Budget summary and charts data
 */
router.get('/', optionalAuth, budgetController.getBudgetOverview);

/**
 * @swagger
 * /trips/{tripId}/budget:
 *   put:
 *     summary: Update trip total budget and currency
 *     tags: [Budget & Expenses]
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
 *             required: [totalBudget]
 *             properties:
 *               totalBudget: { type: number, example: 3500 }
 *               currency: { type: string, example: "USD" }
 *     responses:
 *       200:
 *         description: Budget updated
 */
router.put('/', protect, updateBudgetValidation, validate, budgetController.updateBudget);

/**
 * @swagger
 * /trips/{tripId}/expenses:
 *   post:
 *     summary: Log a new expense to a trip
 *     tags: [Budget & Expenses]
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
 *             required: [title, amount]
 *             properties:
 *               title: { type: string, example: "Hotel in Kyoto" }
 *               amount: { type: number, example: 120 }
 *               category: { type: string, enum: [ACCOMMODATION, TRANSPORT, FOOD, ACTIVITIES, SHOPPING, OTHER], example: "ACCOMMODATION" }
 *               currency: { type: string, example: "USD" }
 *               date: { type: string, format: date }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Expense logged
 */
router.post('/expenses', protect, createExpenseValidation, validate, budgetController.addExpense);

/**
 * @swagger
 * /trips/{tripId}/expenses:
 *   get:
 *     summary: List trip expenses with search, category filtering, date range and pagination
 *     tags: [Budget & Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [date_desc, date_asc, amount_desc, amount_asc] }
 *     responses:
 *       200:
 *         description: Expenses list
 */
router.get('/expenses', optionalAuth, expenseQueryValidation, validate, budgetController.getExpenses);

/**
 * @swagger
 * /trips/{tripId}/expenses/{expenseId}:
 *   get:
 *     summary: Get single expense item
 *     tags: [Budget & Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Expense item
 */
router.get('/expenses/:expenseId', optionalAuth, budgetController.getExpenseById);

/**
 * @swagger
 * /trips/{tripId}/expenses/{expenseId}:
 *   put:
 *     summary: Update an expense item
 *     tags: [Budget & Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Expense updated
 */
router.put('/expenses/:expenseId', protect, updateExpenseValidation, validate, budgetController.updateExpense);

/**
 * @swagger
 * /trips/{tripId}/expenses/{expenseId}:
 *   delete:
 *     summary: Delete an expense item
 *     tags: [Budget & Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Expense deleted
 */
router.delete('/expenses/:expenseId', protect, budgetController.deleteExpense);

module.exports = router;
