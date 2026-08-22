import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { TRIP_STATUS_LABELS, TRIP_STATUS_COLORS } from '@/constants/tripStatus'
import { formatDateRange } from '@/utils/formatDate'
import { formatCurrency } from '@/utils/formatCurrency'
import {
  Calendar,
  MapPin,
  DollarSign,
  ArrowRight,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  ListOrdered,
  Sparkles,
} from 'lucide-react'
import { Card, Badge, Dropdown, DropdownItem, DropdownDivider, ConfirmDialog } from '@/components/common'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'

export function TripCard({ trip, onDelete, onUpdate }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!trip) return null

  const tripId = trip._id || trip.id
  const status = trip.status || 'PLANNED'
  const statusLabel = TRIP_STATUS_LABELS[status] || status
  const statusColor = TRIP_STATUS_COLORS[status] || 'bg-slate-800 text-slate-300'
  const dateRange = formatDateRange(trip.startDate, trip.endDate)
  const stopsCount = Array.isArray(trip.stops) ? trip.stops.length : 0
  const stopsList = Array.isArray(trip.stops)
    ? trip.stops.map((s) => s.cityName || s.cityId?.name || s.city || 'Stop').join(', ')
    : ''
  const totalBudget = trip.budget?.totalBudget || 0
  const currency = trip.budget?.currency || 'USD'

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete?.(tripId)
      setShowDeleteConfirm(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="p-0 overflow-hidden flex flex-col justify-between group bg-slate-900 border border-slate-800 hover-lift">
        {/* Cover Image & Header Badges */}
        <div className="relative h-48 w-full bg-slate-800 overflow-hidden shrink-0">
          <img
            src={trip.coverImage || DEFAULT_COVER}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.src = DEFAULT_COVER
            }}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-black/20 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-full border shadow-md backdrop-blur-md ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>

          {/* Context Options Dropdown */}
          <div className="absolute top-3 right-3">
            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center border border-white/10"
                  aria-label="Trip actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              }
            >
              <DropdownItem
                icon={Eye}
                onClick={() => window.location.assign(`/trips/${tripId}`)}
              >
                View Overview
              </DropdownItem>
              <DropdownItem
                icon={ListOrdered}
                onClick={() => window.location.assign(`/trips/${tripId}/itinerary`)}
              >
                Build Itinerary
              </DropdownItem>
              <DropdownItem
                icon={DollarSign}
                onClick={() => window.location.assign(`/trips/${tripId}/budget`)}
              >
                Manage Budget
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                icon={Trash2}
                destructive
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Trip
              </DropdownItem>
            </Dropdown>
          </div>

          {/* Trip Dates on Image */}
          <div className="absolute bottom-3 left-3 right-3 text-white min-w-0">
            <p className="text-xs font-medium flex items-center gap-1.5 drop-shadow-md text-slate-200 truncate-safe">
              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{dateRange || 'Dates not set'}</span>
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 min-w-0">
          <div className="space-y-1.5 min-w-0">
            <Link to={`/trips/${tripId}`} className="block group/title">
              <h3 className="text-base font-bold text-white group-hover/title:text-indigo-400 transition-colors font-display truncate-safe">
                {trip.name}
              </h3>
            </Link>
            {trip.description && (
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {trip.description}
              </p>
            )}
          </div>

          {/* Destinations / Stops */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800 gap-2 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate-safe font-medium">
                {stopsCount > 0
                  ? `${stopsCount} ${stopsCount === 1 ? 'Stop' : 'Stops'}${stopsList ? ` (${stopsList})` : ''}`
                  : 'No stops added'}
              </span>
            </div>

            <div className="flex items-center gap-1 font-bold text-white shrink-0">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>{totalBudget > 0 ? formatCurrency(totalBudget, currency) : 'Unset'}</span>
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 min-w-0">
            <Link
              to={`/trips/${tripId}/itinerary`}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors group/link truncate-safe"
            >
              Itinerary Builder <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={`/trips/${tripId}`}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors shrink-0"
            >
              View Details
            </Link>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={`Delete "${trip.name}"?`}
        message="This will permanently remove the trip, all associated stops, scheduled activities, and logged expenses. This action cannot be undone."
        confirmText="Delete Trip"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </>
  )
}

export default TripCard
