import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Plus, Search, Filter, Map, Calendar, DollarSign, ArrowRight } from 'lucide-react'
import { Button, Input, Card, Badge, EmptyState, Tabs } from '@/components/common'

export function TripsListPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'all', label: 'All Trips', count: 0 },
    { id: 'upcoming', label: 'Upcoming', count: 0 },
    { id: 'ongoing', label: 'Ongoing', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">My Trips</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your planned adventures, itineraries, and stops</p>
        </div>
        <Link to={ROUTES.CREATE_TRIP}>
          <Button variant="primary" size="md" icon={Plus}>
            Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-2">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search trips..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Empty State Showcase */}
      <EmptyState
        icon={Map}
        title="No trips created yet"
        description="You haven't planned any trips yet. Start by defining your destination cities and dates."
        actionLabel="Plan First Trip"
        onAction={() => window.location.assign(ROUTES.CREATE_TRIP)}
      />
    </div>
  )
}

export default TripsListPage
