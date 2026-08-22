import React, { useState, useEffect, useCallback } from 'react'
import { cityService } from '@/services/cityService'
import { useDebounce } from '@/hooks/useDebounce'
import { Search, MapPin, Filter, Globe, Sparkles } from 'lucide-react'
import { Input, Select, Pagination, EmptyState, ErrorState, CityCardSkeleton } from '@/components/common'
import { CityCard } from '@/components/discovery/CityCard'
import { AddToTripModal } from '@/components/discovery/AddToTripModal'

export function CitiesPage() {
  const [cities, setCities] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 })
  const [searchQuery, setSearchQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState('ALL')
  const [costFilter, setCostFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('popularity_desc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedCityForTrip, setSelectedCityForTrip] = useState(null)

  const debouncedSearch = useDebounce(searchQuery, 350)

  const fetchCities = useCallback(async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = {
        page,
        limit: 12,
        sort: sortBy,
      }

      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim()
      }
      if (regionFilter && regionFilter !== 'ALL') {
        params.region = regionFilter
      }
      if (costFilter && costFilter !== 'ALL') {
        params.costIndex = costFilter
      }

      const response = await cityService.getCities(params)
      const data = response.data || []
      setCities(Array.isArray(data) ? data : [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err) {
      console.warn('Failed to fetch cities:', err)
      setError(err.message || 'Unable to load destination cities.')
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, regionFilter, costFilter, sortBy])

  useEffect(() => {
    fetchCities(1)
  }, [fetchCities])

  const regionOptions = [
    { value: 'ALL', label: 'All Global Regions' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Asia', label: 'Asia' },
    { value: 'Americas', label: 'Americas' },
    { value: 'Africa', label: 'Africa' },
    { value: 'Oceania', label: 'Oceania' },
  ]

  const costOptions = [
    { value: 'ALL', label: 'All Cost Levels' },
    { value: '$', label: '$ — Budget Friendly' },
    { value: '$$', label: '$$ — Moderate' },
    { value: '$$$', label: '$$$ — Luxury / Premium' },
  ]

  const sortOptions = [
    { value: 'popularity_desc', label: 'Most Popular First' },
    { value: 'name_asc', label: 'City Name (A-Z)' },
    { value: 'cost_asc', label: 'Cost: Low to High' },
    { value: 'cost_desc', label: 'Cost: High to Low' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 flex items-center gap-1.5 w-fit">
            <Globe className="w-3.5 h-3.5" /> Destination Directory
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
            Discover Incredible Cities
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Explore curated travel guides, cost indicators, top sights, and seamlessly add destinations to your multi-city journeys.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="lg:col-span-1">
          <Input
            placeholder="Search by city or country..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select
          options={regionOptions}
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        />

        <Select
          options={costOptions}
          value={costFilter}
          onChange={(e) => setCostFilter(e.target.value)}
        />

        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        />
      </div>

      {/* City Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CityCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load destinations"
          message={error}
          onRetry={() => fetchCities(pagination.page)}
        />
      ) : cities.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No destination cities found"
          description="Try broadening your search terms or clearing your cost/region filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('')
            setRegionFilter('ALL')
            setCostFilter('ALL')
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cities.map((city) => (
              <CityCard
                key={city._id || city.id}
                city={city}
                onAddToTrip={(c) => setSelectedCityForTrip(c)}
              />
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => fetchCities(p)}
          />
        </>
      )}

      {/* Add To Trip Modal */}
      <AddToTripModal
        isOpen={Boolean(selectedCityForTrip)}
        onClose={() => setSelectedCityForTrip(null)}
        item={selectedCityForTrip}
        itemType="city"
      />
    </div>
  )
}

export default CitiesPage
