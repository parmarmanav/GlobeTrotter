import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { userService } from '@/services/userService'
import { useApp } from '@/context/AppContext'
import { getCuratedItineraryForCity } from '@/data/curatedItineraries'
import { formatCurrency } from '@/utils/formatCurrency'
import { Bookmark, MapPin, Trash2, Plus, Star, Compass, Sparkles } from 'lucide-react'
import { Card, Button, Badge, EmptyState, ErrorState, CityCardSkeleton, ConfirmDialog } from '@/components/common'
import { GenerateTripFromCityModal } from '@/components/discovery/GenerateTripFromCityModal'

export function SavedDestinationsPage() {
  const { addToast } = useApp()
  const [savedCities, setSavedCities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cityToDelete, setCityToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedCityForTrip, setSelectedCityForTrip] = useState(null)

  const fetchSaved = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await userService.getSavedDestinations()
      const data = response.data || []
      setSavedCities(Array.isArray(data) ? data : [])
    } catch (err) {
      console.warn('Failed to load saved destinations:', err)
      setError(err.message || 'Unable to load saved destinations.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSaved()
  }, [fetchSaved])

  const handleRemove = async () => {
    if (!cityToDelete) return
    setIsDeleting(true)
    const cityId = cityToDelete._id || cityToDelete.id
    try {
      await userService.removeSavedDestination(cityId)
      setSavedCities((prev) => prev.filter((c) => (c._id || c.id) !== cityId))
      addToast({
        type: 'success',
        title: 'Destination Removed',
        message: `${cityToDelete.name} has been removed from your wishlist.`,
      })
      setCityToDelete(null)
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Removal Failed',
        message: err.message || 'Could not remove saved destination.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Saved Destinations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Your personal wishlist of curated cities and future travel stops
          </p>
        </div>
        <Link to={ROUTES.EXPLORE}>
          <Button variant="primary" size="md" icon={Compass}>
            Explore More Cities
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CityCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load wishlist"
          message={error}
          onRetry={fetchSaved}
        />
      ) : savedCities.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved destinations yet"
          description="Bookmark interesting cities while exploring to build your future travel wishlist."
          actionLabel="Explore Destinations"
          onAction={() => window.location.assign(ROUTES.EXPLORE)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCities.map((city) => {
            const cityId = city._id || city.id
            const curatedPlan = getCuratedItineraryForCity(city)
            const totalDays = curatedPlan?.durationDays || 3

            return (
              <Card key={cityId} className="p-0 overflow-hidden group hoverable border-[var(--color-border-subtle)]/90 shadow-md">
                <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={city.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => setCityToDelete(city)}
                      className="p-1.5 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white backdrop-blur-md transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white font-display">{city.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {city.country}
                      </p>
                    </div>
                    <Badge variant="primary" size="sm" className="font-bold">
                      {totalDays} Days Plan
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {curatedPlan?.tagline || city.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-subtle)]">
                    <Link to={`/cities/${cityId}`} className="text-xs font-bold text-indigo-400 hover:text-indigo-400">
                      View Itinerary &rarr;
                    </Link>
                    <Button
                      size="sm"
                      variant="primary"
                      icon={Plus}
                      onClick={() => setSelectedCityForTrip(city)}
                    >
                      Add to Trip
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(cityToDelete)}
        onClose={() => setCityToDelete(null)}
        onConfirm={handleRemove}
        title={`Remove ${cityToDelete?.name}?`}
        message="This city will be removed from your saved destination wishlist."
        confirmText="Remove"
        confirmVariant="danger"
        isLoading={isDeleting}
      />

      {/* Auto-Generate Trip from Curated Itinerary Modal */}
      <GenerateTripFromCityModal
        isOpen={Boolean(selectedCityForTrip)}
        onClose={() => setSelectedCityForTrip(null)}
        city={selectedCityForTrip}
      />
    </div>
  )
}

export default SavedDestinationsPage
