import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { ArrowLeft, Plus, MapPin, Calendar, GripVertical, Clock, DollarSign, Sparkles } from 'lucide-react'
import { Button, Card, Badge } from '@/components/common'

export function ItineraryBuilderPage() {
  const { tripId } = useParams()

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to={`/trips/${tripId}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Trip Details
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Itinerary Builder</h1>
          <p className="text-xs text-slate-500">Plan days, sequence stops, and organize activities</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/trips/${tripId}/budget`}>
            <Button variant="outline" size="sm" icon={DollarSign}>
              View Budget
            </Button>
          </Link>
          <Link to={`/trips/${tripId}/calendar`}>
            <Button variant="outline" size="sm" icon={Calendar}>
              Calendar View
            </Button>
          </Link>
          <Button variant="primary" size="sm" icon={Plus}>
            Add Stop
          </Button>
        </div>
      </div>

      {/* Builder Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stops Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Trip Stops</h3>
              <Badge variant="primary" size="sm">0 Stops</Badge>
            </div>
            <div className="py-6 text-center text-xs text-slate-400">
              <MapPin className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              Click "Add Stop" to choose destination cities.
            </div>
          </Card>
        </div>

        {/* Days & Activities Workspace */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-6 text-center py-12 border-dashed border-slate-200">
            <Sparkles className="w-8 h-8 text-teal-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 font-display">Build Day-by-Day Schedule</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Add days and discover activities from our catalog to build a structured travel itinerary.
            </p>
            <Button variant="primary" size="sm" icon={Plus}>
              Add First Itinerary Day
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ItineraryBuilderPage
