import React from 'react'
import { Map, Calendar, DollarSign, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { formatCurrency } from '@/utils/formatCurrency'

export function DashboardMetrics({ highlights }) {
  const totalTrips = highlights?.totalTrips || 0
  const activeTrips = highlights?.activeTripsCount || 0
  const completedTrips = highlights?.completedTripsCount || 0
  const totalBudget = highlights?.totalBudgetPlanned || 0
  const totalExpenses = highlights?.totalExpensesLogged || 0
  const currency = highlights?.currency || 'USD'

  const metrics = [
    {
      label: 'Active Trips',
      value: activeTrips,
      sublabel: `${totalTrips} Total Trips`,
      icon: Map,
      color: 'bg-teal-50 text-teal-600',
    },
    {
      label: 'Completed Trips',
      value: completedTrips,
      sublabel: 'Adventures finished',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Planned Budget',
      value: formatCurrency(totalBudget, currency),
      sublabel: 'Allocated across trips',
      icon: DollarSign,
      color: 'bg-sky-50 text-sky-600',
    },
    {
      label: 'Logged Expenses',
      value: formatCurrency(totalExpenses, currency),
      sublabel: totalBudget > 0 ? `${Math.round((totalExpenses / totalBudget) * 100)}% of total budget` : 'No budget set',
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((m, idx) => {
        const Icon = m.icon
        return (
          <Card key={idx} className="p-5 border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {m.label}
              </span>
              <div className={`p-2 rounded-xl ${m.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 font-display">
                {m.value}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">{m.sublabel}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default DashboardMetrics
