import React, { useState, useEffect, useCallback } from 'react'
import { activityService } from '@/services/activityService'
import { useDebounce } from '@/hooks/useDebounce'
import { Search, Compass, Sparkles, Filter, Tag } from 'lucide-react'
import { Input, Select, Pagination, EmptyState, ErrorState, ActivityCardSkeleton } from '@/components/common'
import { ActivityCard } from '@/components/discovery/ActivityCard'
import { AddToTripModal } from '@/components/discovery/AddToTripModal'

export function ActivitiesPage() {
  const [activities, setActivities] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 })
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('popularity_desc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedActivityForTrip, setSelectedActivityForTrip] = useState(null)

  const debouncedSearch = useDebounce(searchQuery, 350)

  const fetchActivities = useCallback(async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = {
        page,
        limit: 12,
        sort: sortBy,
      }

      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim()
      }
      if (categoryFilter && categoryFilter !== 'ALL') {
        params.category = categoryFilter
      }

      const response = await activityService.getActivities(params)
      const data = response.data || []
      setActivities(Array.isArray(data) ? data : [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err) {
      console.warn('Failed to load activities:', err)
      setError(err.message || 'Unable to retrieve activities.')
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, categoryFilter, sortBy])

  useEffect(() => {
    fetchActivities(1)
  }, [fetchActivities])

  const categoryOptions = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'SIGHTSEEING', label: 'Sightseeing & Landmarks' },
    { value: 'FOOD', label: 'Food & Dining' },
    { value: 'ADVENTURE', label: 'Adventure & Outdoor' },
    { value: 'CULTURE', label: 'Culture & Museums' },
    { value: 'NATURE', label: 'Nature & Parks' },
    { value: 'ENTERTAINMENT', label: 'Entertainment' },
    { value: 'SHOPPING', label: 'Shopping' },
  ]

  const sortOptions = [
    { value: 'popularity_desc', label: 'Top Rated & Popular' },
    { value: 'cost_asc', label: 'Cost: Low to High' },
    { value: 'cost_desc', label: 'Cost: High to Low' },
    { value: 'name_asc', label: 'Title (A-Z)' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-teal-200 border border-teal-400/30 flex items-center gap-1.5 w-fit">
            <Compass className="w-3.5 h-3.5" /> Experiences & Tours
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
            Explore Curated Activities
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Discover sightseeing tours, landmark tickets, food tastings, and outdoor adventures to schedule into your daily trip itinerary.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xs">
        <div className="sm:col-span-1">
          <Input
            placeholder="Search activities..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select
          options={categoryOptions}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />

        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        />
      </div>

      {/* Activities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ActivityCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to load activities"
          message={error}
          onRetry={() => fetchActivities(pagination.page)}
        />
      ) : activities.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No activities found"
          description="Try modifying your search or picking a different category filter."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('')
            setCategoryFilter('ALL')
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activities.map((act) => (
              <ActivityCard
                key={act._id || act.id}
                activity={act}
                onAddToTrip={(a) => setSelectedActivityForTrip(a)}
              />
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => fetchActivities(p)}
          />
        </>
      )}

      {/* Add To Trip Modal */}
      <AddToTripModal
        isOpen={Boolean(selectedActivityForTrip)}
        onClose={() => setSelectedActivityForTrip(null)}
        item={selectedActivityForTrip}
        itemType="activity"
      />
    </div>
  )
}

export default ActivitiesPage
