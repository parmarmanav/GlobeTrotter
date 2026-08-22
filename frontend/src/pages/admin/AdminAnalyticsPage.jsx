import React from 'react'
import { Card, CardHeader, CardTitle, Badge } from '@/components/common'
import { Users, Map, Building2, Sparkles, TrendingUp } from 'lucide-react'

export function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white font-display">System Analytics Overview</h1>
        <p className="text-xs text-slate-400">High-level activity metrics, growth trends, and usage data</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 text-slate-100 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold font-display text-white mt-2">1,248</p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Planned Trips</span>
            <Map className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-display text-white mt-2">3,892</p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Indexed Cities</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-display text-white mt-2">140</p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Curated Experiences</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-display text-white mt-2">820</p>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 p-6">
        <CardHeader className="border-slate-800 px-0 pt-0">
          <CardTitle className="text-white">Platform Health & Engagement</CardTitle>
        </CardHeader>
        <div className="py-12 text-center text-xs text-slate-500">
          Charts and real-time backend metrics will render here in Stage 4 integration.
        </div>
      </Card>
    </div>
  )
}

export default AdminAnalyticsPage
