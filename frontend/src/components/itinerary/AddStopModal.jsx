import React, { useState, useEffect } from 'react'
import { cityService } from '@/services/cityService'
import { useDebounce } from '@/hooks/useDebounce'
import { Modal, Input, DatePicker, Textarea, Button, Spinner, Badge } from '@/components/common'
import { Search, MapPin, Calendar, Plus, Globe } from 'lucide-react'

export function AddStopModal({ isOpen, onClose, onAddStop, isLoading = false }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)
  const [customCityName, setCustomCityName] = useState('')
  const [customCountry, setCustomCountry] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const debouncedQuery = useDebounce(searchQuery, 350)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setSearchResults([])
      return
    }

    const search = async () => {
      setIsSearching(true)
      try {
        const response = await cityService.searchCities(debouncedQuery)
        const data = response.data || []
        setSearchResults(Array.isArray(data) ? data : [])
      } catch (err) {
        console.warn('City search failed:', err)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    search()
  }, [debouncedQuery])

  const handleSelectCity = (city) => {
    setSelectedCity(city)
    setCustomCityName(city.name || '')
    setCustomCountry(city.country || '')
    setSearchQuery('')
    setSearchResults([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const cityName = selectedCity?.name || customCityName.trim()
    const country = selectedCity?.country || customCountry.trim()

    if (!cityName || !country) {
      setErrorMessage('Please specify both a city name and country.')
      return
    }

    const stopPayload = {
      cityName,
      country,
      cityId: selectedCity?._id || selectedCity?.id || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      notes: notes.trim() || undefined,
    }

    onAddStop(stopPayload)
  }

  const handleReset = () => {
    setSelectedCity(null)
    setCustomCityName('')
    setCustomCountry('')
    setSearchQuery('')
    setSearchResults([])
    setStartDate('')
    setEndDate('')
    setNotes('')
    setErrorMessage('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset()
        onClose()
      }}
      title="Add Destination Stop"
      description="Select a city to include in your multi-destination travel route"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* City Search Bar */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Search Destination City
          </label>
          <div className="relative">
            <Input
              placeholder="Search e.g. Paris, Tokyo, Rome, New York..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (errorMessage) setErrorMessage('')
              }}
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <Spinner size="sm" />
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-card)] shadow-lg p-1 space-y-1 z-20">
              {searchResults.map((city) => (
                <button
                  key={city._id || city.id || city.name}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-indigo-500/10 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">{city.name}</p>
                      <p className="text-[10px] text-slate-400">{city.country} • {city.region || 'Region'}</p>
                    </div>
                  </div>
                  {city.costIndex && <Badge variant="secondary" size="sm">{city.costIndex}</Badge>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected City or Manual Input */}
        {selectedCity ? (
          <div className="p-3.5 rounded-xl bg-indigo-500/10/80 border border-teal-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-600 text-white">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-teal-900">{selectedCity.name}</p>
                <p className="text-[10px] text-indigo-400">{selectedCity.country}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCity(null)}
              className="text-xs text-indigo-400 hover:text-teal-900 font-semibold cursor-pointer underline"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City Name *"
              placeholder="e.g. Kyoto"
              value={customCityName}
              onChange={(e) => setCustomCityName(e.target.value)}
              required={!selectedCity}
            />
            <Input
              label="Country *"
              placeholder="e.g. Japan"
              value={customCountry}
              onChange={(e) => setCustomCountry(e.target.value)}
              required={!selectedCity}
            />
          </div>
        )}

        {/* Stop Dates */}
        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            label="Arrival Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DatePicker
            label="Departure Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Notes */}
        <Textarea
          label="Stop Notes (Optional)"
          placeholder="Hotel booking details, transit notes, must-see places..."
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--color-border-subtle)]">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading} icon={Plus}>
            Add Stop
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddStopModal
