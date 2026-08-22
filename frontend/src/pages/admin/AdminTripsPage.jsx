import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { tripService } from '@/services/tripService'
import { formatDateRange, formatDate } from '@/utils/formatDate'
import { formatCurrency } from '@/utils/formatCurrency'
import { TRIP_STATUS_COLORS, TRIP_STATUS_LABELS } from '@/constants/tripStatus'
import { Map, Search, Eye, Trash2, Globe, Lock } from 'lucide-react'
import { Card, Input, Button, Badge, Pagination, EmptyState, ErrorState, ConfirmDialog, Skeleton } from '@/components/common'
import { useDebounce } from '@/hooks/useDebounce'
import { useApp } from '@/context/AppContext'

export function AdminTripsPage() {
  const { addToast } = useApp()
  const [trips, setTrips] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tripToDelete, setTripToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 350)

  const fetchTrips = useCallback(async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = { page, limit: 10, sort: '-createdAt' }
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
      console.warn('Failed to load trips for admin:', err)
      setError(err.message || 'Unable to retrieve trips.')
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchTrips(1)
  }, [fetchTrips])

  const handleDelete = async () => {
    if (!tripToDelete) return
    setIsDeleting(true)
    const tripId = tripToDelete._id || tripToDelete.id
    try {
      await tripService.deleteTrip(tripId)
      setTrips((prev) => prev.filter((t) => (t._id || t.id) !== tripId))
      addToast({ type: 'success', title: 'Trip Removed', message: 'Trip deleted from system.' })
      setTripToDelete(null)
    } catch (err) {
      addToast({ type: 'error', title: 'Delete Failed', message: err.message || 'Could not delete trip.' })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Trips Oversight</h1>
        <p className="text-xs text-slate-500 mt-1">Audit traveler itineraries and public shared routes</p>
      </div>

      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <Input
          placeholder="Search trips by title or keywords..."
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
          title="Could not load trips"
          message={error}
          onRetry={() => fetchTrips(pagination.page)}
        />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No trips found"
          description="Try broadening your search filter."
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <>
          <div className="hidden md:block overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Trip Title</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4">Stops</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trips.map((trip) => {
                  const tripId = trip._id || trip.id
                  const status = trip.status || 'PLANNED'
                  const statusColor = TRIP_STATUS_COLORS[status] || 'bg-slate-100 text-slate-700'
                  const stopsCount = Array.isArray(trip.stops) ? trip.stops.length : 0

                  return (
                    <tr key={tripId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link to={`/trips/${tripId}`} className="font-bold text-slate-900 hover:text-teal-600">
                          {trip.name}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}>
                          {TRIP_STATUS_LABELS[status] || status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {trip.isPublic ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Public
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Private
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {stopsCount} {stopsCount === 1 ? 'Stop' : 'Stops'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/trips/${tripId}`}>
                            <Button size="sm" variant="ghost" className="text-[11px] h-7" icon={Eye}>
                              View
                            </Button>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setTripToDelete(trip)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Trip"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
            onPageChange={(p) => fetchTrips(p)}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(tripToDelete)}
        onClose={() => setTripToDelete(null)}
        onConfirm={handleDelete}
        title={`Delete trip "${tripToDelete?.name}"?`}
        message="This trip record will be permanently deleted from the platform database."
        confirmText="Delete Trip"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default AdminTripsPage
