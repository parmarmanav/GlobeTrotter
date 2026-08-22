import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { activityService } from '@/services/activityService'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import {
  Clock,
  DollarSign,
  MapPin,
  Star,
  Plus,
  ArrowLeft,
  Tag,
  CheckCircle,
  Sparkles,
} from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  Skeleton,
  ErrorState,
} from '@/components/common'
import { AddToTripModal } from '@/components/discovery/AddToTripModal'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'

export function ActivityDetailsPage() {
  const { activityId } = useParams()
  const [activity, setActivity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const fetchActivity = useCallback(async () => {
    if (!activityId) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await activityService.getActivityById(activityId)
      const data = response.data || response
      setActivity(data)
    } catch (err) {
      console.warn('Failed to load activity:', err)
      setError(err.message || 'Unable to retrieve activity details.')
    } finally {
      setIsLoading(false)
    }
  }, [activityId])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-72 sm:h-96 rounded-3xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <ErrorState
        title="Activity not found"
        message={error || 'The requested activity could not be found.'}
        onRetry={fetchActivity}
      />
    )
  }

  const cost = Number(activity.estimatedCost || activity.cost || 0)
  const duration = activity.durationHours ? `${activity.durationHours} Hours` : activity.duration || 'Flexible'
  const cityName = activity.cityId?.name || activity.cityName || activity.city || ''
  const cityId = activity.cityId?._id || activity.cityId || ''

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl h-72 sm:h-96 shadow-lg bg-slate-900">
        <img
          src={activity.image || DEFAULT_IMAGE}
          alt={activity.title}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => { e.target.src = DEFAULT_IMAGE }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Navigation */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <Link
            to={ROUTES.ACTIVITIES}
            className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Activities
          </Link>

          <span className="px-3 py-1 text-xs font-bold rounded-full bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> {activity.rating || 4.8}
          </span>
        </div>

        {/* Hero Bottom Meta */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/80 text-white backdrop-blur-md">
                {activity.category || 'Sightseeing'}
              </span>
              {cityName && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-black/50 text-white backdrop-blur-md flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-400" /> {cityName}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display drop-shadow-md">
              {activity.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="accent"
              size="md"
              icon={Plus}
              onClick={() => setIsAddOpen(true)}
            >
              Add to Itinerary
            </Button>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Description & Essentials */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-white font-display">Experience Overview</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {activity.description || 'Enjoy a memorable journey experiencing the best attractions and local culture.'}
            </p>

            {/* Meta Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Typical Duration
                </span>
                <p className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> {duration}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Estimated Cost
                </span>
                <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  {cost > 0 ? formatCurrency(cost, 'USD') : 'Free'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Location / City
                </span>
                {cityId ? (
                  <Link to={`/cities/${cityId}`} className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {cityName || 'View City'}
                  </Link>
                ) : (
                  <p className="text-xs font-semibold text-slate-200">{cityName || 'Universal'}</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: CTA */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-display">Schedule This Activity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add this experience directly to one of your planned trips and assign it to a specific day.
            </p>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              icon={Plus}
              onClick={() => setIsAddOpen(true)}
            >
              Add to Trip Itinerary
            </Button>
          </Card>
        </div>
      </div>

      {/* Add To Trip Modal */}
      <AddToTripModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        item={activity}
        itemType="activity"
      />
    </div>
  )
}

export default ActivityDetailsPage
