import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { tripService } from '@/services/tripService'
import { Compass, ArrowLeft, Image, Sparkles } from 'lucide-react'
import { Button, Input, Textarea, DatePicker, Card, CardHeader, CardTitle, CardDescription } from '@/components/common'

export function CreateTripPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    coverImage: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.startDate || !formData.endDate) {
      setErrorMessage('Please fill in the required fields (Trip name and Dates).')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await tripService.createTrip(formData)
      const newTrip = response.data || response
      const tripId = newTrip._id || newTrip.id || 'new'
      navigate(`/trips/${tripId}/itinerary`)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create trip. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <Link
        to={ROUTES.TRIPS}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Trips
      </Link>

      <Card className="p-6 sm:p-8">
        <CardHeader className="border-none px-0 pt-0">
          <div>
            <CardTitle className="text-xl">Plan a New Adventure</CardTitle>
            <CardDescription>
              Set up your journey title, timeline, and destinations. You'll add stops and activities next.
            </CardDescription>
          </div>
        </CardHeader>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Trip Name *"
            name="name"
            placeholder="e.g., Grand Tour of Western Europe"
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
            label="Trip Overview / Notes"
            name="description"
            placeholder="Brief notes about travel goals, companions, and highlights..."
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />

          <Input
            label="Cover Image URL (Optional)"
            name="coverImage"
            placeholder="https://images.unsplash.com/..."
            icon={Image}
            value={formData.coverImage}
            onChange={handleChange}
          />

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
              icon={Sparkles}
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
