export const ROUTES = {
  // Public & Auth
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',

  // Core App (Protected)
  DASHBOARD: '/dashboard',
  TRIPS: '/trips',
  CREATE_TRIP: '/trips/create',
  TRIP_DETAILS: '/trips/:tripId',
  TRIP_ITINERARY: '/trips/:tripId/itinerary',
  TRIP_BUDGET: '/trips/:tripId/budget',
  TRIP_CALENDAR: '/trips/:tripId/calendar',

  // Discovery
  EXPLORE: '/explore',
  CITIES: '/cities',
  CITY_DETAILS: '/cities/:cityId',
  ACTIVITIES: '/activities',
  ACTIVITY_DETAILS: '/activities/:activityId',

  // Community & Sharing
  COMMUNITY: '/community',
  POST_DETAILS: '/community/:postId',
  PUBLIC_TRIP: '/public/trips/:slug',
  SAVED_DESTINATIONS: '/saved',

  // User
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_TRIPS: '/admin/trips',
  ADMIN_CITIES: '/admin/cities',
  ADMIN_ACTIVITIES: '/admin/activities',
  ADMIN_ANALYTICS: '/admin/analytics',
}
