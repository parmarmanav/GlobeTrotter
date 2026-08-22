import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const userService = {
  getProfile: () => apiClient.get(ENDPOINTS.USERS.ME),
  updateProfile: (profileData) => apiClient.put(ENDPOINTS.USERS.ME, profileData),
  updatePreferences: (preferences) => apiClient.patch(ENDPOINTS.USERS.PREFERENCES, { preferences }),
  uploadProfileImage: (formData) =>
    apiClient.post(ENDPOINTS.USERS.PROFILE_IMAGE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteAccount: () => apiClient.delete(ENDPOINTS.USERS.ME),
  
  // Saved Destinations
  getSavedDestinations: () => apiClient.get(ENDPOINTS.USERS.SAVED_DESTINATIONS),
  addSavedDestination: (cityId) => apiClient.post(ENDPOINTS.USERS.SAVED_DESTINATION_BY_ID(cityId)),
  saveDestination: (cityId) => apiClient.post(ENDPOINTS.USERS.SAVED_DESTINATION_BY_ID(cityId)),
  removeSavedDestination: (cityId) => apiClient.delete(ENDPOINTS.USERS.SAVED_DESTINATION_BY_ID(cityId)),
}

export default userService
