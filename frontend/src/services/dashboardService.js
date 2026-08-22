import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const dashboardService = {
  getDashboard: () => apiClient.get(ENDPOINTS.DASHBOARD),
}

export default dashboardService
