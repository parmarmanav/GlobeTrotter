import { useState, useCallback } from 'react'
import { itineraryService } from '@/services/itineraryService'

export function useItinerary(tripId) {
  const [itinerary, setItinerary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchItinerary = useCallback(async () => {
    if (!tripId) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await itineraryService.getItinerary(tripId)
      const data = response.data || response
      setItinerary(data)
      return { success: true, data }
    } catch (err) {
      setError(err.message || 'Failed to load itinerary')
      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }, [tripId])

  return {
    itinerary,
    isLoading,
    error,
    fetchItinerary,
    setItinerary,
  }
}

export default useItinerary
