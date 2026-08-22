import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/routes'
import { dashboardService } from '@/services/dashboardService'
import {
  Compass,
  Plus,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import { Button, Card, Badge, Skeleton, ErrorState } from '@/components/common'
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics'
import { UpcomingTripsWidget } from '@/components/dashboard/UpcomingTripsWidget'
import { PopularDestinationsWidget } from '@/components/dashboard/PopularDestinationsWidget'
import { TripsCalendarWidget } from '@/components/dashboard/TripsCalendarWidget'

export function DashboardPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await dashboardService.getDashboard()
      const data = response.data || response
      setDashboardData(data)
    } catch (err) {
      console.warn('Dashboard fetch error:', err)
      setError(err.message || 'Unable to load dashboard data.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const welcomeName = user?.firstName || user?.name || user?.username || 'Traveler'

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge variant="primary" size="sm" className="bg-teal-500/20 text-teal-200 border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-300" /> Smart Travel Command
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            {dashboardData?.welcomeMessage || `Welcome back, ${welcomeName}! ✈️`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Where to next? Craft multi-city itineraries, synchronize schedules, monitor live trip budgets, and explore curated destination guides.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to={ROUTES.CREATE_TRIP}>
              <Button variant="accent" size="md" icon={Plus}>
                Plan New Trip
              </Button>
            </Link>
            <Link to={ROUTES.EXPLORE}>
              <Button variant="secondary" size="md" icon={Compass} className="bg-white/10 hover:bg-white/20 border border-white/20">
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-5 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 lg:col-span-2 space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </div>
            </Card>
            <Card className="p-6 space-y-4">
              <Skeleton className="h-6 w-36" />
              <div className="space-y-3">
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
              </div>
            </Card>
          </div>
        </div>
      ) : error ? (
        <ErrorState
          title="Unable to load dashboard overview"
          message={error}
          onRetry={fetchDashboard}
        />
      ) : (
        <>
          {/* Key Metrics / Highlights */}
          <DashboardMetrics highlights={dashboardData?.budgetHighlights} />

          {/* Trips Duration Calendar */}
          <TripsCalendarWidget trips={dashboardData?.allTrips || dashboardData?.upcomingTrips || []} />

          {/* Widgets Grid: Upcoming Trips & Popular Destinations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <UpcomingTripsWidget upcomingTrips={dashboardData?.upcomingTrips} />
            </div>
            <div>
              <PopularDestinationsWidget destinations={dashboardData?.popularDestinations} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage
