import { useState, useCallback } from 'react'
import { cityService } from '@/services/cityService'

export function useCities() {
  const [cities, setCities] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCities = useCallback(async (params = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await cityService.getCities(params)
      const data = response.data || []
      setCities(Array.isArray(data) ? data : [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
      return { success: true, data }
    } catch (err) {
      setError(err.message || 'Failed to fetch destinations')
      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchCities = useCallback(async (query, params = {}) => {
    if (!query || query.trim() === '') {
      return fetchCities(params)
    }
    setIsLoading(true)
    setError(null)
    try {
      const response = await cityService.searchCities(query, params)
      const data = response.data || []
      setCities(Array.isArray(data) ? data : [])
      return { success: true, data }
    } catch (err) {
      setError(err.message || 'City search failed')
      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }, [fetchCities])

  return {
    cities,
    pagination,
    isLoading,
    error,
    fetchCities,
    searchCities,
    setCities,
  }
}

export default useCities
