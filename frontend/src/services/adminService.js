import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const adminService = {
  getUsers: (params) => apiClient.get(ENDPOINTS.ADMIN.USERS, { params }),
  getUserById: (userId) => apiClient.get(ENDPOINTS.ADMIN.USER_BY_ID(userId)),
  updateUserStatus: (userId, status) => apiClient.patch(ENDPOINTS.ADMIN.USER_STATUS(userId), { status }),
  updateUserRole: (userId, role) => apiClient.patch(ENDPOINTS.ADMIN.USER_ROLE(userId), { role }),
  deleteUser: (userId) => apiClient.delete(ENDPOINTS.ADMIN.USER_BY_ID(userId)),

  // Analytics
  getAnalyticsOverview: () => apiClient.get(ENDPOINTS.ADMIN.ANALYTICS_OVERVIEW),
  getUserAnalytics: (params) => apiClient.get(ENDPOINTS.ADMIN.ANALYTICS_USERS, { params }),
  getTripAnalytics: (params) => apiClient.get(ENDPOINTS.ADMIN.ANALYTICS_TRIPS, { params }),
  getCityAnalytics: (params) => apiClient.get(ENDPOINTS.ADMIN.ANALYTICS_CITIES, { params }),
  getActivityAnalytics: (params) => apiClient.get(ENDPOINTS.ADMIN.ANALYTICS_ACTIVITIES, { params }),
}
