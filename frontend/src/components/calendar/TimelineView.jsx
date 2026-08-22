import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '@/utils/formatDate'
import { formatCurrency } from '@/utils/formatCurrency'
import { Calendar, Clock, DollarSign, MapPin, Tag, ArrowRight, Sparkles } from 'lucide-react'
import { Card, Badge, Button } from '@/components/common'

export function TimelineView({ trip, currency = 'USD' }) {
  if (!trip) return null

  const days = Array.isArray(trip.itineraryDays) ? trip.itineraryDays : []
  const stops = Array.isArray(trip.stops) ? trip.stops : []
  const tripId = trip._id || trip.id

  if (days.length === 0 && stops.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
        <Calendar className="w-12 h-12 text-teal-600/50 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Timeline not populated yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Add stops and itinerary days to see your chronological travel schedule.
        </p>
        <Link to={`/trips/${tripId}/itinerary`}>
          <Button variant="primary" size="sm" icon={Sparkles}>
            Build Itinerary
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative pl-6 sm:pl-8 border-l-2 border-teal-200/80 space-y-8 ml-2 sm:ml-4 py-2">
      {days.map((day, idx) => {
        const activities = Array.isArray(day.activities) ? day.activities : []
        const formattedDate = day.date ? formatDate(day.date) : `Day ${day.dayNumber}`

        return (
          <div key={day._id || day.id || idx} className="relative space-y-3">
            {/* Timeline Dot Indicator */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-teal-600 border-4 border-teal-100 ring-2 ring-teal-600/20" />

            {/* Day Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-black bg-slate-900 text-white rounded-lg">
                  Day {day.dayNumber}
                </span>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  {day.title || `Day ${day.dayNumber}`}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" /> {formattedDate}
              </span>
            </div>

            {/* Day Activities Cards */}
            {activities.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-xs italic">
                No activities scheduled for this day yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {activities.map((act, aIdx) => (
                  <Card
                    key={act._id || act.id || aIdx}
                    className="p-3.5 border-slate-200/90 shadow-2xs hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" size="sm" className="text-[10px]">
                            {act.category || 'OTHER'}
                          </Badge>
                          {act.startTime && (
                            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-teal-600" />
                              {act.startTime} {act.endTime ? `– ${act.endTime}` : ''}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {act.title}
                        </h4>

                        {act.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {act.description}
                          </p>
                        )}
                      </div>

                      {Number(act.estimatedCost) > 0 && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 shrink-0">
                          {formatCurrency(act.estimatedCost, currency)}
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default TimelineView
