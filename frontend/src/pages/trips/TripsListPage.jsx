import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { tripService } from '@/services/tripService'
import { useDebounce } from '@/hooks/useDebounce'
import { useApp } from '@/context/AppContext'
import { Plus, Search, Filter, Map, Calendar, DollarSign, ArrowUpDown } from 'lucide-react'
import { Button, Input, Select, Tabs, EmptyState, ErrorState, Pagination, TripCardSkeleton } from '@/components/common'
import { TripCard } from '@/components/trips/TripCard'

export function TripsListPage() {
  const { addToast } = useApp()
  const [trips, setTrips] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 })
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('-createdAt')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const debouncedSearch = useDebounce(searchQuery, 400)

  const fetchTrips = useCallback(async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = {
        page,
        limit: 9,
        sort: sortBy,
      }

      if (activeTab && activeTab !== 'all') {
        params.status = activeTab.toUpperCase()
      }

      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim()
      }

      const response = await tripService.getTrips(params)
      const data = response.data || []
      setTrips(Array.isArray(data) ? data : [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err) {
      console.warn('Failed to fetch trips:', err)
      setError(err.message || 'Unable to load trips.')
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, debouncedSearch, sortBy])

  useEffect(() => {
    fetchTrips(1)
  }, [fetchTrips])

  const handleDeleteTrip = async (tripId) => {
    try {
      await tripService.deleteTrip(tripId)
      setTrips((prev) => prev.filter((t) => (t._id || t.id) !== tripId))
      addToast({
        type: 'success',
        title: 'Trip Deleted',
        message: 'Your trip plan has been deleted successfully.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete trip.',
      })
    }
  }

  const tabs = [
    { id: 'all', label: 'All Trips' },
    { id: 'planned', label: 'Planned' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' },
  ]

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'startDate', label: 'Earliest Start Date' },
    { value: 'name', label: 'Trip Name (A-Z)' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">My Trips</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your planned adventures, itineraries, and stops</p>
        </div>
        <Link to={ROUTES.CREATE_TRIP}>
          <Button variant="primary" size="md" icon={Plus}>
            Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Tabs & Search Filter Controls */}
      <div className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex-1">
            <Input
              placeholder="Search trips by name or description..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-56">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to load your trips"
          message={error}
          onRetry={() => fetchTrips(pagination.page)}
        />
      ) : trips.length === 0 ? (
        debouncedSearch || activeTab !== 'all' ? (
          <EmptyState
            icon={Map}
            title="No matching trips found"
            description="Try changing your search terms or selecting a different status tab."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery('')
              setActiveTab('all')
            }}
          />
        ) : (
          <EmptyState
            icon={Map}
            title="No trips created yet"
            description="You haven't planned any trips yet. Start by defining your destination cities and dates."
            actionLabel="Plan First Trip"
            onAction={() => window.location.assign(ROUTES.CREATE_TRIP)}
          />
        )
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip._id || trip.id}
                trip={trip}
                onDelete={handleDeleteTrip}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => fetchTrips(p)}
          />
        </>
      )}
    </div>
  )
}

export default TripsListPage
