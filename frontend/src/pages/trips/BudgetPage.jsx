import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, DollarSign, PieChart, TrendingUp, AlertTriangle } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, Badge } from '@/components/common'

export function BudgetPage() {
  const { tripId } = useParams()

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to={`/trips/${tripId}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Trip Details
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Trip Budget & Expenses</h1>
          <p className="text-xs text-slate-500">Track allocations, breakdown categories, and log receipts</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={Plus}>
            Log Expense
          </Button>
        </div>
      </div>

      {/* Budget Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Budget</span>
          <p className="text-xl font-bold text-slate-900 font-display mt-1">$0.00</p>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Estimated Spent</span>
          <p className="text-xl font-bold text-slate-900 font-display mt-1">$0.00</p>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Remaining</span>
          <p className="text-xl font-bold text-emerald-600 font-display mt-1">$0.00</p>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Daily Average</span>
          <p className="text-xl font-bold text-slate-900 font-display mt-1">$0.00</p>
        </Card>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <CardHeader className="border-none px-0 pt-0">
            <CardTitle>Logged Expenses</CardTitle>
          </CardHeader>
          <div className="py-10 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
            No expenses recorded yet. Click "Log Expense" to add flights, hotels, meals, and tickets.
          </div>
        </Card>

        <Card className="p-5">
          <CardHeader className="border-none px-0 pt-0">
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <div className="py-10 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
            Category charts will appear once expenses are added.
          </div>
        </Card>
      </div>
    </div>
  )
}

export default BudgetPage
