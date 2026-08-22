import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { cityService } from '@/services/cityService'
import { userService } from '@/services/userService'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import {
  MapPin,
  Bookmark,
  Star,
  Compass,
  ArrowLeft,
  Calendar,
  IndianRupee,
  Plus,
  Sparkles,
  Sun,
  Globe2,
} from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  Skeleton,
  ErrorState,
} from '@/components/common'
import { CuratedItinerarySection } from '@/components/discovery/CuratedItinerarySection'
import { GenerateTripFromCityModal } from '@/components/discovery/GenerateTripFromCityModal'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'

export function CityDetailsPage() {
  const { cityId } = useParams()
  const { isAuthenticated } = useAuth()
  const { addToast } = useApp()

  const [city, setCity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerateTripOpen, setIsGenerateTripOpen] = useState(false)

  const fetchCityData = useCallback(async () => {
    if (!cityId) return
    setIsLoading(true)
    setError(null)
    try {
      const cityRes = await cityService.getCityById(cityId)
      const cityData = cityRes.data || cityRes
      setCity(cityData)

      // If user is authenticated, check if this destination is in their wishlist
      if (isAuthenticated) {
        try {
          const savedRes = await userService.getSavedDestinations()
          const savedList = savedRes.data || []
          const isAlreadySaved = Array.isArray(savedList) && savedList.some((s) => {
            const sId = s._id || s.id || s
            return String(sId) === String(cityId)
          })
          setIsSaved(isAlreadySaved)
        } catch (e) {
          console.warn('Could not check saved status:', e)
        }
      }
    } catch (err) {
      console.warn('Failed to load city details:', err)
      setError(err.message || 'Unable to retrieve destination details.')
    } finally {
      setIsLoading(false)
    }
  }, [cityId, isAuthenticated])

  useEffect(() => {
    fetchCityData()
  }, [fetchCityData])

  const handleSaveToggle = async () => {
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
          title: 'Removed from Wishlist',
          message: `${city?.name} has been removed from your saved list.`,
        })
      } else {
        await userService.addSavedDestination(cityId)
        setIsSaved(true)
        addToast({
          type: 'success',
          title: 'Destination Saved! 🌟',
          message: `${city?.name} has been saved to your wishlist.`,
        })
      }
    } catch (err) {
      console.error('Save destination toggle error:', err)
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err.message || 'Could not update wishlist.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-72 sm:h-96 rounded-3xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !city) {
    return (
      <ErrorState
        title="Destination not found"
        message={error || 'The requested city could not be found.'}
        onRetry={fetchCityData}
      />
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* City Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl h-72 sm:h-96 shadow-lg bg-slate-900">
        <img
          src={city.image || DEFAULT_COVER}
          alt={city.name}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => { e.target.src = DEFAULT_COVER }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges & Back Button */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <Link
            to={ROUTES.EXPLORE}
            className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Destinations
          </Link>

          <button
            type="button"
            onClick={handleSaveToggle}
            disabled={isSaving}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isSaved ? 'bg-rose-600 text-white scale-105' : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Hero Bottom Meta */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-teal-500/80 text-white backdrop-blur-md">
                {city.region || 'International'}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20">
                {city.costIndex || '$$'} Cost
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-black/50 text-white backdrop-blur-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> {city.popularityScore || 90} Popularity
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display drop-shadow-md">
              {city.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-teal-400" /> {city.country}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="accent"
              size="md"
              icon={Plus}
              onClick={() => setIsGenerateTripOpen(true)}
            >
              Add to Trip
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Guide Details & Curated Daily Itinerary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: About, Essentials & Curated Itinerary */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">About {city.name}</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {city.description || `Welcome to ${city.name}, a prominent destination in ${city.country}. Known for rich culture, memorable attractions, and scenic neighborhoods.`}
            </p>

            {/* Travel Essentials Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Best Time to Visit
                </span>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> {city.bestTimeToVisit || 'Spring & Autumn'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Primary Language
                </span>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-teal-600" /> {city.language || 'English / Native'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Platform Currency
                </span>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> INR (₹)
                </p>
              </div>
            </div>
          </Card>

          {/* Detailed Day-by-Day Curated Itinerary */}
          <CuratedItinerarySection
            city={city}
            onAddToTrip={() => setIsGenerateTripOpen(true)}
          />
        </div>

        {/* Right Sidebar: Trip Generation CTA */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Ready for {city.name}?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Auto-generate your multi-day trip with all curated activities, timings, and budget pre-scheduled into your account.
            </p>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                icon={Plus}
                onClick={() => setIsGenerateTripOpen(true)}
              >
                Add to Trip
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Auto-Generate Trip Modal */}
      <GenerateTripFromCityModal
        isOpen={isGenerateTripOpen}
        onClose={() => setIsGenerateTripOpen(false)}
        city={city}
      />
    </div>
  )
}

export default CityDetailsPage
