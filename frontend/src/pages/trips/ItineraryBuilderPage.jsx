import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tripService } from '@/services/tripService'
import { itineraryService } from '@/services/itineraryService'
import { useApp } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
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
  const nextDayNumber = days.length > 0 ? Math.max(...days.map((d) => d.dayNumber || 1)) + 1 : 1

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to={`/trips/${tripId}`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Back to Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-display line-clamp-1">
              {trip.name} — Itinerary Builder
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>{stops.length} Stops</span>
              <span>•</span>
              <span>{days.length} Days</span>
              <span>•</span>
              <span className="font-semibold text-teal-600">{trip.budget?.currency || 'USD'} Budget</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          >
            Add Day Block
          </Button>
        </div>
      </div>

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
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Day-by-Day Itinerary Schedule ({days.length})
            </h2>
            <Button
              size="sm"
              variant="outline"
              icon={Plus}
              onClick={() => setIsAddDayOpen(true)}
            >
              Add Next Day (Day {nextDayNumber})
            </Button>
          </div>

          {days.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No days planned yet"
              description="Start organizing your trip day-by-day by creating Day 1."
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
        isLoading={isMutating}
      />
    </div>
  )
}

export default ItineraryBuilderPage
