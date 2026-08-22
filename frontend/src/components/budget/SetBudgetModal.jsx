import React, { useState, useEffect } from 'react'
import { Modal, Input, Button } from '@/components/common'
import { IndianRupee, Save } from 'lucide-react'

export function SetBudgetModal({
  isOpen,
  onClose,
  initialBudget = 0,
  onSave,
  isLoading = false,
}) {
  const [totalBudget, setTotalBudget] = useState(initialBudget)

  useEffect(() => {
    setTotalBudget(initialBudget)
  }, [initialBudget, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      totalBudget: Number(totalBudget) || 0,
      currency: 'INR',
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Trip Budget"
      description="Define the total spending limit in INR (₹) for this journey"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Total Budget Limit (₹ INR)"
          type="number"
          min="0"
          step="any"
          icon={IndianRupee}
          placeholder="e.g. 50000"
          value={totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
          required
        />

        <div className="p-3 rounded-xl bg-slate-800/50 border border-[var(--color-border-subtle)] text-xs text-slate-400 flex items-center justify-between">
          <span className="font-semibold">Standard Platform Currency:</span>
          <span className="font-bold text-indigo-400">INR (₹)</span>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--color-border-subtle)]">
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
