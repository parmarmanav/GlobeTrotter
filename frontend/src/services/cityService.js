import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const cityService = {
  getCities: (params) => apiClient.get(ENDPOINTS.CITIES.BASE, { params }),
  searchCities: (query, params) =>
    apiClient.get(ENDPOINTS.CITIES.SEARCH, { params: { q: query, ...params } }),
  getCityById: (cityId) => apiClient.get(ENDPOINTS.CITIES.BY_ID(cityId)),
  getCityActivities: (cityId, params) =>
    apiClient.get(ENDPOINTS.CITIES.ACTIVITIES(cityId), { params }),
}
