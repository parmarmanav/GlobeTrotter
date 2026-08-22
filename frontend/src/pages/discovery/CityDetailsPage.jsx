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
      {/* City Hero Banner (Flexible non-overlapping layout) */}
      <div className="relative overflow-hidden rounded-3xl min-h-[360px] sm:min-h-[440px] shadow-2xl bg-slate-950 p-6 sm:p-10 flex flex-col justify-between border border-slate-800/80">
        <img
          src={city.image || DEFAULT_COVER}
          alt={city.name}
          className="absolute inset-0 w-full h-full object-cover opacity-75 -z-10"
          onError={(e) => { e.target.src = DEFAULT_COVER }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/40 -z-10" />

        {/* Top Badges & Back Button */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <Link
            to={ROUTES.EXPLORE}
            className="px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700/50 hover-lift min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Destinations</span>
          </Link>

          <button
            type="button"
            onClick={handleSaveToggle}
            disabled={isSaving}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center border border-white/10 ${
              isSaved ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'bg-slate-900/80 hover:bg-slate-800 text-white hover-lift'
            }`}
            title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Hero Bottom Meta */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-auto pt-8 min-w-0">
          <div className="space-y-3 max-w-2xl min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-600/90 text-white backdrop-blur-md shadow-md">
                {city.region || 'International'}
              </span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-black/60 text-slate-100 backdrop-blur-md border border-white/15">
                {city.costIndex || '$$'} Cost Index
              </span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-black/60 text-slate-100 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> {city.popularityScore || 90}% Popularity
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display drop-shadow-md truncate-safe">
              {city.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate-safe">{city.country}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              icon={Plus}
              onClick={() => setIsGenerateTripOpen(true)}
              className="shadow-xl shadow-indigo-600/30"
            >
              Add to Trip
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Guide Details & Curated Daily Itinerary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: About, Essentials & Curated Itinerary */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <Card className="p-6 sm:p-8 space-y-4 bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">About {city.name}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-light">
              {city.description || `Welcome to ${city.name}, a prominent destination in ${city.country}. Known for rich culture, memorable attractions, and scenic neighborhoods.`}
            </p>

            {/* Travel Essentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="space-y-1 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Best Time to Visit
                </span>
                <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate-safe">{city.bestTimeToVisit || 'Spring & Autumn'}</span>
                </p>
              </div>

              <div className="space-y-1 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Primary Language
                </span>
                <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="truncate-safe">{city.language || 'English / Native'}</span>
                </p>
              </div>

              <div className="space-y-1 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Platform Currency
                </span>
                <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>INR (₹)</span>
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
          <Card className="p-6 space-y-4 sticky top-24 bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
            <h3 className="text-base font-bold text-white font-display">
              Ready for {city.name}?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Auto-generate your multi-day trip with all curated activities, timings, and budget pre-scheduled into your account.
            </p>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full shadow-lg shadow-indigo-600/25"
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
