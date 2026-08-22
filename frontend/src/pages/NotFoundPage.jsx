import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Compass, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/common'

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold font-display text-slate-900">404</h1>
      <h2 className="text-lg font-bold text-slate-800">Destination Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm">
        It looks like you've wandered off the itinerary map. Let's get you back on track.
      </p>
      <Link to={ROUTES.DASHBOARD}>
        <Button variant="primary" size="sm" icon={ArrowLeft}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
