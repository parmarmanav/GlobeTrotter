import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tripService } from '@/services/tripService'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { getCuratedItineraryForCity } from '@/data/curatedItineraries'
import { Modal, Input, DatePicker, Button, Badge } from '@/components/common'
import {
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  IndianRupee,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const VALID_CATEGORIES = new Set([
  'SIGHTSEEING',
  'FOOD',
  'ADVENTURE',
  'CULTURE',
  'SHOPPING',
  'NATURE',
  'ENTERTAINMENT',
  'NIGHTLIFE',
  'RELAXATION',
  'WELLNESS',
  'OTHER',
])

export function GenerateTripFromCityModal({ isOpen, onClose, city }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToast } = useApp()

  const curatedPlan = city ? getCuratedItineraryForCity(city) : null
  const totalDays = curatedPlan?.durationDays || 3

  // Helper to format date as YYYY-MM-DD
  const formatDateToYMD = (dateObj) => {
    const y = dateObj.getFullYear()
    const m = String(dateObj.getMonth() + 1).padStart(2, '0')
    const d = String(dateObj.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Calculate default start date: 7 days from today
  const defaultStartDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return formatDateToYMD(d)
  }

  const calculateEndDate = (startStr, days) => {
    if (!startStr) return ''
    const parts = startStr.split('-').map(Number)
    if (parts.length !== 3 || isNaN(parts[0])) return ''
    const s = new Date(parts[0], parts[1] - 1, parts[2])
    s.setDate(s.getDate() + (days - 1))
    return formatDateToYMD(s)
  }

  const [tripName, setTripName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isOpen && city) {
      const s = defaultStartDate()
      const e = calculateEndDate(s, totalDays)
      setTripName(`${city.name} Journey (${totalDays} Days)`)
      setStartDate(s)
      setEndDate(e)
      setBudget(String(curatedPlan?.estimatedBudgetINR || 45000))
      setErrorMessage('')
    }
  }, [isOpen, city, totalDays])

  const handleStartDateChange = (e) => {
    const val = typeof e === 'string' ? e : e?.target?.value || ''
    setStartDate(val)
    if (val) {
      setEndDate(calculateEndDate(val, totalDays))
    }
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      addToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in to generate and save your customized trip.',
      })
      onClose()
      navigate('/auth/login')
      return
    }

    if (!startDate || !endDate) {
      setErrorMessage('Please select a valid start date for your journey.')
      return
    }

    setIsSubmitting(true)
    try {
      const cityId = city._id || city.id
      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(String(cityId))

      // Build populated itinerary days from curated plan with properly computed dates
      const startParts = startDate.split('-').map(Number)
      const baseStartDate = new Date(startParts[0], startParts[1] - 1, startParts[2])

      const itineraryDaysPayload = (curatedPlan?.days || []).map((d) => {
        const dayDate = new Date(baseStartDate)
        dayDate.setDate(dayDate.getDate() + (d.dayNumber - 1))

        return {
          dayNumber: d.dayNumber,
          date: formatDateToYMD(dayDate),
          title: d.title || `Day ${d.dayNumber}`,
          notes: d.summary || '',
          activities: (d.activities || []).map((a, aIdx) => {
            const rawCat = (a.category || 'SIGHTSEEING').toUpperCase()
            const category = VALID_CATEGORIES.has(rawCat) ? rawCat : 'SIGHTSEEING'

            return {
              title: a.title,
              description: a.description || '',
              startTime: a.startTime || '',
              endTime: a.endTime || '',
              estimatedCost: Number(a.estimatedCost || 0),
              category,
              sequenceOrder: aIdx + 1,
            }
          }),
        }
      })

      const tripPayload = {
        name: tripName.trim() || `${city.name} Trip`,
        description: `Curated ${totalDays}-day journey to ${city.name}, ${city.country}. ${curatedPlan?.tagline || ''}`,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status: 'PLANNED',
        coverImage: city.image || undefined,
        budget: {
          totalBudget: Number(budget) || curatedPlan?.estimatedBudgetINR || 45000,
          currency: 'INR',
        },
        stops: [
          {
            cityId: isValidMongoId ? cityId : undefined,
            cityName: city.name,
            country: city.country,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            sequenceOrder: 1,
            notes: `Stay in ${city.name} center for the ${totalDays}-day experience`,
          },
        ],
        itineraryDays: itineraryDaysPayload,
      }

      const response = await tripService.createTrip(tripPayload)
      const createdTrip = response.data || response
      const newTripId = createdTrip._id || createdTrip.id

      addToast({
        type: 'success',
        title: 'Trip Generated Successfully! 🎉',
        message: `Your ${totalDays}-day itinerary for ${city.name} has been created.`,
      })

      onClose()
      navigate(`/trips/${newTripId}/itinerary`)
    } catch (err) {
      console.error('Failed to auto-generate trip:', err)
      const apiMsg = err.response?.data?.message || err.message || 'Could not generate trip.'
      setErrorMessage(apiMsg)
      addToast({
        type: 'error',
        title: 'Trip Creation Error',
        message: apiMsg,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!city || !curatedPlan) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Plan Your ${totalDays}-Day Journey to ${city.name}`}
      description="Pick your start date and we'll automatically generate your full day-by-day itinerary"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Trip Name & Highlights Preview */}
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 truncate-safe">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              Pre-filled {totalDays}-Day Curated Schedule
            </span>
            <Badge variant="primary" size="sm" className="font-bold">
              {totalDays} Days Fixed
            </Badge>
          </div>
          <p className="text-xs text-slate-300 font-light">{curatedPlan.tagline}</p>
        </div>

        <Input
          label="Trip Name *"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          required
        />

        {/* Date Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <DatePicker
              label="Choose Trip Start Date *"
              value={startDate}
              onChange={handleStartDateChange}
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">Editable arrival date</p>
          </div>

          <div>
            <Input
              label={`End Date (${totalDays} Days Duration)`}
              type="date"
              value={endDate}
              readOnly
              className="bg-slate-950/50 text-slate-400 cursor-not-allowed opacity-90 border-slate-800"
            />
            <p className="text-[11px] text-indigo-400 font-medium mt-1">
              Automatically calculated for {totalDays} days
            </p>
          </div>
        </div>

        {/* Target Budget */}
        <Input
          label="Target Budget Limit (₹ INR)"
          type="number"
          min="0"
          step="any"
          icon={IndianRupee}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        {/* Preview of Day-by-Day Schedule */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Included Day-by-Day Itinerary Preview:
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {curatedPlan.days.map((d) => (
              <div
                key={d.dayNumber}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white truncate-safe">{d.title}</span>
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                    {d.activities?.length || 0} activities
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{d.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            icon={ArrowRight}
          >
            Auto-Generate {totalDays}-Day Trip
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default GenerateTripFromCityModal
