import React, { useState } from 'react'
import { formatDate } from '@/utils/formatDate'
import { formatCurrency } from '@/utils/formatCurrency'
import { Calendar, Plus, Trash2, Edit, Sparkles, DollarSign } from 'lucide-react'
import { Card, Button, ConfirmDialog } from '@/components/common'
import { ActivityItem } from './ActivityItem'
import { AddActivityModal } from './AddActivityModal'

export function DayCard({
  day,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onReorderActivities,
  onDeleteDay,
  currency = 'USD',
}) {
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [activityToEdit, setActivityToEdit] = useState(null)
  const [showDeleteDayConfirm, setShowDeleteDayConfirm] = useState(false)

  if (!day) return null

  const dayId = day._id || day.id
  const activities = Array.isArray(day.activities) ? day.activities : []
  const formattedDate = day.date ? formatDate(day.date) : null

  const dayTotalCost = activities.reduce(
    (sum, a) => sum + (Number(a.estimatedCost) || 0),
    0
  )

  const handleSaveActivity = async (payload) => {
    if (activityToEdit) {
      const itemId = activityToEdit._id || activityToEdit.id
      await onUpdateActivity?.(dayId, itemId, payload)
      setActivityToEdit(null)
    } else {
      await onAddActivity?.(dayId, payload)
      setIsAddActivityOpen(false)
    }
  }

  const handleMoveActivity = (index, direction) => {
    const newActs = [...activities]
    const targetIdx = index + direction
    if (targetIdx < 0 || targetIdx >= newActs.length) return

    const temp = newActs[index]
    newActs[index] = newActs[targetIdx]
    newActs[targetIdx] = temp

    onReorderActivities?.(dayId, newActs.map((a) => a._id || a.id))
  }

  return (
    <>
      <Card className="p-5 sm:p-6 border-slate-200 shadow-xs space-y-4">
        {/* Day Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 text-xs font-extrabold bg-teal-600 text-white rounded-lg">
                Day {day.dayNumber}
              </span>
              <h3 className="text-base font-bold text-slate-900 font-display">
                {day.title || `Day ${day.dayNumber}`}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" /> {formattedDate}
                </span>
              )}
              {dayTotalCost > 0 && (
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {formatCurrency(dayTotalCost, currency)}
                </span>
              )}
            </div>

            {day.notes && (
              <p className="text-xs text-slate-500 italic mt-1">{day.notes}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={Plus}
              onClick={() => {
                setActivityToEdit(null)
                setIsAddActivityOpen(true)
              }}
            >
              Add Activity
            </Button>
            <button
              type="button"
              onClick={() => setShowDeleteDayConfirm(true)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Delete day"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Activities List */}
        {activities.length === 0 ? (
          <div className="py-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
            <Sparkles className="w-6 h-6 text-teal-600/50 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-700">No activities scheduled for this day</p>
            <p className="text-[11px] text-slate-400 mb-3">Add sightseeing tours, food stops, or leisure events.</p>
            <Button
              size="sm"
              variant="secondary"
              icon={Plus}
              onClick={() => setIsAddActivityOpen(true)}
            >
              Schedule Activity
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activities.map((act, idx) => (
              <ActivityItem
                key={act._id || act.id || idx}
                activity={act}
                index={idx}
                totalCount={activities.length}
                currency={currency}
                onEdit={(a) => {
                  setActivityToEdit(a)
                  setIsAddActivityOpen(true)
                }}
                onDelete={(itemId) => onDeleteActivity?.(dayId, itemId)}
                onMove={handleMoveActivity}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Add / Edit Activity Modal */}
      <AddActivityModal
        isOpen={isAddActivityOpen}
        onClose={() => {
          setIsAddActivityOpen(false)
          setActivityToEdit(null)
        }}
        onAddActivity={handleSaveActivity}
        dayNumber={day.dayNumber}
        dayTitle={day.title}
        initialData={activityToEdit}
      />

      {/* Delete Day Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDayConfirm}
        onClose={() => setShowDeleteDayConfirm(false)}
        onConfirm={() => {
          onDeleteDay?.(dayId)
          setShowDeleteDayConfirm(false)
        }}
        title={`Delete Day ${day.dayNumber}?`}
        message="This will delete this day and all activities scheduled inside it."
        confirmText="Delete Day"
        confirmVariant="danger"
      />
    </>
  )
}

export default DayCard
