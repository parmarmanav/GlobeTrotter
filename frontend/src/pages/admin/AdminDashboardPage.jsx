import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '@/services/adminService'
import { ROUTES } from '@/constants/routes'
import {
  Users,
  Map,
  Compass,
  TrendingUp,
  ShieldCheck,
  Activity,
  ArrowRight,
  Sparkles,
  DollarSign,
  Globe,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Skeleton,
  ErrorState,
} from '@/components/common'

export function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOverview = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await adminService.getAnalyticsOverview()
      const data = response.data || response
      setAnalytics(data)
    } catch (err) {
      console.warn('Failed to load admin analytics overview:', err)
      setError(err.message || 'Unable to retrieve administrator metrics.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOverview()
  }, [fetchOverview])

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Admin Access Error"
        message={error}
        onRetry={fetchOverview}
      />
    )
  }

  const stats = [
    {
      label: 'Registered Users',
      value: analytics?.totalUsers || 0,
      sublabel: `${analytics?.activeUsers || 0} active travelers`,
      icon: Users,
      color: 'bg-indigo-500/10 text-indigo-400',
      link: ROUTES.ADMIN.USERS,
    },
    {
      label: 'Planned Trips',
      value: analytics?.totalTrips || 0,
      sublabel: `${analytics?.completedTrips || 0} completed`,
      icon: Map,
      color: 'bg-sky-50 text-sky-600',
      link: ROUTES.ADMIN.TRIPS,
    },
    {
      label: 'Destination Cities',
      value: analytics?.totalCities || 0,
      sublabel: 'Curated global spots',
      icon: Globe,
      color: 'bg-emerald-50 text-emerald-600',
      link: ROUTES.ADMIN.CITIES,
    },
    {
      label: 'Catalog Activities',
      value: analytics?.totalActivities || 0,
      sublabel: 'Tours and sights',
      icon: Compass,
      color: 'bg-amber-50 text-amber-600',
      link: ROUTES.ADMIN.ACTIVITIES,
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Admin Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Platform Administration
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
            System Analytics & Management
          </h1>
          <p className="text-xs text-slate-400">
            Platform health, traveler trends, content moderation, and global destination metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={ROUTES.ADMIN.ANALYTICS}>
            <Button variant="primary" size="sm" icon={TrendingUp}>
              Full Analytics Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <Link key={i} to={s.link} className="block group">
              <Card className="p-5 border-[var(--color-border-subtle)]/90 group-hover:border-teal-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {s.label}
                  </span>
                  <div className={`p-2 rounded-xl ${s.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-white font-display">
                    {s.value}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{s.sublabel}</p>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display">User Accounts</h3>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xs text-slate-400">
            View all travelers, update user status (Active/Suspended), and promote administrators.
          </p>
          <Link to={ROUTES.ADMIN.USERS} className="block pt-2">
            <Button variant="outline" size="sm" className="w-full" iconRight={ArrowRight}>
              Manage Users
            </Button>
          </Link>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display">Platform Trips</h3>
            <Map className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-xs text-slate-400">
            Audit planned itineraries, inspect public shared journeys, and manage trip records.
          </p>
          <Link to={ROUTES.ADMIN.TRIPS} className="block pt-2">
            <Button variant="outline" size="sm" className="w-full" iconRight={ArrowRight}>
              Manage Trips
            </Button>
          </Link>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display">Cities & Activities</h3>
            <Compass className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs text-slate-400">
            Inspect curated destination guides, popular attraction scores, and activity catalogs.
          </p>
          <Link to={ROUTES.ADMIN.CITIES} className="block pt-2">
            <Button variant="outline" size="sm" className="w-full" iconRight={ArrowRight}>
              Manage Catalog
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboardPage
