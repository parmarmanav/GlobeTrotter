import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tripService } from '@/services/tripService'
import { itineraryService } from '@/services/itineraryService'
import { useApp } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { getDurationDays } from '@/utils/formatDate'
import {
  Calendar,
  MapPin,
  Plus,
  ArrowLeft,
  DollarSign,
  Sparkles,
  Layers,
  Clock,
  Eye,
} from 'lucide-react'
import {
  Button,
  Card,
  Badge,
  Skeleton,
  ErrorState,
  EmptyState,
} from '@/components/common'
import { StopsList } from '@/components/itinerary/StopsList'
import { AddStopModal } from '@/components/itinerary/AddStopModal'
import { DayCard } from '@/components/itinerary/DayCard'
import { AddDayModal } from '@/components/itinerary/AddDayModal'

export function ItineraryBuilderPage() {
  const { tripId } = useParams()
  const { addToast } = useApp()

  const [trip, setTrip] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddStopOpen, setIsAddStopOpen] = useState(false)
  const [isAddDayOpen, setIsAddDayOpen] = useState(false)
  const [isMutating, setIsMutating] = useState(false)

  const fetchTrip = useCallback(async () => {
    if (!tripId) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await tripService.getTripById(tripId)
      const data = response.data || response
      setTrip(data)
    } catch (err) {
      console.warn('Failed to load itinerary data:', err)
      setError(err.message || 'Unable to load trip itinerary.')
    } finally {
      setIsLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    fetchTrip()
  }, [fetchTrip])

  // ----------------------------------------------------
  // STOP OPERATIONS
  // ----------------------------------------------------

  const handleAddStop = async (stopPayload) => {
    setIsMutating(true)
    try {
      const response = await tripService.addStop(tripId, stopPayload)
      const newStop = response.data || response
      setTrip((prev) => ({
        ...prev,
        stops: [...(prev?.stops || []), newStop],
      }))
      addToast({
        type: 'success',
        title: 'Stop Added',
        message: `${stopPayload.cityName} added to route.`,
      })
      setIsAddStopOpen(false)
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Failed to Add Stop',
        message: err.message || 'Could not add stop.',
      })
    } finally {
      setIsMutating(false)
    }
  }

  const handleUpdateStop = async (stopId, stopPayload) => {
    setIsMutating(true)
    try {
      const response = await tripService.updateStop(tripId, stopId, stopPayload)
      const updatedStop = response.data || response
      setTrip((prev) => ({
        ...prev,
        stops: (prev?.stops || []).map((s) => ((s._id || s.id) === stopId ? updatedStop : s)),
      }))
      addToast({
        type: 'success',
        title: 'Stop Updated',
        message: 'Destination details updated.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update stop.',
      })
    } finally {
      setIsMutating(false)
    }
  }

  const handleDeleteStop = async (stopId) => {
    setIsMutating(true)
    try {
      await tripService.deleteStop(tripId, stopId)
      setTrip((prev) => ({
        ...prev,
        stops: (prev?.stops || []).filter((s) => (s._id || s.id) !== stopId),
      }))
      addToast({
        type: 'success',
        title: 'Stop Removed',
        message: 'Destination stop removed from route.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete stop.',
      })
    } finally {
      setIsMutating(false)
    }
  }

  const handleReorderStops = async (orderedStopIds) => {
    try {
      await tripService.reorderStops(tripId, orderedStopIds)
      // Optimistic reorder
      setTrip((prev) => {
        const currentStops = [...(prev?.stops || [])]
        const map = new Map(currentStops.map((s) => [s._id || s.id, s]))
        const newStops = orderedStopIds.map((id) => map.get(id)).filter(Boolean)
        return { ...prev, stops: newStops }
      })
    } catch (err) {
      fetchTrip()
    }
  }

  // ----------------------------------------------------
  // ITINERARY DAY OPERATIONS
  // ----------------------------------------------------

  const handleAddDay = async (dayPayload) => {
    setIsMutating(true)
    try {
      const response = await itineraryService.addDay(tripId, dayPayload)
      const newDay = response.data || response
      setTrip((prev) => ({
        ...prev,
        itineraryDays: [...(prev?.itineraryDays || []), newDay],
      }))
      addToast({
        type: 'success',
        title: 'Day Added',
        message: `Day ${dayPayload.dayNumber} created in itinerary.`,
      })
      setIsAddDayOpen(false)
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Failed to Add Day',
        message: err.message || 'Could not add itinerary day.',
      })
    } finally {
      setIsMutating(false)
    }
  }

  const handleDeleteDay = async (dayId) => {
    setIsMutating(true)
    try {
      await itineraryService.deleteDay(tripId, dayId)
      setTrip((prev) => ({
        ...prev,
        itineraryDays: (prev?.itineraryDays || []).filter((d) => (d._id || d.id) !== dayId),
      }))
      addToast({
        type: 'success',
        title: 'Day Deleted',
        message: 'Itinerary day block removed.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete day.',
      })
    } finally {
      setIsMutating(false)
    }
  }

  // ----------------------------------------------------
  // ACTIVITY OPERATIONS
  // ----------------------------------------------------

  const handleAddActivity = async (dayId, activityPayload) => {
    setIsMutating(true)
    try {
      const response = await itineraryService.addActivity(tripId, dayId, activityPayload)
      const newActivity = response.data || response
      setTrip((prev) => {
        const days = (prev?.itineraryDays || []).map((d) => {
          if ((d._id || d.id) === dayId) {
            return {
              ...d,
              activities: [...(d.activities || []), newActivity],
            }
          }
          return d
        })
        return { ...prev, itineraryDays: days }
      })
      addToast({
        type: 'success',
        title: 'Activity Scheduled',
        message: `"${activityPayload.title}" added to itinerary.`,
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Failed to Add Activity',
        message: err.message || 'Could not add activity.',
      })
    } finally {
      setIsMutating(false)
    }
  }

  const handleUpdateActivity = async (dayId, itemId, activityPayload) => {
    setIsMutating(true)
    try {
      const response = await itineraryService.updateActivity(tripId, dayId, itemId, activityPayload)
      const updatedActivity = response.data || response
      setTrip((prev) => {
        const days = (prev?.itineraryDays || []).map((d) => {
          if ((d._id || d.id) === dayId) {
            return {
              ...d,
              activities: (d.activities || []).map((a) => ((a._id || a.id) === itemId ? updatedActivity : a)),
            }
          }
          return d
        })
        return { ...prev, itineraryDays: days }
      })
      addToast({
        type: 'success',
        title: 'Activity Updated',
        message: 'Changes saved successfully.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update activity.',
      })
    } finally {
      setIsMutating(false)
    }
  }

  const handleDeleteActivity = async (dayId, itemId) => {
    setIsMutating(true)
    try {
      await itineraryService.deleteActivity(tripId, dayId, itemId)
      setTrip((prev) => {
        const days = (prev?.itineraryDays || []).map((d) => {
          if ((d._id || d.id) === dayId) {
            return {
              ...d,
              activities: (d.activities || []).filter((a) => (a._id || a.id) !== itemId),
            }
          }
          return d
        })
        return { ...prev, itineraryDays: days }
      })
      addToast({
        type: 'success',
        title: 'Activity Deleted',
        message: 'Activity removed from day schedule.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete activity.',
      })
    } finally {
      setIsMutating(false)
    }
  }

  const handleReorderActivities = async (dayId, orderedItemIds) => {
    try {
      await itineraryService.reorderActivities(tripId, dayId, orderedItemIds)
      setTrip((prev) => {
        const days = (prev?.itineraryDays || []).map((d) => {
          if ((d._id || d.id) === dayId) {
            const currentActs = [...(d.activities || [])]
            const map = new Map(currentActs.map((a) => [a._id || a.id, a]))
            const newActs = orderedItemIds.map((id) => map.get(id)).filter(Boolean)
            return { ...d, activities: newActs }
          }
          return d
        })
        return { ...prev, itineraryDays: days }
      })
    } catch (err) {
      fetchTrip()
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-20 rounded-2xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <ErrorState
        title="Could not load Itinerary Builder"
        message={error || 'Trip not found.'}
        onRetry={fetchTrip}
      />
    )
  }

  const stops = Array.isArray(trip.stops) ? trip.stops : []
  const days = Array.isArray(trip.itineraryDays) ? trip.itineraryDays : []
  const currency = trip.budget?.currency || 'USD'
  const maxDays = trip.startDate && trip.endDate ? getDurationDays(trip.startDate, trip.endDate) : null
  const isMaxDaysReached = maxDays !== null && days.length >= maxDays
  const nextDayNumber = days.length > 0 ? Math.max(...days.map((d) => d.dayNumber || 1)) + 1 : 1

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
            <h1 className="text-lg sm:text-xl font-bold text-white font-display line-clamp-1">
              {trip.name} — Itinerary Builder
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
              <span>{stops.length} Stops</span>
              <span>•</span>
              <span className={isMaxDaysReached ? 'text-amber-600 font-semibold' : ''}>
                {days.length} {maxDays ? `of ${maxDays} Days Planned` : 'Days'}
              </span>
              <span>•</span>
              <span className="font-semibold text-indigo-400">{trip.budget?.currency || 'USD'} Budget</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link to={`/trips/${tripId}`}>
            <Button variant="outline" size="sm" icon={Eye}>
              View Details
            </Button>
          </Link>
          <Link to={`/trips/${tripId}/budget`}>
            <Button variant="outline" size="sm" icon={DollarSign}>
              Budget
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddDayOpen(true)}
            disabled={isMaxDaysReached}
            title={isMaxDaysReached ? `Maximum ${maxDays} days reached for this trip` : undefined}
          >
            Add Day Block
          </Button>
        </div>
      </div>

      {/* Trip Duration Notice Banner */}
      {isMaxDaysReached && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-semibold">
              Trip Capacity Reached: You have scheduled all {maxDays} days of your {maxDays}-day journey ({trip.startDate ? `${new Date(trip.startDate).toLocaleDateString()} – ${new Date(trip.endDate).toLocaleDateString()}` : ''}).
            </span>
          </div>
          <span className="text-[11px] text-amber-700">Delete or adjust existing days to add different blocks</span>
        </div>
      )}

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Route Stops Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <StopsList
              stops={stops}
              onAddStopClick={() => setIsAddStopOpen(true)}
              onUpdateStop={handleUpdateStop}
              onDeleteStop={handleDeleteStop}
              onReorderStops={handleReorderStops}
              isLoading={isMutating}
            />
          </Card>
        </div>

        {/* Right Column: Days & Activities Workspace */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Day-by-Day Itinerary Schedule ({days.length}{maxDays ? `/${maxDays}` : ''})
            </h2>
            <Button
              size="sm"
              variant="outline"
              icon={Plus}
              onClick={() => setIsAddDayOpen(true)}
              disabled={isMaxDaysReached}
              title={isMaxDaysReached ? `Maximum ${maxDays} days reached` : undefined}
            >
              Add Next Day (Day {nextDayNumber})
            </Button>
          </div>

          {days.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No days planned yet"
              description={`Start organizing your trip day-by-day (up to ${maxDays || 'any'} days).`}
              actionLabel="Add Day 1"
              onAction={() => setIsAddDayOpen(true)}
            />
          ) : (
            <div className="space-y-5">
              {days.map((day) => (
                <DayCard
                  key={day._id || day.id}
                  day={day}
                  currency={currency}
                  onAddActivity={handleAddActivity}
                  onUpdateActivity={handleUpdateActivity}
                  onDeleteActivity={handleDeleteActivity}
                  onReorderActivities={handleReorderActivities}
                  onDeleteDay={handleDeleteDay}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Stop Modal */}
      <AddStopModal
        isOpen={isAddStopOpen}
        onClose={() => setIsAddStopOpen(false)}
        onAddStop={handleAddStop}
        isLoading={isMutating}
      />

      {/* Add Day Modal */}
      <AddDayModal
        isOpen={isAddDayOpen}
        onClose={() => setIsAddDayOpen(false)}
        onAddDay={handleAddDay}
        nextDayNumber={nextDayNumber}
        maxDays={maxDays}
        currentDaysCount={days.length}
        isLoading={isMutating}
      />
    </div>
  )
}

export default ItineraryBuilderPage
