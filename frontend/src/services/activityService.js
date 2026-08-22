import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const activityService = {
  getActivities: (params) => apiClient.get(ENDPOINTS.ACTIVITIES.BASE, { params }),
  searchActivities: (query, params) =>
    apiClient.get(ENDPOINTS.ACTIVITIES.SEARCH, { params: { q: query, ...params } }),
  getActivityById: (activityId) => apiClient.get(ENDPOINTS.ACTIVITIES.BY_ID(activityId)),
}
