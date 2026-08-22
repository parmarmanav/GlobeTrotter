export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },

  // Users
  USERS: {
    ME: '/users/me',
    PREFERENCES: '/users/me/preferences',
    PROFILE_IMAGE: '/users/me/profile-image',
    SAVED_DESTINATIONS: '/users/me/saved-destinations',
    SAVED_DESTINATION_BY_ID: (cityId) => `/users/me/saved-destinations/${cityId}`,
  },

  // Dashboard
  DASHBOARD: '/dashboard',

  // Trips
  TRIPS: {
    BASE: '/trips',
    BY_ID: (tripId) => `/trips/${tripId}`,
    PUBLISH: (tripId) => `/trips/${tripId}/publish`,
    
    // Stops
    STOPS: (tripId) => `/trips/${tripId}/stops`,
    STOP_BY_ID: (tripId, stopId) => `/trips/${tripId}/stops/${stopId}`,
    STOPS_REORDER: (tripId) => `/trips/${tripId}/stops/reorder`,

    // Itinerary
    ITINERARY: (tripId) => `/trips/${tripId}/itinerary`,
    DAYS: (tripId) => `/trips/${tripId}/itinerary/days`,
    DAY_BY_ID: (tripId, dayId) => `/trips/${tripId}/itinerary/days/${dayId}`,
    ACTIVITIES: (tripId, dayId) => `/trips/${tripId}/itinerary/days/${dayId}/activities`,
    ACTIVITY_BY_ID: (tripId, dayId, itemId) => `/trips/${tripId}/itinerary/days/${dayId}/activities/${itemId}`,
    ACTIVITIES_REORDER: (tripId, dayId) => `/trips/${tripId}/itinerary/days/${dayId}/activities/reorder`,

    // Budget & Expenses
    BUDGET: (tripId) => `/trips/${tripId}/budget`,
    BUDGET_SUMMARY: (tripId) => `/trips/${tripId}/budget/summary`,
    EXPENSES: (tripId) => `/trips/${tripId}/expenses`,
    EXPENSE_BY_ID: (tripId, expenseId) => `/trips/${tripId}/expenses/${expenseId}`,

    // Calendar
    CALENDAR: (tripId) => `/trips/${tripId}/calendar`,
  },

  // Cities
  CITIES: {
    BASE: '/cities',
    SEARCH: '/cities/search',
    BY_ID: (cityId) => `/cities/${cityId}`,
    ACTIVITIES: (cityId) => `/cities/${cityId}/activities`,
  },

  // Activities
  ACTIVITIES: {
    BASE: '/activities',
    SEARCH: '/activities/search',
    BY_ID: (activityId) => `/activities/${activityId}`,
  },

  // Public Trips
  PUBLIC_TRIPS: {
    BY_SLUG: (slug) => `/public/trips/${slug}`,
    COPY: (slug) => `/public/trips/${slug}/copy`,
  },

  // Community
  COMMUNITY: {
    POSTS: '/community/posts',
    POST_BY_ID: (postId) => `/community/posts/${postId}`,
    LIKE: (postId) => `/community/posts/${postId}/like`,
    COMMENTS: (postId) => `/community/posts/${postId}/comments`,
    COMMENT_BY_ID: (commentId) => `/community/comments/${commentId}`,
  },

  // Admin
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (userId) => `/admin/users/${userId}`,
    USER_STATUS: (userId) => `/admin/users/${userId}/status`,
    USER_ROLE: (userId) => `/admin/users/${userId}/role`,
    ANALYTICS_OVERVIEW: '/admin/analytics/overview',
    ANALYTICS_USERS: '/admin/analytics/users',
    ANALYTICS_TRIPS: '/admin/analytics/trips',
    ANALYTICS_CITIES: '/admin/analytics/cities',
    ANALYTICS_ACTIVITIES: '/admin/analytics/activities',
  },
}
