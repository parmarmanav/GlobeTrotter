import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const publicTripService = {
  getPublicTripBySlug: (slug) => apiClient.get(ENDPOINTS.PUBLIC_TRIPS.BY_SLUG(slug)),
  copyPublicTrip: (slug) => apiClient.post(ENDPOINTS.PUBLIC_TRIPS.COPY(slug)),
}
