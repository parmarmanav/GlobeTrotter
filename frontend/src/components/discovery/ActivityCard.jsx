import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '@/utils/formatCurrency'
import { Clock, DollarSign, MapPin, Star, Plus, ArrowRight, Tag } from 'lucide-react'
import { Card, Badge, Button } from '@/components/common'

const DEFAULT_ACTIVITY_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'

const CATEGORY_COLORS = {
  SIGHTSEEING: 'bg-sky-50 text-sky-700 border-sky-200',
  FOOD: 'bg-amber-50 text-amber-700 border-amber-200',
  ADVENTURE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CULTURE: 'bg-purple-50 text-purple-700 border-purple-200',
  NATURE: 'bg-indigo-500/10 text-indigo-400 border-teal-200',
  ENTERTAINMENT: 'bg-pink-50 text-pink-700 border-pink-200',
  SHOPPING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  OTHER: 'bg-slate-800/50 text-slate-300 border-[var(--color-border-subtle)]',
}

export function ActivityCard({ activity, onAddToTrip, currency = 'USD' }) {
  if (!activity) return null

  const activityId = activity._id || activity.id
  const title = activity.title || 'Activity'
  const category = (activity.category || 'OTHER').toUpperCase()
  const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER
  const cost = Number(activity.estimatedCost || activity.cost || 0)
  const duration = activity.durationHours ? `${activity.durationHours} hrs` : activity.duration || 'Flexible'
  const rating = activity.rating || 4.8
  const cityName = activity.cityId?.name || activity.cityName || activity.city || ''

  return (
    <Card className="p-0 overflow-hidden flex flex-col justify-between group hoverable border-[var(--color-border-subtle)]/90 shadow-md hover:shadow-md transition-all duration-200">
      {/* Image & Overlay */}
      <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
        <img
          src={activity.image || DEFAULT_ACTIVITY_IMAGE}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = DEFAULT_ACTIVITY_IMAGE }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

        {/* Category & Rating Badges */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border shadow-md backdrop-blur-md ${categoryColor}`}>
            {category}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> {rating}
          </span>
        </div>

        {cityName && (
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-[11px] font-medium text-slate-100 flex items-center gap-1 drop-shadow-lg">
              <MapPin className="w-3 h-3 text-teal-300" /> {cityName}
            </p>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <Link to={`/activities/${activityId}`} className="block group/title">
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover/title:text-indigo-400 transition-colors font-display line-clamp-1">
              {title}
            </h4>
          </Link>

          {activity.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {activity.description}
            </p>
          )}
        </div>

        {/* Cost & Duration Meta */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-[var(--color-border-subtle)]">
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {duration}
          </span>
          <span className="font-bold text-emerald-700">
            {cost > 0 ? formatCurrency(cost, currency) : 'Free Experience'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Link
            to={`/activities/${activityId}`}
            className="text-xs font-semibold text-slate-400 hover:text-white"
          >
            Details
          </Link>
          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={() => onAddToTrip?.(activity)}
          >
            Add to Itinerary
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ActivityCard
