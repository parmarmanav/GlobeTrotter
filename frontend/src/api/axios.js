import axios from 'axios'
import { storage } from '@/utils/storage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor: Attach Bearer JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Normalize data and handle standard response/errors
apiClient.interceptors.response.use(
  (response) => {
    // Return backend response data payload directly
    return response.data
  },
  (error) => {
    // Standardize error structure
    const errorResponse = {
      success: false,
      message: 'An unexpected network error occurred.',
      status: error.response?.status,
      errors: [],
    }

    if (error.response) {
      // Server responded with error status
      const data = error.response.data
      errorResponse.message = data?.message || (typeof data === 'string' ? data : 'Request failed')
      errorResponse.errors = data?.errors || []

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        const isAuthUrl = error.config.url?.includes('/auth/login') || error.config.url?.includes('/auth/register')
        if (!isAuthUrl) {
          storage.clear()
          window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        }
      }
    } else if (error.request) {
      // Request made but no response received
      errorResponse.message = 'Unable to reach the server. Please check your internet connection.'
    } else {
      // Error in setting up request
      errorResponse.message = error.message || 'Error configuring request.'
    }

    return Promise.reject(errorResponse)
  }
)

export default apiClient
