import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { tripService } from '@/services/tripService'
import { publicTripService } from '@/services/publicTripService'
import { useApp } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { formatDateRange, formatDate } from '@/utils/formatDate'
import { formatCurrency } from '@/utils/formatCurrency'
import { TRIP_STATUS_COLORS, TRIP_STATUS_LABELS } from '@/constants/tripStatus'
import {
  Calendar,
  MapPin,
  DollarSign,
  Share2,
  Sparkles,
  Edit2,
  Trash2,
  Clock,
  Compass,
  ArrowRight,
  ListOrdered,
  TrendingUp,
  Globe,
  Copy,
  Check,
  CheckCircle,
} from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  Tabs,
  Skeleton,
  ErrorState,
  ConfirmDialog,
  Modal,
} from '@/components/common'
import { TimelineView } from '@/components/calendar/TimelineView'
import { BudgetCharts } from '@/components/budget/BudgetCharts'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'

export function TripDetailsPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { addToast } = useApp()

  const [trip, setTrip] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const fetchTripDetails = useCallback(async () => {
    if (!tripId) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await tripService.getTripById(tripId)
      const data = response.data || response
      setTrip(data)
    } catch (err) {
      console.warn('Failed to load trip:', err)
      setError(err.message || 'Unable to retrieve trip details.')
    } finally {
      setIsLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    fetchTripDetails()
  }, [fetchTripDetails])

  const handleDeleteTrip = async () => {
    setIsDeleting(true)
    try {
      await tripService.deleteTrip(tripId)
      addToast({
        type: 'success',
        title: 'Trip Deleted',
        message: 'The trip has been removed successfully.',
      })
      navigate(ROUTES.TRIPS, { replace: true })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete trip.',
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleTogglePublish = async () => {
    if (!trip) return
    setIsPublishing(true)
    try {
      if (trip.isPublic) {
        await publicTripService.unpublishTrip(tripId)
        setTrip((prev) => ({ ...prev, isPublic: false }))
        addToast({
          type: 'info',
          title: 'Trip Made Private',
          message: 'Your trip is now only visible to you.',
        })
      } else {
        await publicTripService.publishTrip(tripId)
        setTrip((prev) => ({ ...prev, isPublic: true }))
        addToast({
          type: 'success',
          title: 'Trip Published!',
          message: 'Your trip is now publicly discoverable and shareable.',
        })
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Publish Action Failed',
        message: err.message || 'Could not update trip visibility.',
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const publicUrl = `${window.location.origin}/public/trips/${tripId}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: 'Public itinerary URL copied to clipboard!',
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-64 sm:h-80 w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <ErrorState
        title="Unable to load trip details"
        message={error || 'The requested trip could not be found.'}
        onRetry={fetchTripDetails}
      />
    )
  }

  const status = trip.status || 'PLANNED'
  const statusColor = TRIP_STATUS_COLORS[status] || 'bg-slate-100 text-slate-700'
  const statusLabel = TRIP_STATUS_LABELS[status] || status
  const dateRange = formatDateRange(trip.startDate, trip.endDate)
  const stops = Array.isArray(trip.stops) ? trip.stops : []
  const itineraryDays = Array.isArray(trip.itineraryDays) ? trip.itineraryDays : []
  const expenses = Array.isArray(trip.expenses) ? trip.expenses : []
  const totalBudget = trip.budget?.totalBudget || 0
  const currency = trip.budget?.currency || 'USD'

  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)

  // Calculate total activities count
  const totalActivitiesCount = itineraryDays.reduce(
    (sum, d) => sum + (Array.isArray(d.activities) ? d.activities.length : 0),
    0
  )

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: `Itinerary (${itineraryDays.length} Days)` },
    { id: 'timeline', label: 'Timeline View' },
    { id: 'budget', label: 'Budget & Expenses' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Trip Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl h-72 sm:h-96 shadow-lg bg-slate-900">
        <img
          src={trip.coverImage || DEFAULT_COVER}
          alt={trip.name}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => { e.target.src = DEFAULT_COVER }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges & Back Button */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <Link
            to={ROUTES.TRIPS}
            className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            &larr; All Trips
          </Link>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-full border shadow-sm backdrop-blur-md ${statusColor}`}>
              {statusLabel}
            </span>
            {trip.isPublic && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/80 text-white border border-emerald-400/50 shadow-sm backdrop-blur-md flex items-center gap-1">
                <Globe className="w-3 h-3" /> Public
              </span>
            )}
          </div>
        </div>

        {/* Hero Bottom Meta */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display drop-shadow-md">
              {trip.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-400" /> {dateRange}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-400" /> {stops.length} {stops.length === 1 ? 'Destination' : 'Destinations'}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-teal-300">
                <DollarSign className="w-4 h-4" /> {totalBudget > 0 ? formatCurrency(totalBudget, currency) : 'No Budget Set'}
              </span>
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/trips/${tripId}/itinerary`}>
              <Button variant="accent" size="sm" icon={ListOrdered}>
                Itinerary Builder
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              icon={Share2}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              onClick={() => setIsShareModalOpen(true)}
            >
              Share
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              className="bg-rose-500/80 hover:bg-rose-600 text-white border border-rose-400/50"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            {trip.description && (
              <Card className="p-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">About this Trip</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {trip.description}
                </p>
              </Card>
            )}

            {/* Destination Stops Preview */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">Route Destinations</h3>
                  <p className="text-xs text-slate-500">Stops sequenced along this journey</p>
                </div>
                <Link to={`/trips/${tripId}/itinerary`} className="text-xs font-bold text-teal-600 hover:text-teal-700">
                  Manage Stops &rarr;
                </Link>
              </div>

              {stops.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">No destination stops added</p>
                  <p className="text-[11px] text-slate-400 mb-3">Add cities to begin building your itinerary.</p>
                  <Link to={`/trips/${tripId}/itinerary`}>
                    <Button size="sm" variant="primary">Add Stops in Builder</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stops.map((stop, idx) => (
                    <div
                      key={stop._id || stop.id || idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {stop.cityName || stop.cityId?.name || 'City'}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          {stop.country || stop.cityId?.country || ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Column: Budget & Stats */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-display">Journey Highlights</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50 border border-teal-100">
                  <span className="text-xs font-medium text-teal-800">Itinerary Days</span>
                  <span className="text-sm font-extrabold text-teal-900">{itineraryDays.length} Days</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50 border border-sky-100">
                  <span className="text-xs font-medium text-sky-800">Total Activities</span>
                  <span className="text-sm font-extrabold text-sky-900">{totalActivitiesCount} Scheduled</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-xs font-medium text-emerald-800">Total Spent</span>
                  <span className="text-sm font-extrabold text-emerald-900">
                    {formatCurrency(totalSpent, currency)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <Link to={`/trips/${tripId}/itinerary`}>
                  <Button variant="primary" size="sm" className="w-full" icon={ListOrdered}>
                    Open Builder
                  </Button>
                </Link>
                <Link to={`/trips/${tripId}/budget`}>
                  <Button variant="outline" size="sm" className="w-full" icon={DollarSign}>
                    Open Budget Tracker
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Daily Schedule</h2>
              <p className="text-xs text-slate-500">Day-by-day plan of places, meals and activities</p>
            </div>
            <Link to={`/trips/${tripId}/itinerary`}>
              <Button variant="primary" size="sm" icon={Edit2}>
                Edit in Builder
              </Button>
            </Link>
          </div>

          {itineraryDays.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Calendar className="w-10 h-10 text-teal-600/50 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No itinerary days created yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use the Itinerary Builder to add day blocks and schedule activities.
              </p>
              <Link to={`/trips/${tripId}/itinerary`}>
                <Button variant="primary" size="sm">Launch Itinerary Builder</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itineraryDays.map((day, idx) => {
                const acts = Array.isArray(day.activities) ? day.activities : []
                return (
                  <Card key={day._id || day.id || idx} className="p-5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" size="sm">Day {day.dayNumber}</Badge>
                        <h4 className="text-xs font-bold text-slate-900">{day.title || `Day ${day.dayNumber}`}</h4>
                      </div>
                      {day.date && (
                        <span className="text-[11px] text-slate-400">{formatDate(day.date)}</span>
                      )}
                    </div>
                    {acts.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No activities logged for this day.</p>
                    ) : (
                      <ul className="space-y-2">
                        {acts.map((a, aIdx) => (
                          <li key={a._id || a.id || aIdx} className="flex items-start justify-between text-xs">
                            <span className="font-medium text-slate-700 truncate">{a.title}</span>
                            {Number(a.estimatedCost) > 0 && (
                              <span className="font-bold text-emerald-600 shrink-0 ml-2">
                                {formatCurrency(a.estimatedCost, currency)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <TimelineView trip={trip} currency={currency} />
      )}

      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Budget & Cost Summary</h2>
              <p className="text-xs text-slate-500">Expenditures, breakdown, and estimated activity expenses</p>
            </div>
            <Link to={`/trips/${tripId}/budget`}>
              <Button variant="primary" size="sm" icon={DollarSign}>
                Manage Budget & Log Expenses
              </Button>
            </Link>
          </div>

          <BudgetCharts expenses={expenses} currency={currency} totalBudget={totalBudget} />
        </div>
      )}

      {/* Share / Public Itinerary Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Trip Plan"
        description="Make this trip publicly discoverable or share the link with friends"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Public Visibility</h4>
                <p className="text-[11px] text-slate-500">
                  {trip.isPublic
                    ? 'Anyone with the link can view your itinerary.'
                    : 'Currently private. Only you can view this trip.'}
                </p>
              </div>
              <Button
                size="sm"
                variant={trip.isPublic ? 'outline' : 'primary'}
                isLoading={isPublishing}
                onClick={handleTogglePublish}
              >
                {trip.isPublic ? 'Make Private' : 'Publish Trip'}
              </Button>
            </div>
          </div>

          {trip.isPublic && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Shareable Public URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-mono select-all"
                />
                <Button size="sm" variant="primary" icon={copiedLink ? Check : Copy} onClick={handleCopyLink}>
                  {copiedLink ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteTrip}
        title={`Delete "${trip.name}"?`}
        message="This will permanently delete this trip, all route stops, day plans, and logged expenses. This action is irreversible."
        confirmText="Delete Trip"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default TripDetailsPage
