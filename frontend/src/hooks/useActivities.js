import { useState, useCallback } from 'react'
import { activityService } from '@/services/activityService'

export function useActivities() {
  const [activities, setActivities] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchActivities = useCallback(async (params = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await activityService.getActivities(params)
      const data = response.data || []
      setActivities(Array.isArray(data) ? data : [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
      return { success: true, data }
    } catch (err) {
      setError(err.message || 'Failed to fetch activities')
      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchActivities = useCallback(async (query, params = {}) => {
    if (!query || query.trim() === '') {
      return fetchActivities(params)
    }
    setIsLoading(true)
    setError(null)
    try {
      const response = await activityService.searchActivities(query, params)
      const data = response.data || []
      setActivities(Array.isArray(data) ? data : [])
      return { success: true, data }
    } catch (err) {
      setError(err.message || 'Activity search failed')
      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }, [fetchActivities])

  return {
    activities,
    pagination,
    isLoading,
    error,
    fetchActivities,
    searchActivities,
    setActivities,
  }
}

export default useActivities
