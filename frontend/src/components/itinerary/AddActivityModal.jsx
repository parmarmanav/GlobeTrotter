import React, { useState, useEffect } from 'react'
import { Modal, Input, Select, Textarea, Button } from '@/components/common'
import { Plus, Clock, DollarSign, Tag, Sparkles } from 'lucide-react'

const ACTIVITY_CATEGORY_OPTIONS = [
  { value: 'SIGHTSEEING', label: 'Sightseeing & Landmarks' },
  { value: 'FOOD', label: 'Food & Culinary Tour' },
  { value: 'ADVENTURE', label: 'Adventure & Outdoor' },
  { value: 'CULTURE', label: 'Culture & Museum' },
  { value: 'NATURE', label: 'Nature & Parks' },
  { value: 'ENTERTAINMENT', label: 'Entertainment & Nightlife' },
  { value: 'SHOPPING', label: 'Shopping & Markets' },
  { value: 'OTHER', label: 'Other Activity' },
]

export function AddActivityModal({
  isOpen,
  onClose,
  onAddActivity,
  dayTitle,
  dayNumber,
  initialData = null,
  isLoading = false,
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('SIGHTSEEING')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [estimatedCost, setEstimatedCost] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setCategory(initialData.category || 'SIGHTSEEING')
      setStartTime(initialData.startTime || '')
      setEndTime(initialData.endTime || '')
      setEstimatedCost(initialData.estimatedCost !== undefined ? String(initialData.estimatedCost) : '')
      setDescription(initialData.description || '')
      setNotes(initialData.notes || '')
    } else {
      setTitle('')
      setCategory('SIGHTSEEING')
      setStartTime('')
      setEndTime('')
      setEstimatedCost('')
      setDescription('')
      setNotes('')
    }
  }, [initialData, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setErrorMessage('Please enter an activity title.')
      return
    }

    const payload = {
      title: title.trim(),
      category: category.toUpperCase(),
      startTime: startTime.trim() || undefined,
      endTime: endTime.trim() || undefined,
      estimatedCost: estimatedCost ? Number(estimatedCost) : 0,
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
    }

    onAddActivity(payload)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Activity' : `Add Activity to Day ${dayNumber}`}
      description={dayTitle ? `Day focus: ${dayTitle}` : 'Schedule an experience, meal, tour, or attraction visit'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <Input
          label="Activity Title *"
          placeholder="e.g. Louvre Museum & Mona Lisa Viewing"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errorMessage) setErrorMessage('')
          }}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            options={ACTIVITY_CATEGORY_OPTIONS}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Input
            label="Estimated Cost ($)"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 25"
            icon={DollarSign}
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Time"
            type="time"
            icon={Clock}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            label="End Time"
            type="time"
            icon={Clock}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <Textarea
          label="Description / Location"
          placeholder="Meeting point address, booking reference, or description..."
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading} icon={Plus}>
            {initialData ? 'Save Activity' : 'Add Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddActivityModal
