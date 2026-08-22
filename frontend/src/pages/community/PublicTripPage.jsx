import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Copy, Share2, Compass, Calendar, MapPin, Sparkles } from 'lucide-react'
import { Button, Card, Badge } from '@/components/common'

export function PublicTripPage() {
  const { slug } = useParams()

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-4">
          <Badge variant="primary" size="sm" className="bg-teal-500/20 text-teal-300 border-teal-400/30">
            Public Itinerary
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            {slug?.replace('-', ' ')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            A shared travel plan crafted by a fellow traveler. You can copy this itinerary into your own account and customize it freely.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Button variant="accent" size="md" icon={Copy}>
              Copy Trip to My Account
            </Button>
            <Button variant="secondary" size="md" icon={Share2} className="bg-white/10 hover:bg-white/20 border border-white/20">
              Share Itinerary Link
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 font-display mb-2">Public Schedule Preview</h3>
        <p className="text-xs text-slate-500">
          Read-only day-wise itinerary will load from the backend API.
        </p>
      </Card>
    </div>
  )
}

export default PublicTripPage
