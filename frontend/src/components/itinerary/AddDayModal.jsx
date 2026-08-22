import React, { useState } from 'react'
import { Modal, Input, DatePicker, Textarea, Button } from '@/components/common'
import { Plus } from 'lucide-react'

export function AddDayModal({
  isOpen,
  onClose,
  onAddDay,
  nextDayNumber = 1,
  isLoading = false,
}) {
  const [dayNumber, setDayNumber] = useState(nextDayNumber)
  const [date, setDate] = useState('')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')

  React.useEffect(() => {
    setDayNumber(nextDayNumber)
  }, [nextDayNumber])

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddDay({
      dayNumber: Number(dayNumber) || nextDayNumber,
      date: date || undefined,
      title: title.trim() || `Day ${dayNumber}`,
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
      description="Create a new scheduled day block in your trip itinerary"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Day Number"
            type="number"
            min="1"
            value={dayNumber}
            onChange={(e) => setDayNumber(e.target.value)}
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

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
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
