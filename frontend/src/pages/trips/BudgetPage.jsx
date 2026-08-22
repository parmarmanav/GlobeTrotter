import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tripService } from '@/services/tripService'
import { budgetService } from '@/services/budgetService'
import { useApp } from '@/context/AppContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import {
  DollarSign,
  Plus,
  ArrowLeft,
  PieChart as PieIcon,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Edit2,
  Trash2,
  Search,
  Settings2,
} from 'lucide-react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Tabs,
  Skeleton,
  ErrorState,
  EmptyState,
  ConfirmDialog,
} from '@/components/common'
import { BudgetCharts } from '@/components/budget/BudgetCharts'
import { SetBudgetModal } from '@/components/budget/SetBudgetModal'
import { ExpenseModal } from '@/components/budget/ExpenseModal'

const CATEGORY_STYLES = {
  ACCOMMODATION: 'bg-purple-50 text-purple-700 border-purple-200',
  STAY: 'bg-purple-50 text-purple-700 border-purple-200',
  TRANSPORT: 'bg-sky-50 text-sky-700 border-sky-200',
  FOOD: 'bg-amber-50 text-amber-700 border-amber-200',
  MEAL: 'bg-amber-50 text-amber-700 border-amber-200',
  ACTIVITIES: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ACTIVITY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SHOPPING: 'bg-pink-50 text-pink-700 border-pink-200',
  OTHER: 'bg-slate-800 text-slate-300 border-[var(--color-border-subtle)]',
}

export function BudgetPage() {
  const { tripId } = useParams()
  const { addToast } = useApp()

  const [trip, setTrip] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const [isSetBudgetOpen, setIsSetBudgetOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [expenseToEdit, setExpenseToEdit] = useState(null)
  const [expenseToDelete, setExpenseToDelete] = useState(null)
  const [isMutating, setIsMutating] = useState(false)

  const fetchBudgetData = useCallback(async () => {
    if (!tripId) return
    setIsLoading(true)
    setError(null)
    try {
      const [tripRes, expensesRes] = await Promise.all([
        tripService.getTripById(tripId),
        budgetService.getExpenses(tripId).catch(() => ({ data: [] })),
      ])

      const tripData = tripRes.data || tripRes
      setTrip(tripData)

      const expData = expensesRes.data || tripData.expenses || []
      setExpenses(Array.isArray(expData) ? expData : [])
    } catch (err) {
      console.warn('Failed to load budget data:', err)
      setError(err.message || 'Unable to retrieve budget and expenses.')
    } finally {
      setIsLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    fetchBudgetData()
  }, [fetchBudgetData])

  const totalBudget = trip?.budget?.totalBudget || 0
  const currency = trip?.budget?.currency || 'USD'

  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  const remainingBudget = totalBudget - totalSpent
  const isOverBudget = totalBudget > 0 && remainingBudget < 0

  // Calculate duration in days
  const startDate = trip?.startDate ? new Date(trip.startDate) : null
  const endDate = trip?.endDate ? new Date(trip.endDate) : null
  const durationDays = startDate && endDate ? Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1) : 1
  const avgPerDay = totalSpent > 0 ? totalSpent / durationDays : 0

  // ----------------------------------------------------
  // BUDGET & EXPENSE ACTIONS
  // ----------------------------------------------------

  const handleSaveBudget = async (budgetData) => {
    setIsMutating(true)
    try {
      await budgetService.updateBudget(tripId, budgetData)
      setTrip((prev) => ({
        ...prev,
        budget: {
          ...prev?.budget,
          totalBudget: budgetData.totalBudget,
          currency: budgetData.currency,
        },
      }))
      addToast({
        type: 'success',
        title: 'Budget Updated',
        message: `Budget limit set to ${formatCurrency(budgetData.totalBudget, budgetData.currency)}.`,
      })
      setIsSetBudgetOpen(false)
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update budget.',
      })
    } finally {
      setIsMutating(false)
    }
  }

  const handleSaveExpense = async (expensePayload) => {
    setIsMutating(true)
    try {
      if (expenseToEdit) {
        const expenseId = expenseToEdit._id || expenseToEdit.id
        const res = await budgetService.updateExpense(tripId, expenseId, expensePayload)
        const updated = res.data || res
        setExpenses((prev) => prev.map((e) => ((e._id || e.id) === expenseId ? updated : e)))
        addToast({
          type: 'success',
          title: 'Expense Updated',
          message: 'Your expense entry has been updated.',
        })
      } else {
        const res = await budgetService.addExpense(tripId, expensePayload)
        const added = res.data || res
        setExpenses((prev) => [added, ...prev])
        addToast({
          type: 'success',
          title: 'Expense Logged',
          message: `Logged ${formatCurrency(expensePayload.amount, currency)} for ${expensePayload.title}.`,
        })
      }
      setIsExpenseModalOpen(false)
      setExpenseToEdit(null)
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not record expense.',
      })
    } finally {
      setIsMutating(false)
    }
  }

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return
    setIsMutating(true)
    const expenseId = expenseToDelete._id || expenseToDelete.id
    try {
      await budgetService.deleteExpense(tripId, expenseId)
      setExpenses((prev) => prev.filter((e) => (e._id || e.id) !== expenseId))
      addToast({
        type: 'success',
        title: 'Expense Deleted',
        message: 'Expense entry removed.',
      })
      setExpenseToDelete(null)
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete expense.',
      })
    } finally {
      setIsMutating(false)
    }
  }

  // Filter expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesCategory = activeCategory === 'ALL' || (e.category || 'OTHER').toUpperCase() === activeCategory
    const matchesSearch = !searchQuery || (e.title && e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const categoryTabs = [
    { id: 'ALL', label: 'All Expenses' },
    { id: 'ACCOMMODATION', label: 'Stay' },
    { id: 'TRANSPORT', label: 'Transport' },
    { id: 'FOOD', label: 'Meals' },
    { id: 'ACTIVITIES', label: 'Activities' },
    { id: 'SHOPPING', label: 'Shopping' },
    { id: 'OTHER', label: 'Other' },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-20 rounded-2xl w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <ErrorState
        title="Could not load trip budget"
        message={error || 'Trip not found.'}
        onRetry={fetchBudgetData}
      />
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to={`/trips/${tripId}`}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-200 text-slate-300 transition-colors"
            title="Back to Trip Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white font-display">
              {trip.name} — Budget & Expenses
            </h1>
            <p className="text-xs text-slate-400">
              Track expenditures, category distributions, and daily averages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Settings2}
            onClick={() => setIsSetBudgetOpen(true)}
          >
            Edit Budget Limit
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setExpenseToEdit(null)
              setIsExpenseModalOpen(true)
            }}
          >
            Log Expense
          </Button>
        </div>
      </div>

      {/* Over-Budget Alert Banner */}
      {isOverBudget && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold">Over-Budget Warning</h4>
            <p className="mt-0.5 text-rose-700">
              Your logged expenditures ({formatCurrency(totalSpent, currency)}) exceed your allocated trip budget ({formatCurrency(totalBudget, currency)}) by{' '}
              <span className="font-extrabold">{formatCurrency(Math.abs(remainingBudget), currency)}</span>.
            </p>
          </div>
        </div>
      )}

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Budget
          </span>
          <p className="text-2xl font-bold text-white font-display mt-2">
            {totalBudget > 0 ? formatCurrency(totalBudget, currency) : 'Unset'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Target spending cap</p>
        </Card>

        <Card className="p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Logged
          </span>
          <p className="text-2xl font-bold text-indigo-400 font-display mt-2">
            {formatCurrency(totalSpent, currency)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}% of limit` : `${expenses.length} entries`}
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Remaining Funds
          </span>
          <p
            className={`text-2xl font-bold font-display mt-2 ${
              isOverBudget ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {formatCurrency(remainingBudget, currency)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isOverBudget ? 'Over budget limit' : 'Available balance'}
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Average / Day
          </span>
          <p className="text-2xl font-bold text-white font-display mt-2">
            {formatCurrency(avgPerDay, currency)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across {durationDays} total days</p>
        </Card>
      </div>

      {/* Visual Analytics */}
      <BudgetCharts expenses={expenses} currency={currency} totalBudget={totalBudget} />

      {/* Expense Logs Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-white font-display">
            Logged Expenditures ({expenses.length})
          </h2>
          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={() => {
              setExpenseToEdit(null)
              setIsExpenseModalOpen(true)
            }}
          >
            Log New Expense
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="space-y-3">
          <Tabs tabs={categoryTabs} activeTab={activeCategory} onChange={setActiveCategory} />

          <div className="p-3 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xs">
            <Input
              placeholder="Search expenses by title..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Expenses List */}
        {filteredExpenses.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No expenses logged in this view"
            description="Record meals, museum passes, hotels or train tickets to track your spending."
            actionLabel="Log First Expense"
            onAction={() => {
              setExpenseToEdit(null)
              setIsExpenseModalOpen(true)
            }}
          />
        ) : (
          <div className="space-y-2.5">
            {filteredExpenses.map((exp) => {
              const expId = exp._id || exp.id
              const cat = (exp.category || 'OTHER').toUpperCase()
              const catColor = CATEGORY_STYLES[cat] || CATEGORY_STYLES.OTHER
              const dateStr = exp.date ? formatDate(exp.date) : 'General'

              return (
                <div
                  key={expId}
                  className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] hover:border-teal-300 shadow-2xs transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase ${catColor}`}>
                      {cat}
                    </span>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{exp.title}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" /> {dateStr}
                        {exp.notes && <span className="italic ml-2">• {exp.notes}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-black text-white">
                      {formatCurrency(exp.amount, exp.currency || currency)}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setExpenseToEdit(exp)
                          setIsExpenseModalOpen(true)
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                        title="Edit expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpenseToDelete(exp)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Set Budget Modal */}
      <SetBudgetModal
        isOpen={isSetBudgetOpen}
        onClose={() => setIsSetBudgetOpen(false)}
        initialBudget={totalBudget}
        initialCurrency={currency}
        onSave={handleSaveBudget}
        isLoading={isMutating}
      />

      {/* Log / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false)
          setExpenseToEdit(null)
        }}
        onSaveExpense={handleSaveExpense}
        initialData={expenseToEdit}
        currency={currency}
        isLoading={isMutating}
      />

      {/* Delete Expense Dialog */}
      <ConfirmDialog
        isOpen={Boolean(expenseToDelete)}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteExpense}
        title={`Delete expense "${expenseToDelete?.title}"?`}
        message="This expense entry will be permanently removed from your budget calculations."
        confirmText="Delete Expense"
        confirmVariant="danger"
        isLoading={isMutating}
      />
    </div>
  )
}

export default BudgetPage
