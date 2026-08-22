const BudgetService = require('../services/budget.service');
const ApiResponse = require('../utils/apiResponse');

class BudgetController {
  static async getBudgetOverview(req, res, next) {
    try {
      const budget = await BudgetService.getTripBudget(req.params.tripId, req.user);
      return ApiResponse.success(res, 'Trip budget overview retrieved successfully', budget, 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateBudget(req, res, next) {
    try {
      const updatedBudget = await BudgetService.updateBudget(
        req.params.tripId,
        req.user._id,
        req.body,
        req.user.role
      );
      return ApiResponse.success(res, 'Trip budget updated successfully', updatedBudget, 200);
    } catch (error) {
      next(error);
    }
  }

  static async addExpense(req, res, next) {
    try {
      const expense = await BudgetService.addExpense(
        req.params.tripId,
        req.user._id,
        req.body,
        req.user.role
      );
      return ApiResponse.success(res, 'Expense logged successfully', expense, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getExpenses(req, res, next) {
    try {
      const { expenses, meta } = await BudgetService.getExpenses(
        req.params.tripId,
        req.user,
        req.query
      );
      return ApiResponse.success(res, 'Expenses retrieved successfully', expenses, 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getExpenseById(req, res, next) {
    try {
      const expense = await BudgetService.getExpenseById(
        req.params.tripId,
        req.params.expenseId,
        req.user
      );
      return ApiResponse.success(res, 'Expense retrieved successfully', expense, 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateExpense(req, res, next) {
    try {
      const updated = await BudgetService.updateExpense(
        req.params.tripId,
        req.params.expenseId,
        req.user._id,
        req.body,
        req.user.role
      );
      return ApiResponse.success(res, 'Expense updated successfully', updated, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteExpense(req, res, next) {
    try {
      const result = await BudgetService.deleteExpense(
        req.params.tripId,
        req.params.expenseId,
        req.user._id,
        req.user.role
      );
      return ApiResponse.success(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BudgetController;
