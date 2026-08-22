const Trip = require('../models/Trip');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const { EXPENSE_CATEGORIES } = require('../constants/expenseCategories');

class BudgetService {
  /**
   * Calculate budget overview and category breakdown for a trip
   */
  static async getTripBudget(tripId, user) {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    const isOwner = user && trip.userId.toString() === user._id.toString();
    const isAdmin = user && user.role === 'ADMIN';

    if (!isOwner && !isAdmin && !trip.isPublic) {
      const error = new Error('Access denied. This trip is private');
      error.statusCode = 403;
      throw error;
    }

    const totalBudget = (trip.budget && Number(trip.budget.totalBudget)) || 0;
    const currency = (trip.budget && trip.budget.currency) || 'USD';

    let totalExpenses = 0;
    const categoryTotals = {};

    // Initialize category totals
    Object.values(EXPENSE_CATEGORIES).forEach(cat => {
      categoryTotals[cat] = { category: cat, totalAmount: 0, count: 0, percentage: 0 };
    });

    if (Array.isArray(trip.expenses)) {
      trip.expenses.forEach(exp => {
        const amount = Number(exp.amount || 0);
        totalExpenses += amount;

        const cat = exp.category || 'OTHER';
        if (!categoryTotals[cat]) {
          categoryTotals[cat] = { category: cat, totalAmount: 0, count: 0, percentage: 0 };
        }
        categoryTotals[cat].totalAmount += amount;
        categoryTotals[cat].count += 1;
      });
    }

    // Calculate percentage breakdown
    const categoryBreakdown = Object.values(categoryTotals).map(item => {
      item.totalAmount = Math.round(item.totalAmount * 100) / 100;
      item.percentage = totalExpenses > 0 ? Math.round((item.totalAmount / totalExpenses) * 1000) / 10 : 0;
      return item;
    });

    const remainingBudget = Math.round((totalBudget - totalExpenses) * 100) / 100;
    const percentageUsed = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 1000) / 10 : 0;
    const isOverBudget = totalExpenses > totalBudget;

    const recentExpenses = [...(trip.expenses || [])]
      .sort((a, b) => new Date(b.date || b._id.getTimestamp()) - new Date(a.date || a._id.getTimestamp()))
      .slice(0, 5);

    return {
      tripId: trip._id,
      tripName: trip.name,
      totalBudget: Math.round(totalBudget * 100) / 100,
      currency,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      remainingBudget,
      percentageUsed,
      isOverBudget,
      categoryBreakdown,
      expenseCount: (trip.expenses && trip.expenses.length) || 0,
      recentExpenses
    };
  }

  /**
   * Update overall trip budget
   */
  static async updateBudget(tripId, userId, budgetData, userRole = 'USER') {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not own this trip');
      error.statusCode = 403;
      throw error;
    }

    if (!trip.budget) trip.budget = {};
    if (budgetData.totalBudget !== undefined) {
      trip.budget.totalBudget = Number(budgetData.totalBudget);
    }
    if (budgetData.currency !== undefined) {
      trip.budget.currency = budgetData.currency;
    }

    await trip.save();
    return this.getTripBudget(tripId, { _id: userId, role: userRole });
  }

  /**
   * Add expense to trip
   */
  static async addExpense(tripId, userId, expenseData, userRole = 'USER') {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not own this trip');
      error.statusCode = 403;
      throw error;
    }

    const newExpense = {
      title: expenseData.title,
      amount: Number(expenseData.amount),
      category: expenseData.category || 'OTHER',
      currency: expenseData.currency || (trip.budget && trip.budget.currency) || 'USD',
      date: expenseData.date ? new Date(expenseData.date) : new Date(),
      notes: expenseData.notes || ''
    };

    trip.expenses.push(newExpense);
    await trip.save();

    const createdExpense = trip.expenses[trip.expenses.length - 1];
    return createdExpense;
  }

  /**
   * List trip expenses with filtering and pagination
   */
  static async getExpenses(tripId, user, queryParams = {}) {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    const isOwner = user && trip.userId.toString() === user._id.toString();
    const isAdmin = user && user.role === 'ADMIN';

    if (!isOwner && !isAdmin && !trip.isPublic) {
      const error = new Error('Access denied. This trip is private');
      error.statusCode = 403;
      throw error;
    }

    let filtered = [...(trip.expenses || [])];

    // Filter by Category
    if (queryParams.category && queryParams.category.toUpperCase() !== 'ALL') {
      filtered = filtered.filter(e => e.category === queryParams.category.toUpperCase());
    }

    // Filter by Search text in title or notes
    if (queryParams.search && queryParams.search.trim() !== '') {
      const q = queryParams.search.trim().toLowerCase();
      filtered = filtered.filter(e =>
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.notes && e.notes.toLowerCase().includes(q))
      );
    }

    // Filter by Date range
    if (queryParams.startDate) {
      const start = new Date(queryParams.startDate);
      filtered = filtered.filter(e => new Date(e.date) >= start);
    }
    if (queryParams.endDate) {
      const end = new Date(queryParams.endDate);
      filtered = filtered.filter(e => new Date(e.date) <= end);
    }

    // Sort
    const sort = queryParams.sort || 'date_desc';
    filtered.sort((a, b) => {
      if (sort === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sort === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sort === 'amount_asc') return Number(a.amount) - Number(b.amount);
      if (sort === 'amount_desc') return Number(b.amount) - Number(a.amount);
      return new Date(b.date) - new Date(a.date);
    });

    const { page, limit, skip } = getPaginationParams(queryParams);
    const paginatedExpenses = filtered.slice(skip, skip + limit);
    const meta = getPaginationMeta(filtered.length, page, limit);

    return { expenses: paginatedExpenses, meta };
  }

  /**
   * Get single expense by ID
   */
  static async getExpenseById(tripId, expenseId, user) {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    const isOwner = user && trip.userId.toString() === user._id.toString();
    const isAdmin = user && user.role === 'ADMIN';

    if (!isOwner && !isAdmin && !trip.isPublic) {
      const error = new Error('Access denied. This trip is private');
      error.statusCode = 403;
      throw error;
    }

    const expense = trip.expenses.id(expenseId);
    if (!expense) {
      const error = new Error('Expense item not found');
      error.statusCode = 404;
      throw error;
    }

    return expense;
  }

  /**
   * Update an existing expense
   */
  static async updateExpense(tripId, expenseId, userId, updateData, userRole = 'USER') {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not own this trip');
      error.statusCode = 403;
      throw error;
    }

    const expense = trip.expenses.id(expenseId);
    if (!expense) {
      const error = new Error('Expense item not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.title !== undefined) expense.title = updateData.title;
    if (updateData.amount !== undefined) expense.amount = Number(updateData.amount);
    if (updateData.category !== undefined) expense.category = updateData.category;
    if (updateData.currency !== undefined) expense.currency = updateData.currency;
    if (updateData.date !== undefined) expense.date = new Date(updateData.date);
    if (updateData.notes !== undefined) expense.notes = updateData.notes;

    await trip.save();
    return expense;
  }

  /**
   * Delete an expense from trip
   */
  static async deleteExpense(tripId, expenseId, userId, userRole = 'USER') {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    if (trip.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not own this trip');
      error.statusCode = 403;
      throw error;
    }

    const expense = trip.expenses.id(expenseId);
    if (!expense) {
      const error = new Error('Expense item not found');
      error.statusCode = 404;
      throw error;
    }

    trip.expenses.pull({ _id: expenseId });
    await trip.save();

    return { message: 'Expense deleted successfully', id: expenseId };
  }
}

module.exports = BudgetService;
