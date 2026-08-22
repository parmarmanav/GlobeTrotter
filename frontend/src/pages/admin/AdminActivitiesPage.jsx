import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { activityService } from '@/services/activityService'
import { useDebounce } from '@/hooks/useDebounce'
import { formatCurrency } from '@/utils/formatCurrency'
import { Compass, Search, Star, ExternalLink, Tag } from 'lucide-react'
import { Input, Button, Badge, Pagination, EmptyState, ErrorState, Skeleton } from '@/components/common'

export function AdminActivitiesPage() {
  const [activities, setActivities] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const debouncedSearch = useDebounce(searchQuery, 350)

  const fetchActivities = useCallback(async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = { page, limit: 10, sort: 'popularity_desc' }
      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim()
      }
      const response = await activityService.getActivities(params)
      const data = response.data || []
      setActivities(Array.isArray(data) ? data : [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err) {
      console.warn('Failed to load activities for admin:', err)
      setError(err.message || 'Unable to load activities.')
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchActivities(1)
  }, [fetchActivities])

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Experience & Activities Catalog</h1>
        <p className="text-xs text-slate-400 mt-1">Review activity categories, costs, and customer review scores</p>
      </div>

      <div className="p-3.5 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xs">
        <Input
          placeholder="Search activities by title..."
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
          title="Could not load activities"
          message={error}
          onRetry={() => fetchActivities(pagination.page)}
        />
      ) : activities.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No activities found"
          description="Try modifying your search."
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <>
          <div className="overflow-hidden bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 border-b border-[var(--color-border-subtle)] text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Activity</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Cost</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activities.map((a) => {
                  const aId = a._id || a.id
                  const cost = Number(a.estimatedCost || a.cost || 0)
                  return (
                    <tr key={aId} className="hover:bg-slate-800/50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{a.title}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-teal-200">
                          {a.category || 'OTHER'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {cost > 0 ? formatCurrency(cost, 'USD') : 'Free'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {a.rating || 4.8}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/activities/${aId}`} target="_blank">
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
            onPageChange={(p) => fetchActivities(p)}
          />
        </>
      )}
    </div>
  )
}

export default AdminActivitiesPage
