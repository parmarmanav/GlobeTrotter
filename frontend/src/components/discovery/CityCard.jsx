import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '@/services/userService'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { getCuratedItineraryForCity } from '@/data/curatedItineraries'
import { MapPin, Bookmark, Star, ArrowRight, Plus, Calendar, Sparkles } from 'lucide-react'
import { Card, Badge, Button } from '@/components/common'

const DEFAULT_CITY_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'

export function CityCard({ city, onAddToTrip, initialIsSaved = false }) {
  const { isAuthenticated } = useAuth()
  const { addToast } = useApp()
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isSaving, setIsSaving] = useState(false)

  React.useEffect(() => {
    setIsSaved(initialIsSaved)
  }, [initialIsSaved])

  if (!city) return null

  const cityId = city._id || city.id
  const name = city.name || 'City'
  const country = city.country || 'Destination'
  const costIndex = city.costIndex || '$$'
  const popularity = city.popularityScore || 90

  const curatedPlan = getCuratedItineraryForCity(city)
  const totalDays = curatedPlan?.durationDays || 3

  const handleSaveToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      addToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in to save destinations to your wishlist.',
      })
      return
    }

    setIsSaving(true)
    try {
      if (isSaved) {
        await userService.removeSavedDestination(cityId)
        setIsSaved(false)
        addToast({
          type: 'info',
          title: 'Removed from Saved',
          message: `${name} removed from your saved list.`,
        })
      } else {
        await userService.addSavedDestination(cityId)
        setIsSaved(true)
        addToast({
          type: 'success',
          title: 'Destination Saved! 🌟',
          message: `${name} added to your travel wishlist.`,
        })
      }
    } catch (err) {
      console.error('Save error:', err)
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err.message || 'Could not update saved destinations.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-0 overflow-hidden flex flex-col justify-between group hoverable border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200">
      {/* Cover Image & Badges */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={city.image || DEFAULT_CITY_IMAGE}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = DEFAULT_CITY_IMAGE }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-black/30" />

        {/* Cost Index Badge & Popularity */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20">
            {costIndex}
          </span>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-teal-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow-xs">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> {popularity}
          </span>
        </div>

        {/* Bookmark Action */}
        <button
          type="button"
          onClick={handleSaveToggle}
          disabled={isSaving}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isSaved
              ? 'bg-rose-600 text-white scale-105'
              : 'bg-black/40 hover:bg-black/60 text-white'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* City & Country on Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-base font-bold text-white font-display drop-shadow-sm">
            {name}
          </h3>
          <p className="text-xs text-slate-200 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-teal-400" /> {country}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Curated Itinerary Badge & Highlights */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              <Sparkles className="w-3 h-3 text-teal-600" /> {totalDays}-Day Curated Plan
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Est. {formatCurrency(curatedPlan?.estimatedBudgetINR || 45000, 'INR')}
            </span>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {curatedPlan?.tagline || city.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <Link
            to={`/cities/${cityId}`}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            View Itinerary <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Button
            size="sm"
            variant="outline"
            icon={Plus}
            onClick={() => onAddToTrip?.(city)}
          >
            Add to Trip
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default CityCard
