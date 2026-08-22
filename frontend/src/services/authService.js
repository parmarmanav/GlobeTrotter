import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const authService = {
  register: (userData) => apiClient.post(ENDPOINTS.AUTH.REGISTER, userData),
  login: (credentials) => apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials),
  forgotPassword: (emailData) => apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, emailData),
  resetPassword: (token, passwordData) => apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, ...passwordData }),
  getCurrentUser: () => apiClient.get(ENDPOINTS.AUTH.ME),
  logout: () => apiClient.post(ENDPOINTS.AUTH.LOGOUT),
}
