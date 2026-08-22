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
    <Card className="p-0 overflow-hidden flex flex-col justify-between group bg-slate-900 border border-slate-800 hover-lift shadow-xl min-w-0">
      {/* Cover Image & Badges */}
      <div className="relative h-52 w-full bg-slate-800 overflow-hidden shrink-0">
        <img
          src={city.image || DEFAULT_CITY_IMAGE}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => { e.target.src = DEFAULT_CITY_IMAGE }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/30" />

        {/* Cost Index Badge & Popularity */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15">
            {costIndex}
          </span>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> {popularity}
          </span>
        </div>

        {/* Bookmark Action */}
        <button
          type="button"
          onClick={handleSaveToggle}
          disabled={isSaving}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center z-10 ${
            isSaved
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-black/50 hover:bg-black/70 text-white border border-white/15 hover:scale-105'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* City & Country on Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white z-10 min-w-0">
          <h3 className="text-lg font-bold text-white font-display drop-shadow-md truncate-safe">
            {name}
          </h3>
          <p className="text-xs text-slate-200 flex items-center gap-1.5 truncate-safe mt-0.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate-safe">{country}</span>
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 min-w-0">
        {/* Curated Itinerary Badge & Highlights */}
        <div className="space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-lg border border-indigo-500/30 truncate-safe">
              <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate-safe">{totalDays}-Day Plan</span>
            </span>
            <span className="text-[11px] font-bold text-slate-300 shrink-0">
              Est. {formatCurrency(curatedPlan?.estimatedBudgetINR || 45000, 'INR')}
            </span>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">
            {curatedPlan?.tagline || city.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2 min-w-0">
          <Link
            to={`/cities/${cityId}`}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors group/link truncate-safe"
          >
            View Itinerary <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform shrink-0" />
          </Link>
          <Button
            size="sm"
            variant="outline"
            icon={Plus}
            onClick={() => onAddToTrip?.(city)}
            className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white shrink-0 min-h-[36px]"
          >
            Add
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default CityCard
