import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, Badge } from '@/components/common'

export function CalendarPage() {
  const { tripId } = useParams()

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to={`/trips/${tripId}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Trip Details
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Trip Calendar & Timeline</h1>
          <p className="text-xs text-slate-500">Day-by-day chronological visualization of your stops & activities</p>
        </div>

        <Link to={`/trips/${tripId}/itinerary`}>
          <Button variant="outline" size="sm">
            Edit in Itinerary Builder
          </Button>
        </Link>
      </div>

      <Card className="p-6 text-center py-16 border-dashed border-slate-200">
        <CalendarIcon className="w-10 h-10 text-teal-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 font-display">Timeline Calendar</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
          Add days and scheduled activities in your trip to render the interactive timeline view.
        </p>
      </Card>
    </div>
  )
}

export default CalendarPage
