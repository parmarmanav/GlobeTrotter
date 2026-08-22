import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { ArrowLeft, MapPin, Star, Plus, Bookmark, Compass, Sparkles } from 'lucide-react'
import { Button, Card, Badge } from '@/components/common'

export function CityDetailsPage() {
  const { cityId } = useParams()

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <Link
        to={ROUTES.EXPLORE}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Destinations
      </Link>

      <div className="relative rounded-3xl bg-slate-900 text-white p-6 sm:p-10 overflow-hidden shadow-lg">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <Badge variant="primary" size="sm" className="bg-teal-500/20 text-teal-300 border-teal-400/30">
            Destination Guide
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white capitalize">
            {cityId?.replace('-', ' ')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Discover iconic landmarks, top-rated culinary spots, and curated travel activities in this city.
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            <Button variant="accent" size="sm" icon={Plus}>
              Add to Itinerary
            </Button>
            <Button variant="secondary" size="sm" icon={Bookmark} className="bg-white/10 hover:bg-white/20 border border-white/20">
              Save Destination
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 font-display mb-4">Top Curated Activities</h3>
        <p className="text-xs text-slate-500">Connecting to real-time activity database in subsequent stages.</p>
      </Card>
    </div>
  )
}

export default CityDetailsPage
