import React, { useState } from 'react'
import { formatCurrency } from '@/utils/formatCurrency'
import {
  Clock,
  DollarSign,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Tag,
  Compass,
  MapPin,
} from 'lucide-react'
import { Badge, ConfirmDialog } from '@/components/common'

const CATEGORY_COLORS = {
  SIGHTSEEING: 'bg-sky-50 text-sky-700 border-sky-200',
  FOOD: 'bg-amber-50 text-amber-700 border-amber-200',
  ADVENTURE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CULTURE: 'bg-purple-50 text-purple-700 border-purple-200',
  NATURE: 'bg-teal-50 text-teal-700 border-teal-200',
  ENTERTAINMENT: 'bg-pink-50 text-pink-700 border-pink-200',
  SHOPPING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  OTHER: 'bg-slate-50 text-slate-700 border-slate-200',
}

export function ActivityItem({
  activity,
  index,
  totalCount,
  onEdit,
  onDelete,
  onMove,
  currency = 'USD',
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!activity) return null

  const itemId = activity._id || activity.id
  const category = (activity.category || 'OTHER').toUpperCase()
  const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER

  const timeDisplay = activity.startTime
    ? activity.endTime
      ? `${activity.startTime} - ${activity.endTime}`
      : activity.startTime
    : null

  const cost = Number(activity.estimatedCost) || 0

  return (
    <>
      <div className="group relative flex items-start justify-between p-3.5 rounded-xl bg-white border border-slate-200 hover:border-teal-300 shadow-2xs transition-all duration-150">
        <div className="flex items-start gap-3 min-w-0">
          {/* Reorder Buttons */}
          <div className="flex flex-col pt-0.5 shrink-0">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onMove?.(index, -1)}
              className="p-0.5 text-slate-400 hover:text-teal-600 disabled:opacity-20 cursor-pointer"
              title="Move activity up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={index === totalCount - 1}
              onClick={() => onMove?.(index, 1)}
              className="p-0.5 text-slate-400 hover:text-teal-600 disabled:opacity-20 cursor-pointer"
              title="Move activity down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${categoryColor}`}>
                {category}
              </span>
              {timeDisplay && (
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {timeDisplay}
                </span>
              )}
            </div>

            <h4 className="text-xs font-bold text-slate-900 leading-tight">
              {activity.title}
            </h4>

            {activity.description && (
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {activity.description}
              </p>
            )}

            {activity.notes && (
              <p className="text-[10px] text-slate-400 italic">
                Note: {activity.notes}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Cost & Actions */}
        <div className="flex items-center gap-3 shrink-0 ml-3">
          {cost > 0 && (
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                {formatCurrency(cost, currency)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit?.(activity)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="Edit activity"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
              title="Delete activity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete?.(itemId)
          setShowDeleteConfirm(false)
        }}
        title={`Delete "${activity.title}"?`}
        message="This activity will be removed from your itinerary schedule."
        confirmText="Delete Activity"
        confirmVariant="danger"
      />
    </>
  )
}

export default ActivityItem
