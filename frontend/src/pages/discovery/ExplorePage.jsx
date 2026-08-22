import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Compass, MapPin, Star, Plus } from 'lucide-react'
import { Input, Select, Card, Badge, Button } from '@/components/common'
import { REGIONS } from '@/constants/categories'

export function ExplorePage() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('')

  const sampleCities = [
    { id: 'paris', name: 'Paris', country: 'France', region: 'Europe', cost: '$$$', rating: 4.9, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
    { id: 'tokyo', name: 'Tokyo', country: 'Japan', region: 'Asia', cost: '$$$', rating: 4.9, image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' },
    { id: 'rome', name: 'Rome', country: 'Italy', region: 'Europe', cost: '$$', rating: 4.8, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
    { id: 'bangkok', name: 'Bangkok', country: 'Thailand', region: 'Asia', cost: '$', rating: 4.7, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80' },
    { id: 'barcelona', name: 'Barcelona', country: 'Spain', region: 'Europe', cost: '$$', rating: 4.8, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80' },
    { id: 'new-york', name: 'New York City', country: 'United States', region: 'North America', cost: '$$$$', rating: 4.9, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Discover Destinations</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore global cities, check cost indexes, and add stops to your upcoming travel plans
        </p>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by city, country or attraction..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <Select
            placeholder="All Regions"
            options={REGIONS.map((r) => ({ value: r.id, label: r.label }))}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleCities.map((city) => (
          <Card key={city.id} className="p-0 overflow-hidden group hoverable border-slate-200/90">
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" size="sm" className="backdrop-blur-md bg-slate-900/80">
                  {city.cost}
                </Badge>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">{city.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" /> {city.country}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {city.rating}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Link to={`/cities/${city.id}`} className="text-xs font-bold text-teal-600 hover:text-teal-700">
                  View Guide &rarr;
                </Link>
                <Button size="sm" variant="outline" icon={Plus}>
                  Add to Trip
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ExplorePage
