import React, { useState } from 'react'
import { Modal, Input, DatePicker, Textarea, Button } from '@/components/common'
import { Plus } from 'lucide-react'

export function AddDayModal({
  isOpen,
  onClose,
  onAddDay,
  nextDayNumber = 1,
  maxDays = null,
  currentDaysCount = 0,
  isLoading = false,
}) {
  const [dayNumber, setDayNumber] = useState(nextDayNumber)
  const [date, setDate] = useState('')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [validationError, setValidationError] = useState('')

  React.useEffect(() => {
    setDayNumber(nextDayNumber)
    setValidationError('')
  }, [nextDayNumber, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = Number(dayNumber) || nextDayNumber

    if (maxDays && num > maxDays) {
      setValidationError(`Day ${num} exceeds the scheduled trip duration of ${maxDays} days.`)
      return
    }

    setValidationError('')
    onAddDay({
      dayNumber: num,
      date: date || undefined,
      title: title.trim() || `Day ${num}`,
      notes: notes.trim() || undefined,
    })
    setTitle('')
    setDate('')
    setNotes('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Itinerary Day"
      description={
        maxDays
          ? `Create a scheduled day block (Up to ${maxDays} days for this trip)`
          : 'Create a new scheduled day block in your trip itinerary'
      }
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {maxDays && (
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-teal-200 text-teal-800 text-xs flex items-center justify-between">
            <span className="font-semibold">Trip Duration: {maxDays} Days Maximum</span>
            <span className="font-medium">{currentDaysCount} / {maxDays} planned</span>
          </div>
        )}

        {validationError && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Day Number"
            type="number"
            min="1"
            max={maxDays || undefined}
            value={dayNumber}
            onChange={(e) => {
              setDayNumber(e.target.value)
              if (maxDays && Number(e.target.value) > maxDays) {
                setValidationError(`Day cannot exceed maximum ${maxDays} days.`)
              } else {
                setValidationError('')
              }
            }}
            required
          />
          <DatePicker
            label="Calendar Date (Optional)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Input
          label="Day Theme / Title"
          placeholder="e.g. Arrival & Seine River Walk"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          label="Day Overview / Objectives"
          placeholder="Key highlights, meeting points, reservations..."
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--color-border-subtle)]">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading} icon={Plus}>
            Add Day
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddDayModal
