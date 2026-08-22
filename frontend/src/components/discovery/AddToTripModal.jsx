import React, { useState, useEffect } from 'react'
import { tripService } from '@/services/tripService'
import { itineraryService } from '@/services/itineraryService'
import { useApp } from '@/context/AppContext'
import { Modal, Select, Button, Spinner } from '@/components/common'
import { Plus, Check, MapPin, Calendar, Sparkles } from 'lucide-react'

export function AddToTripModal({
  isOpen,
  onClose,
  item = null, // Can be city or activity
  itemType = 'activity', // 'city' or 'activity'
}) {
  const { addToast } = useApp()
  const [trips, setTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState('')
  const [selectedDayId, setSelectedDayId] = useState('')
  const [days, setDays] = useState([])
  const [isLoadingTrips, setIsLoadingTrips] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const fetchUserTrips = async () => {
      setIsLoadingTrips(true)
      try {
        const response = await tripService.getTrips({ limit: 50, sort: '-createdAt' })
        const data = response.data || []
        setTrips(Array.isArray(data) ? data : [])
        if (data.length > 0) {
          const firstTrip = data[0]
          const fId = firstTrip._id || firstTrip.id
          setSelectedTripId(fId)
          if (Array.isArray(firstTrip.itineraryDays)) {
            setDays(firstTrip.itineraryDays)
            if (firstTrip.itineraryDays.length > 0) {
              setSelectedDayId(firstTrip.itineraryDays[0]._id || firstTrip.itineraryDays[0].id)
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load trips for modal:', err)
      } finally {
        setIsLoadingTrips(false)
      }
    }

    fetchUserTrips()
  }, [isOpen])

  const handleTripChange = async (e) => {
    const tId = e.target.value
    setSelectedTripId(tId)
    const currentTrip = trips.find((t) => (t._id || t.id) === tId)
    if (currentTrip && Array.isArray(currentTrip.itineraryDays)) {
      setDays(currentTrip.itineraryDays)
      if (currentTrip.itineraryDays.length > 0) {
        setSelectedDayId(currentTrip.itineraryDays[0]._id || currentTrip.itineraryDays[0].id)
      } else {
        setSelectedDayId('')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedTripId) {
      addToast({ type: 'warning', title: 'Select a Trip', message: 'Please choose which trip to add to.' })
      return
    }

    setIsSubmitting(true)
    try {
      if (itemType === 'city') {
        const cityId = item._id || item.id
        await tripService.addStop(selectedTripId, {
          cityId,
          cityName: item.name,
          country: item.country,
        })
        addToast({
          type: 'success',
          title: 'Stop Added',
          message: `${item.name} has been added as a route stop in your trip.`,
        })
      } else {
        if (!selectedDayId) {
          addToast({ type: 'warning', title: 'Select an Itinerary Day', message: 'Please select a day block or create one in the builder.' })
          setIsSubmitting(false)
          return
        }

        const activityPayload = {
          title: item.title,
          description: item.description,
          category: (item.category || 'SIGHTSEEING').toUpperCase(),
          estimatedCost: Number(item.cost || item.estimatedCost || 0),
          activityId: item._id || item.id,
        }

        await itineraryService.addActivity(selectedTripId, selectedDayId, activityPayload)
        addToast({
          type: 'success',
          title: 'Activity Added',
          message: `"${item.title}" added to your day schedule.`,
        })
      }
      onClose()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Add Failed',
        message: err.message || 'Could not add to trip.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const tripOptions = trips.map((t) => ({
    value: t._id || t.id,
    label: t.name,
  }))

  const dayOptions = days.map((d) => ({
    value: d._id || d.id,
    label: `Day ${d.dayNumber}: ${d.title || 'Scheduled Day'}`,
  }))

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemType === 'city' ? `Add ${item?.name || 'City'} to Trip` : `Schedule "${item?.title || 'Activity'}"`}
      description="Choose one of your trips to attach this experience"
      maxWidth="max-w-md"
    >
      {isLoadingTrips ? (
        <div className="py-8 text-center space-y-2">
          <Spinner size="md" className="mx-auto text-teal-600" />
          <p className="text-xs text-slate-500">Loading your trips...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="py-6 text-center space-y-3">
          <p className="text-xs text-slate-600">You don't have any trips created yet.</p>
          <Button
            size="sm"
            variant="primary"
            onClick={() => window.location.assign('/trips/create')}
          >
            Create Your First Trip
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Select Trip *"
            options={tripOptions}
            value={selectedTripId}
            onChange={handleTripChange}
            required
          />

          {itemType === 'activity' && (
            <div>
              {days.length === 0 ? (
                <p className="text-xs text-amber-600 font-medium">
                  This trip has no days created yet. Open the builder to initialize Day 1 first.
                </p>
              ) : (
                <Select
                  label="Select Itinerary Day *"
                  options={dayOptions}
                  value={selectedDayId}
                  onChange={(e) => setSelectedDayId(e.target.value)}
                  required
                />
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              icon={Plus}
            >
              Add to Itinerary
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default AddToTripModal
