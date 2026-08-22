import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const calendarService = {
  getTripCalendar: (tripId) => apiClient.get(ENDPOINTS.TRIPS.CALENDAR(tripId)),
}
