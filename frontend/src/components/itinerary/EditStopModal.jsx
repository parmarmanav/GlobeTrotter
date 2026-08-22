import React, { useState, useEffect } from 'react'
import { Modal, Input, DatePicker, Textarea, Button } from '@/components/common'
import { Save } from 'lucide-react'

export function EditStopModal({ isOpen, onClose, stop, onUpdateStop, isLoading = false }) {
  const [cityName, setCityName] = useState('')
  const [country, setCountry] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (stop) {
      setCityName(stop.cityName || stop.cityId?.name || '')
      setCountry(stop.country || stop.cityId?.country || '')
      setStartDate(stop.startDate ? new Date(stop.startDate).toISOString().split('T')[0] : '')
      setEndDate(stop.endDate ? new Date(stop.endDate).toISOString().split('T')[0] : '')
      setNotes(stop.notes || '')
    }
  }, [stop])

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdateStop({
      cityName,
      country,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Stop: ${cityName || 'City'}`}
      description="Update stop dates, location info, and notes"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City Name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            required
          />
          <Input
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            label="Arrival Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DatePicker
            label="Departure Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <Textarea
          label="Notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading} icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EditStopModal
