import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/routes'
import {
  Compass,
  MapPin,
  Calendar,
  Plus,
  DollarSign,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Map,
} from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/common'

export function DashboardPage() {
  const { user } = useAuth()

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
            Welcome back, {user?.name || user?.username || 'Traveler'}! ✈️
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

      {/* Quick Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Trips</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Map className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-display">0</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Ready to plan</p>
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saved Cities</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-display">0</span>
            <p className="text-[11px] text-slate-400 mt-0.5">In your wishlist</p>
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Stops</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-display">0</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Scheduled stops</p>
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Budget</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-display">$0</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Total across trips</p>
          </div>
        </Card>
      </div>

      {/* Grid: Upcoming Trips & Popular Destinations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Trips Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <CardHeader className="border-none px-0 pt-0">
              <div>
                <CardTitle>Upcoming & Planned Trips</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Manage and organize your multi-destination journeys</p>
              </div>
              <Link to={ROUTES.TRIPS} className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <div className="py-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
              <Compass className="w-10 h-10 text-teal-500/60 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800">No journeys planned yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Start crafting your next great adventure by adding destinations, dates, and experiences.
              </p>
              <Link to={ROUTES.CREATE_TRIP}>
                <Button size="sm" variant="primary" icon={Plus}>
                  Create First Trip
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Destination Highlights */}
        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader className="border-none px-0 pt-0">
              <div>
                <CardTitle>Trending Destinations</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Popular spots curated by travelers</p>
              </div>
              <Link to={ROUTES.EXPLORE} className="text-xs font-bold text-teal-600 hover:text-teal-700">
                Explore
              </Link>
            </CardHeader>

            <div className="space-y-3">
              {[
                { city: 'Kyoto', country: 'Japan', cost: '$$', tag: 'Cultural Haven' },
                { city: 'Amalfi Coast', country: 'Italy', cost: '$$$', tag: 'Scenic Coastal' },
                { city: 'Reykjavik', country: 'Iceland', cost: '$$$', tag: 'Northern Wonders' },
              ].map((dest, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-100 transition-colors"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{dest.city}, {dest.country}</h5>
                    <span className="text-[10px] text-slate-500">{dest.tag}</span>
                  </div>
                  <Badge variant="primary" size="sm">{dest.cost}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
