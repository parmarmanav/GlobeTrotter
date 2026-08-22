import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tripService } from '@/services/tripService'
import { calendarService } from '@/services/calendarService'
import { formatDateRange, formatDate } from '@/utils/formatDate'
import { formatCurrency } from '@/utils/formatCurrency'
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  Clock,
  MapPin,
  ListOrdered,
  DollarSign,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  Skeleton,
  ErrorState,
  EmptyState,
} from '@/components/common'
import { TimelineView } from '@/components/calendar/TimelineView'

export function CalendarPage() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [calendarData, setCalendarData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCalendar = useCallback(async () => {
    if (!tripId) return
    setIsLoading(true)
    setError(null)
    try {
      const [tripRes, calRes] = await Promise.all([
        tripService.getTripById(tripId),
        calendarService.getTripCalendar(tripId).catch(() => null),
      ])

      const tripData = tripRes.data || tripRes
      setTrip(tripData)

      if (calRes) {
        setCalendarData(calRes.data || calRes)
      }
    } catch (err) {
      console.warn('Failed to load trip calendar:', err)
      setError(err.message || 'Unable to retrieve trip calendar.')
    } finally {
      setIsLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    fetchCalendar()
  }, [fetchCalendar])

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-20 rounded-2xl w-full" />
        <Skeleton className="h-96 rounded-2xl w-full" />
      </div>
    )
  }

  if (error || !trip) {
    return (
      <ErrorState
        title="Could not load calendar schedule"
        message={error || 'Trip schedule not found.'}
        onRetry={fetchCalendar}
      />
    )
  }

  const days = Array.isArray(trip.itineraryDays) ? trip.itineraryDays : []
  const stops = Array.isArray(trip.stops) ? trip.stops : []
  const currency = trip.budget?.currency || 'USD'
  const dateRange = formatDateRange(trip.startDate, trip.endDate)

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to={`/trips/${tripId}`}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-200 text-slate-300 transition-colors"
            title="Back to Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white font-display">
              {trip.name} — Calendar & Timeline
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>{dateRange}</span>
              <span>•</span>
              <span>{days.length} Days</span>
              <span>•</span>
              <span>{stops.length} Stops</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/trips/${tripId}`}>
            <Button variant="outline" size="sm">
              Overview
            </Button>
          </Link>
          <Link to={`/trips/${tripId}/itinerary`}>
            <Button variant="primary" size="sm" icon={ListOrdered}>
              Edit Itinerary
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Timeline Card */}
      <Card className="p-6 sm:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="pb-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Chronological Journey Timeline
              </h2>
              <p className="text-xs text-slate-400">
                Scheduled events and activities organized day-by-day
              </p>
            </div>
            <Link to={`/trips/${tripId}/itinerary`}>
              <Button variant="outline" size="sm" icon={Sparkles}>
                Add Activities
              </Button>
            </Link>
          </div>

          <TimelineView trip={trip} currency={currency} />
        </div>
      </Card>
    </div>
  )
}

export default CalendarPage
