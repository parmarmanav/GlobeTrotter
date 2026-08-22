import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Bookmark, Compass } from 'lucide-react'
import { EmptyState } from '@/components/common'

export function SavedDestinationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Saved Destinations</h1>
        <p className="text-xs text-slate-500 mt-1">Your personal bucket list of wishlist cities and attractions</p>
      </div>

      <EmptyState
        icon={Bookmark}
        title="No saved destinations yet"
        description="Bookmark interesting cities and attractions while exploring to plan your future adventures."
        actionLabel="Explore Destinations"
        onAction={() => window.location.assign(ROUTES.EXPLORE)}
      />
    </div>
  )
}

export default SavedDestinationsPage
