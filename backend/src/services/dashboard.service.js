const Trip = require('../models/Trip');
const City = require('../models/City');
const TRIP_STATUS = require('../constants/tripStatus');

class DashboardService {
  /**
   * Get personalized user dashboard data
   */
  static async getDashboardData(userId, user) {
    const now = new Date();

    // 1. Fetch user's trips
    const allUserTrips = await Trip.find({ userId })
      .populate('stops.cityId', 'name country image popularityScore')
      .sort({ updatedAt: -1 })
      .lean();

    // 2. Upcoming trips: Planned or future startDate, sorted by closest startDate
    const upcomingTrips = allUserTrips
      .filter(t => t.status === TRIP_STATUS.PLANNED || new Date(t.startDate) >= now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 5);

    // 3. Recent trips: Most recently updated
    const recentTrips = allUserTrips.slice(0, 5);

    // 4. Popular destinations: Top cities by popularity score
    const popularDestinations = await City.find({})
      .sort({ popularityScore: -1, createdAt: -1 })
      .limit(6)
      .lean();

    // 5. Budget & Travel Highlights
    let totalBudgetPlanned = 0;
    let totalExpensesLogged = 0;
    let activeTripsCount = 0;
    let completedTripsCount = 0;

    allUserTrips.forEach(trip => {
      if (trip.budget && trip.budget.totalBudget) {
        totalBudgetPlanned += Number(trip.budget.totalBudget);
      }
      if (Array.isArray(trip.expenses)) {
        trip.expenses.forEach(exp => {
          totalExpensesLogged += Number(exp.amount || 0);
        });
      }
      if (trip.status === TRIP_STATUS.COMPLETED || new Date(trip.endDate) < now) {
        completedTripsCount++;
      } else {
        activeTripsCount++;
      }
    });

    const firstName = (user && user.firstName) || 'Traveler';
    const welcomeMessage = `Welcome back, ${firstName}! Ready to plan your next adventure?`;

    return {
      welcomeMessage,
      upcomingTrips,
      recentTrips,
      allTrips: allUserTrips,
      popularDestinations,
      budgetHighlights: {
        totalTrips: allUserTrips.length,
        activeTripsCount,
        completedTripsCount,
        totalBudgetPlanned: Math.round(totalBudgetPlanned * 100) / 100,
        totalExpensesLogged: Math.round(totalExpensesLogged * 100) / 100,
        currency: (allUserTrips[0] && allUserTrips[0].budget && allUserTrips[0].budget.currency) || 'USD'
      }
    };
  }
}

module.exports = DashboardService;
