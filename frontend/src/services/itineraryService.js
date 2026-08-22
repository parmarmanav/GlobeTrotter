import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const itineraryService = {
  getItinerary: (tripId) => apiClient.get(ENDPOINTS.TRIPS.ITINERARY(tripId)),
  
  // Days
  addDay: (tripId, dayData) => apiClient.post(ENDPOINTS.TRIPS.DAYS(tripId), dayData),
  updateDay: (tripId, dayId, dayData) => apiClient.put(ENDPOINTS.TRIPS.DAY_BY_ID(tripId, dayId), dayData),
  deleteDay: (tripId, dayId) => apiClient.delete(ENDPOINTS.TRIPS.DAY_BY_ID(tripId, dayId)),

  // Activities within day
  addActivity: (tripId, dayId, activityData) =>
    apiClient.post(ENDPOINTS.TRIPS.ACTIVITIES(tripId, dayId), activityData),
  updateActivity: (tripId, dayId, itemId, activityData) =>
    apiClient.put(ENDPOINTS.TRIPS.ACTIVITY_BY_ID(tripId, dayId, itemId), activityData),
  deleteActivity: (tripId, dayId, itemId) =>
    apiClient.delete(ENDPOINTS.TRIPS.ACTIVITY_BY_ID(tripId, dayId, itemId)),
  reorderActivities: (tripId, dayId, orderedItemIds) =>
    apiClient.patch(ENDPOINTS.TRIPS.ACTIVITIES_REORDER(tripId, dayId), { items: orderedItemIds }),
}
