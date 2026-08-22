import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { ArrowLeft, Clock, DollarSign, Star, Plus, MapPin, Sparkles } from 'lucide-react'
import { Button, Card, Badge } from '@/components/common'

export function ActivityDetailsPage() {
  const { activityId } = useParams()

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <Link
        to={ROUTES.ACTIVITIES}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Activities
      </Link>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-2">Experience Details</Badge>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 capitalize">
              {activityId?.replace('-', ' ')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Detailed pricing, duration, and scheduling guidance</p>
          </div>

          <Button variant="primary" size="md" icon={Plus}>
            Add to Itinerary Day
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default ActivityDetailsPage
