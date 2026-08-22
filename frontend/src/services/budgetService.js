import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const budgetService = {
  getBudget: (tripId) => apiClient.get(ENDPOINTS.TRIPS.BUDGET(tripId)),
  updateBudget: (tripId, budgetData) => apiClient.put(ENDPOINTS.TRIPS.BUDGET(tripId), budgetData),
  getBudgetSummary: (tripId) => apiClient.get(ENDPOINTS.TRIPS.BUDGET_SUMMARY(tripId)),

  // Expenses
  getExpenses: (tripId) => apiClient.get(ENDPOINTS.TRIPS.EXPENSES(tripId)),
  addExpense: (tripId, expenseData) => apiClient.post(ENDPOINTS.TRIPS.EXPENSES(tripId), expenseData),
  updateExpense: (tripId, expenseId, expenseData) =>
    apiClient.put(ENDPOINTS.TRIPS.EXPENSE_BY_ID(tripId, expenseId), expenseData),
  deleteExpense: (tripId, expenseId) =>
    apiClient.delete(ENDPOINTS.TRIPS.EXPENSE_BY_ID(tripId, expenseId)),
}
