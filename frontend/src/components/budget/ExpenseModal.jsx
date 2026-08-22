import React, { useState, useEffect } from 'react'
import { Modal, Input, Select, DatePicker, Textarea, Button } from '@/components/common'
import { IndianRupee, Plus, Save } from 'lucide-react'

const EXPENSE_CATEGORY_OPTIONS = [
  { value: 'ACCOMMODATION', label: 'Accommodation / Hotels' },
  { value: 'TRANSPORT', label: 'Transport / Flights / Transit' },
  { value: 'FOOD', label: 'Food & Dining' },
  { value: 'ACTIVITIES', label: 'Activities & Attractions' },
  { value: 'SHOPPING', label: 'Shopping & Souvenirs' },
  { value: 'OTHER', label: 'Other Miscellaneous' },
]

export function ExpenseModal({
  isOpen,
  onClose,
  onSaveExpense,
  initialData = null,
  currency = 'INR',
  isLoading = false,
}) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('ACCOMMODATION')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setAmount(initialData.amount !== undefined ? String(initialData.amount) : '')
      setCategory(initialData.category || 'ACCOMMODATION')
      setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '')
      setNotes(initialData.notes || '')
    } else {
      setTitle('')
      setAmount('')
      setCategory('ACCOMMODATION')
      setDate(new Date().toISOString().split('T')[0])
      setNotes('')
    }
  }, [initialData, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setErrorMessage('Please enter an expense title.')
      return
    }
    if (!amount || Number(amount) <= 0) {
      setErrorMessage('Please enter a valid expense amount greater than 0.')
      return
    }

    const payload = {
      title: title.trim(),
      amount: Number(amount),
      category: category.toUpperCase(),
      currency,
      date: date || new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
    }

    onSaveExpense(payload)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expense' : 'Log New Expense'}
      description="Record trip expenditure to keep track of your actual budget"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <Input
          label="Expense Title *"
          placeholder="e.g. Flight to Tokyo, Airbnb Booking..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errorMessage) setErrorMessage('')
          }}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={`Amount (${currency}) *`}
            type="number"
            min="0"
            step="any"
            icon={IndianRupee}
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              if (errorMessage) setErrorMessage('')
            }}
            required
          />

          <Select
            label="Category"
            options={EXPENSE_CATEGORY_OPTIONS}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <DatePicker
          label="Date of Expense"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Textarea
          label="Notes (Optional)"
          placeholder="Receipt notes, vendor name, conversion details..."
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--color-border-subtle)]">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading} icon={initialData ? Save : Plus}>
            {initialData ? 'Update Expense' : 'Log Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ExpenseModal
