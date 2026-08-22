import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { formatDateRange } from '@/utils/formatDate'
import { TRIP_STATUS_COLORS, TRIP_STATUS_LABELS } from '@/constants/tripStatus'
import { Calendar, MapPin, ArrowRight, Plus, Compass } from 'lucide-react'
import { Card, CardHeader, CardTitle, Button, Badge } from '@/components/common'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'

export function UpcomingTripsWidget({ upcomingTrips = [] }) {
  return (
    <Card className="p-6">
      <CardHeader className="border-none px-0 pt-0">
        <div>
          <CardTitle>Upcoming Trips</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Your next scheduled adventures</p>
        </div>
        <Link to={ROUTES.TRIPS} className="text-xs font-bold text-indigo-400 hover:text-indigo-400 flex items-center gap-1">
          View All Trips <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      {upcomingTrips.length === 0 ? (
        <div className="py-10 text-center bg-slate-800/50/60 rounded-2xl border border-dashed border-[var(--color-border-subtle)]">
          <Compass className="w-10 h-10 text-indigo-500/60 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-200">No upcoming trips scheduled</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Plan your next journey by picking destinations, dates, and experiences.
          </p>
          <Link to={ROUTES.CREATE_TRIP}>
            <Button size="sm" variant="primary" icon={Plus}>
              Plan Your Next Trip
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {upcomingTrips.slice(0, 4).map((trip) => {
            const tripId = trip._id || trip.id
            const dateRange = formatDateRange(trip.startDate, trip.endDate)
            const stopsCount = Array.isArray(trip.stops) ? trip.stops.length : 0
            const status = trip.status || 'PLANNED'
            const statusColor = TRIP_STATUS_COLORS[status] || 'bg-slate-800 text-slate-300'

            return (
              <div
                key={tripId}
                className="group relative flex flex-col justify-between p-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-subtle)]/90 hover:border-teal-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${statusColor}`}>
                      {TRIP_STATUS_LABELS[status] || status}
                    </span>
                    <Link to={`/trips/${tripId}`} className="block">
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors font-display line-clamp-1">
                        {trip.name}
                      </h4>
                    </Link>
                  </div>
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                    <img
                      src={trip.coverImage || DEFAULT_COVER}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => { e.target.src = DEFAULT_COVER }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {dateRange}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {stopsCount} {stopsCount === 1 ? 'Stop' : 'Stops'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default UpcomingTripsWidget
