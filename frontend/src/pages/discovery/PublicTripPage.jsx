import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { publicTripService } from '@/services/publicTripService'
import { tripService } from '@/services/tripService'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { formatDateRange, formatDate } from '@/utils/formatDate'
import { formatCurrency } from '@/utils/formatCurrency'
import {
  Calendar,
  MapPin,
  Copy,
  Share2,
  Clock,
  Sparkles,
  User,
  ArrowRight,
  Globe,
  DollarSign,
  Check,
} from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  Skeleton,
  ErrorState,
} from '@/components/common'
import { TimelineView } from '@/components/calendar/TimelineView'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'

export function PublicTripPage() {
  const { slug } = useParams()
  const { isAuthenticated } = useAuth()
  const { addToast } = useApp()
  const navigate = useNavigate()

  const [trip, setTrip] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCopying, setIsCopying] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const fetchPublicTrip = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    setError(null)
    try {
      let res
      try {
        res = await publicTripService.getPublicTripBySlug(slug)
      } catch {
        res = await tripService.getTripById(slug)
      }
      const data = res.data || res
      setTrip(data)
    } catch (err) {
      console.warn('Failed to load public trip:', err)
      setError(err.message || 'This trip is not public or could not be found.')
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchPublicTrip()
  }, [fetchPublicTrip])

  const handleCopyTrip = async () => {
    if (!isAuthenticated) {
      addToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in or register to copy this trip to your account.',
      })
      navigate(ROUTES.LOGIN, { state: { from: { pathname: `/public/trips/${slug}` } } })
      return
    }

    setIsCopying(true)
    try {
      const response = await publicTripService.copyPublicTrip(slug)
      const copiedTrip = response.data || response
      const tripId = copiedTrip._id || copiedTrip.id

      addToast({
        type: 'success',
        title: 'Trip Cloned!',
        message: 'This itinerary has been copied to your personal trips.',
      })

      if (tripId) {
        navigate(`/trips/${tripId}`)
      } else {
        navigate(ROUTES.TRIPS)
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Copy Failed',
        message: err.message || 'Could not copy this trip.',
      })
    } finally {
      setIsCopying(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: 'Itinerary link copied to clipboard!',
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <Skeleton className="h-72 sm:h-96 rounded-3xl w-full" />
        <Skeleton className="h-48 rounded-2xl w-full" />
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState
          title="Public Itinerary Not Available"
          message={error || 'This trip does not exist or has been made private by its creator.'}
          onRetry={fetchPublicTrip}
        />
      </div>
    )
  }

  const stops = Array.isArray(trip.stops) ? trip.stops : []
  const days = Array.isArray(trip.itineraryDays) ? trip.itineraryDays : []
  const dateRange = formatDateRange(trip.startDate, trip.endDate)
  const creator = trip.userId || trip.creator || {}
  const creatorName = `${creator.firstName || ''} ${creator.lastName || ''}`.trim() || creator.username || 'GlobeTrotter Explorer'

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Trip Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl h-72 sm:h-96 shadow-lg bg-slate-900">
        <img
          src={trip.coverImage || DEFAULT_COVER}
          alt={trip.name}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => { e.target.src = DEFAULT_COVER }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/90 text-white backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <Globe className="w-3.5 h-3.5" /> Public Travel Plan
          </span>

          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
            title="Share Public Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Hero Bottom Info */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-teal-300 font-semibold">
              <User className="w-3.5 h-3.5" /> Curated by {creatorName}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display drop-shadow-md">
              {trip.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-400" /> {dateRange}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-400" /> {stops.length} Stops
              </span>
              <span>•</span>
              <span>{days.length} Days</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="accent"
              size="md"
              icon={Copy}
              isLoading={isCopying}
              onClick={handleCopyTrip}
            >
              Copy Trip to My Account
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {trip.description && (
        <Card className="p-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Trip Overview</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {trip.description}
          </p>
        </Card>
      )}

      {/* Sequenced Route Stops */}
      {stops.length > 0 && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-display">Route Destinations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
        </Card>
      )}

      {/* Day-by-Day Itinerary Timeline */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Day-by-Day Itinerary Schedule
            </h2>
            <p className="text-xs text-slate-500">
              Read-only view of scheduled activities and visits
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Copy}
            isLoading={isCopying}
            onClick={handleCopyTrip}
          >
            Copy & Customize
          </Button>
        </div>

        <TimelineView trip={trip} currency={trip.budget?.currency || 'USD'} />
      </Card>
    </div>
  )
}

export default PublicTripPage
