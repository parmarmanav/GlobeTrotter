import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { tripService } from '@/services/tripService'
import { useApp } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { Map, Calendar, DollarSign, Image, ArrowRight, Compass, Sparkles } from 'lucide-react'
import { Card, Button, Input, DatePicker, Textarea, Select } from '@/components/common'

const CURATED_COVERS = [
  { label: 'Tropical Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'European Architecture', url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mountain Adventure', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tokyo Skyline', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Desert Oasis', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80' },
]

export function CreateTripPage() {
  const navigate = useNavigate()
  const { addToast } = useApp()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    coverImage: CURATED_COVERS[0].url,
    totalBudget: '',
    currency: 'USD',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setErrorMessage('Trip name is required.')
      return
    }
    if (!formData.startDate || !formData.endDate) {
      setErrorMessage('Please select both start and end dates.')
      return
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setErrorMessage('End date must be on or after the start date.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        coverImage: formData.coverImage || undefined,
        budget: {
          totalBudget: formData.totalBudget ? Number(formData.totalBudget) : 0,
          currency: formData.currency || 'USD',
        },
      }

      const response = await tripService.createTrip(payload)
      const createdTrip = response.data || response
      const tripId = createdTrip._id || createdTrip.id

      addToast({
        type: 'success',
        title: 'Trip Created!',
        message: 'Your journey has been initialized. Now add stops and activities.',
      })

      if (tripId) {
        navigate(`/trips/${tripId}/itinerary`)
      } else {
        navigate(ROUTES.TRIPS)
      }
    } catch (err) {
      console.error('Trip creation failed:', err)
      setErrorMessage(err.message || 'Failed to create trip. Please verify dates and details.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">Plan a New Adventure</h1>
          <p className="text-xs text-slate-500 mt-1">
            Define your journey dates, description, and budget to begin building your custom itinerary.
          </p>
        </div>
        <Link to={ROUTES.TRIPS} className="text-xs font-semibold text-slate-500 hover:text-slate-900">
          &larr; Back to Trips
        </Link>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Trip Title *"
            name="name"
            placeholder="e.g. 14 Days Across Japan & South Korea"
            icon={Compass}
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              label="Start Date *"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <DatePicker
              label="End Date *"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <Textarea
            label="Trip Description / Vision (Optional)"
            name="description"
            placeholder="What's the goal of this journey? Relaxation, cultural heritage, foodie expedition..."
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />

          {/* Budget Config */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <Input
              label="Target Budget Limit"
              name="totalBudget"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 3500"
              icon={DollarSign}
              value={formData.totalBudget}
              onChange={handleChange}
            />
            <Select
              label="Budget Currency"
              name="currency"
              options={[
                { value: 'USD', label: 'USD ($) — US Dollar' },
                { value: 'EUR', label: 'EUR (€) — Euro' },
                { value: 'GBP', label: 'GBP (£) — British Pound' },
                { value: 'JPY', label: 'JPY (¥) — Japanese Yen' },
                { value: 'INR', label: 'INR (₹) — Indian Rupee' },
                { value: 'AUD', label: 'AUD ($) — Australian Dollar' },
              ]}
              value={formData.currency}
              onChange={handleChange}
            />
          </div>

          {/* Cover Image Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Trip Cover Image
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CURATED_COVERS.map((cover, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, coverImage: cover.url }))}
                  className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    formData.coverImage === cover.url
                      ? 'border-teal-600 ring-2 ring-teal-600/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={cover.url} alt={cover.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <Input
              label="Or Paste Custom Image URL"
              name="coverImage"
              placeholder="https://images.unsplash.com/..."
              icon={Image}
              value={formData.coverImage}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link to={ROUTES.TRIPS}>
              <Button variant="outline" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              iconRight={ArrowRight}
            >
              Create Trip & Build Itinerary
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CreateTripPage
