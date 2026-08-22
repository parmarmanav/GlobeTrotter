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
    <Card className="p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white font-display truncate-safe">
              Curated {curatedPlan.durationDays}-Day Itinerary for {city.name}
            </h2>
            <Badge variant="primary" size="sm" className="font-bold">
              {curatedPlan.durationDays} Days Plan
            </Badge>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">{curatedPlan.tagline}</p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Est. Total Budget</p>
            <p className="text-sm font-black text-indigo-400">
              {formatCurrency(curatedPlan.estimatedBudgetINR, 'INR')}
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={() => onAddToTrip?.(city)}
            className="shadow-lg shadow-indigo-600/20"
          >
            Add to Trip
          </Button>
        </div>
      </div>

      {/* Day Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((day, idx) => (
          <button
            key={day.dayNumber}
            type="button"
            onClick={() => setActiveDayIndex(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[40px] flex items-center gap-1.5 ${
              activeDayIndex === idx
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            <span>Day {day.dayNumber}</span>
          </button>
        ))}
      </div>

      {/* Active Day Content */}
      {activeDay && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
            <h3 className="text-sm font-bold text-indigo-300 font-display">
              {activeDay.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">{activeDay.summary}</p>
          </div>

          {/* Activities List for this Day */}
          <div className="space-y-3">
            {(activeDay.activities || []).map((activity, aIdx) => (
              <div
                key={aIdx}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2 hover-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" size="sm" className="text-[10px]">
                        {activity.category || 'SIGHTSEEING'}
                      </Badge>
                      {activity.startTime && (
                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-400 shrink-0" />
                          {activity.startTime} {activity.endTime ? `– ${activity.endTime}` : ''}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate-safe">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>

                  {Number(activity.estimatedCost) > 0 && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 shrink-0">
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
