import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { cityService } from '@/services/cityService'
import { useDebounce } from '@/hooks/useDebounce'
import { MapPin, Search, Star, ExternalLink, Globe } from 'lucide-react'
import { Input, Button, Badge, Pagination, EmptyState, ErrorState, Skeleton } from '@/components/common'

export function AdminCitiesPage() {
  const [cities, setCities] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const debouncedSearch = useDebounce(searchQuery, 350)

  const fetchCities = useCallback(async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = { page, limit: 10, sort: 'popularity_desc' }
      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim()
      }
      const response = await cityService.getCities(params)
      const data = response.data || []
      setCities(Array.isArray(data) ? data : [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err) {
      console.warn('Failed to load cities for admin:', err)
      setError(err.message || 'Unable to load cities.')
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchCities(1)
  }, [fetchCities])

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Destination Cities Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Review catalog destinations, cost ratings, and popularity metrics</p>
      </div>

      <div className="p-3.5 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xs">
        <Input
          placeholder="Search cities by name or country..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load cities"
          message={error}
          onRetry={() => fetchCities(pagination.page)}
        />
      ) : cities.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="No cities found"
          description="Try changing your search keywords."
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <>
          <div className="overflow-hidden bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 border-b border-[var(--color-border-subtle)] text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Region</th>
                  <th className="py-3.5 px-4">Cost Index</th>
                  <th className="py-3.5 px-4">Popularity</th>
                  <th className="py-3.5 px-4 text-right">Guide Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cities.map((c) => {
                  const cId = c._id || c.id
                  return (
                    <tr key={cId} className="hover:bg-slate-800/50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{c.country}</td>
                      <td className="py-3.5 px-4 text-slate-400">{c.region || 'Global'}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-[var(--color-border-subtle)]">
                          {c.costIndex || '$$'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-indigo-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {c.popularityScore || 90}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/cities/${cId}`} target="_blank">
                          <Button size="sm" variant="ghost" className="text-[11px] h-7" iconRight={ExternalLink}>
                            Preview
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => fetchCities(p)}
          />
        </>
      )}
    </div>
  )
}

export default AdminCitiesPage
