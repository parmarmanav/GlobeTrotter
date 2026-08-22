import { useState, useCallback, useEffect } from 'react'
import { tripService } from '@/services/tripService'

export function useTrips(initialParams = {}, autoFetch = false) {
  const [trips, setTrips] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTrips = useCallback(async (params = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await tripService.getTrips({ ...initialParams, ...params })
      const data = response.data || []
      setTrips(Array.isArray(data) ? data : [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
      return { success: true, data }
    } catch (err) {
      setError(err.message || 'Failed to fetch trips')
      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }, [initialParams])

  useEffect(() => {
    if (autoFetch) {
      fetchTrips()
    }
  }, [autoFetch, fetchTrips])

  return {
    trips,
    pagination,
    isLoading,
    error,
    fetchTrips,
    setTrips,
  }
}

export default useTrips
