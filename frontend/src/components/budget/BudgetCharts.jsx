import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/common'
import { formatCurrency } from '@/utils/formatCurrency'

const COLORS = [
  '#0d9488', // teal
  '#0284c7', // sky
  '#f59e0b', // amber
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#64748b', // slate
]

export function BudgetCharts({ expenses = [], currency = 'USD', totalBudget = 0 }) {
  // Aggregate expenses by category
  const categoryMap = {}
  expenses.forEach((exp) => {
    const cat = exp.category || 'OTHER'
    categoryMap[cat] = (categoryMap[cat] || 0) + (Number(exp.amount) || 0)
  })

  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }))

  // Aggregate expenses by date (for Bar chart)
  const dateMap = {}
  expenses.forEach((exp) => {
    const dateStr = exp.date ? new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'General'
    dateMap[dateStr] = (dateMap[dateStr] || 0) + (Number(exp.amount) || 0)
  })

  const barData = Object.entries(dateMap)
    .slice(-7)
    .map(([date, amount]) => ({
      date,
      amount: Math.round(amount * 100) / 100,
    }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg text-xs space-y-0.5">
          <p className="font-bold">{payload[0].name || payload[0].payload.date}</p>
          <p className="text-teal-300 font-semibold">{formatCurrency(payload[0].value, currency)}</p>
        </div>
      )
    }
    return null
  }

  if (expenses.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Donut Breakdown */}
      <Card className="p-6">
        <CardHeader className="border-none px-0 pt-0 mb-2">
          <CardTitle>Spending by Category</CardTitle>
          <p className="text-xs text-slate-400">Distribution across travel expense types</p>
        </CardHeader>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {pieData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium capitalize">{entry.name.toLowerCase()}:</span>
              <span className="font-bold text-white">{formatCurrency(entry.value, currency)}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Daily / Timeline Expense Bar Chart */}
      <Card className="p-6">
        <CardHeader className="border-none px-0 pt-0 mb-2">
          <CardTitle>Expense Timeline</CardTitle>
          <p className="text-xs text-slate-400">Expenditure flow by logging date</p>
        </CardHeader>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#0d9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export default BudgetCharts
