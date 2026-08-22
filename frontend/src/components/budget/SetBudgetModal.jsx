import React, { useState, useEffect } from 'react'
import { Modal, Input, Select, Button } from '@/components/common'
import { DollarSign, Save } from 'lucide-react'

export function SetBudgetModal({
  isOpen,
  onClose,
  initialBudget = 0,
  initialCurrency = 'USD',
  onSave,
  isLoading = false,
}) {
  const [totalBudget, setTotalBudget] = useState(initialBudget)
  const [currency, setCurrency] = useState(initialCurrency)

  useEffect(() => {
    setTotalBudget(initialBudget)
    setCurrency(initialCurrency)
  }, [initialBudget, initialCurrency, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      totalBudget: Number(totalBudget) || 0,
      currency: currency || 'USD',
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Trip Budget"
      description="Define the total spending limit and currency for this journey"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Total Budget Limit"
          type="number"
          min="0"
          step="any"
          icon={DollarSign}
          value={totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
          required
        />

        <Select
          label="Currency"
          options={[
            { value: 'USD', label: 'USD ($) — US Dollar' },
            { value: 'EUR', label: 'EUR (€) — Euro' },
            { value: 'GBP', label: 'GBP (£) — British Pound' },
            { value: 'JPY', label: 'JPY (¥) — Japanese Yen' },
            { value: 'INR', label: 'INR (₹) — Indian Rupee' },
            { value: 'AUD', label: 'AUD ($) — Australian Dollar' },
            { value: 'CAD', label: 'CAD ($) — Canadian Dollar' },
          ]}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading} icon={Save}>
            Save Budget
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SetBudgetModal
