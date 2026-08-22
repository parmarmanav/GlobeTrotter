import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const tripService = {
  getTrips: (params) => apiClient.get(ENDPOINTS.TRIPS.BASE, { params }),
  getTripById: (tripId) => apiClient.get(ENDPOINTS.TRIPS.BY_ID(tripId)),
  createTrip: (tripData) => apiClient.post(ENDPOINTS.TRIPS.BASE, tripData),
  updateTrip: (tripId, tripData) => apiClient.put(ENDPOINTS.TRIPS.BY_ID(tripId), tripData),
  deleteTrip: (tripId) => apiClient.delete(ENDPOINTS.TRIPS.BY_ID(tripId)),
  publishTrip: (tripId) => apiClient.post(ENDPOINTS.TRIPS.PUBLISH(tripId)),
  unpublishTrip: (tripId) => apiClient.delete(ENDPOINTS.TRIPS.PUBLISH(tripId)),

  // Stops
  getStops: (tripId) => apiClient.get(ENDPOINTS.TRIPS.STOPS(tripId)),
  addStop: (tripId, stopData) => apiClient.post(ENDPOINTS.TRIPS.STOPS(tripId), stopData),
  updateStop: (tripId, stopId, stopData) => apiClient.put(ENDPOINTS.TRIPS.STOP_BY_ID(tripId, stopId), stopData),
  deleteStop: (tripId, stopId) => apiClient.delete(ENDPOINTS.TRIPS.STOP_BY_ID(tripId, stopId)),
  reorderStops: (tripId, orderedStopIds) => apiClient.patch(ENDPOINTS.TRIPS.STOPS_REORDER(tripId), { stops: orderedStopIds }),
}
