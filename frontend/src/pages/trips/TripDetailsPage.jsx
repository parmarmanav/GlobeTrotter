import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Calendar, MapPin, DollarSign, ListOrdered, Share2, ArrowLeft, Plus } from 'lucide-react'
import { Button, Card, Badge } from '@/components/common'

export function TripDetailsPage() {
  const { tripId } = useParams()

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <Link
        to={ROUTES.TRIPS}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Trips
      </Link>

      {/* Trip Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-teal-800 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="bg-teal-500/20 text-teal-200 border-teal-400/30 mb-2">
              Trip Overview
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">Trip #{tripId}</h1>
            <p className="text-xs text-slate-300 mt-1">Multi-city customized travel plan</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to={`/trips/${tripId}/itinerary`}>
              <Button variant="accent" size="sm" icon={ListOrdered}>
                Itinerary Builder
              </Button>
            </Link>
            <Link to={`/trips/${tripId}/budget`}>
              <Button variant="secondary" size="sm" icon={DollarSign} className="bg-white/10 hover:bg-white/20 border border-white/20">
                Budget
              </Button>
            </Link>
            <Link to={`/trips/${tripId}/calendar`}>
              <Button variant="secondary" size="sm" icon={Calendar} className="bg-white/10 hover:bg-white/20 border border-white/20">
                Calendar
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 md:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-display">Itinerary Summary</h3>
          <p className="text-xs text-slate-500">
            Configure stops, dates, and day-by-day activities inside the Itinerary Builder.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-400">No stops configured yet.</p>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-display">Budget Highlights</h3>
          <p className="text-xs text-slate-500">Track and categorize estimated expenses.</p>
          <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-400">Budget not allocated yet.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TripDetailsPage
