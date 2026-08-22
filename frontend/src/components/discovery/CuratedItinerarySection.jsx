import React, { useState } from 'react'
import { formatCurrency } from '@/utils/formatCurrency'
import { getCuratedItineraryForCity } from '@/data/curatedItineraries'
import { Card, Badge, Button } from '@/components/common'
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle,
  Plus,
  Compass,
  ArrowRight,
} from 'lucide-react'

export function CuratedItinerarySection({ city, onAddToTrip }) {
  const curatedPlan = city ? getCuratedItineraryForCity(city) : null
  const [activeDayIndex, setActiveDayIndex] = useState(0)

  if (!curatedPlan) return null

  const days = curatedPlan.days || []
  const activeDay = days[activeDayIndex] || days[0]

  return (
    <Card className="p-6 sm:p-8 space-y-6 shadow-xs border-slate-200">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-teal-50 text-teal-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              Curated {curatedPlan.durationDays}-Day Itinerary for {city.name}
            </h2>
            <Badge variant="primary" size="sm" className="font-bold">
              {curatedPlan.durationDays} Days Plan
            </Badge>
          </div>
          <p className="text-xs text-slate-500">{curatedPlan.tagline}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase font-bold text-slate-400">Est. Total Budget</p>
            <p className="text-xs font-black text-teal-700">
              {formatCurrency(curatedPlan.estimatedBudgetINR, 'INR')}
            </p>
          </div>
          <Button
            size="sm"
            variant="accent"
            icon={Plus}
            onClick={() => onAddToTrip?.(city)}
          >
            Add to Trip
          </Button>
        </div>
      </div>

      {/* Day Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {days.map((day, idx) => (
          <button
            key={day.dayNumber}
            type="button"
            onClick={() => setActiveDayIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeDayIndex === idx
                ? 'bg-slate-900 text-white shadow-xs scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Active Day Content */}
      {activeDay && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              {activeDay.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{activeDay.summary}</p>
          </div>

          {/* Activities List for this Day */}
          <div className="space-y-3">
            {(activeDay.activities || []).map((activity, aIdx) => (
              <div
                key={aIdx}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" size="sm" className="text-[10px]">
                        {activity.category || 'SIGHTSEEING'}
                      </Badge>
                      {activity.startTime && (
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-teal-600" />
                          {activity.startTime} {activity.endTime ? `– ${activity.endTime}` : ''}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>

                  {Number(activity.estimatedCost) > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
                      {formatCurrency(activity.estimatedCost, 'INR')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default CuratedItinerarySection
