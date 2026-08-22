import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { MapPin, Star, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, Badge, Button } from '@/components/common'

export function PopularDestinationsWidget({ destinations = [] }) {
  const defaultDestinations = [
    { _id: 'paris', name: 'Paris', country: 'France', costIndex: '$$$', popularityScore: 98, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
    { _id: 'tokyo', name: 'Tokyo', country: 'Japan', costIndex: '$$$', popularityScore: 99, image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80' },
    { _id: 'rome', name: 'Rome', country: 'Italy', costIndex: '$$', popularityScore: 96, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80' },
    { _id: 'bangkok', name: 'Bangkok', country: 'Thailand', costIndex: '$', popularityScore: 94, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80' },
  ]

  const items = destinations.length > 0 ? destinations : defaultDestinations

  return (
    <Card className="p-6">
      <CardHeader className="border-none px-0 pt-0">
        <div>
          <CardTitle>Popular Destinations</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Top-rated spots across the globe</p>
        </div>
        <Link to={ROUTES.EXPLORE} className="text-xs font-bold text-indigo-400 hover:text-indigo-400">
          Explore All
        </Link>
      </CardHeader>

      <div className="space-y-3">
        {items.slice(0, 5).map((city) => {
          const cityId = city._id || city.id || city.name?.toLowerCase().replace(/\s+/g, '-')
          return (
            <div
              key={cityId}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-indigo-500/10/50 border border-[var(--color-border-subtle)] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                  <img
                    src={city.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80'}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <Link to={`/cities/${cityId}`} className="block">
                    <h5 className="text-xs font-bold text-white truncate hover:text-indigo-400">
                      {city.name}
                    </h5>
                  </Link>
                  <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-indigo-400" /> {city.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {city.costIndex && (
                  <Badge variant="secondary" size="sm" className="text-[10px] py-0 px-1.5">
                    {city.costIndex}
                  </Badge>
                )}
                <Link to={ROUTES.CREATE_TRIP}>
                  <Button variant="ghost" size="sm" className="p-1.5 h-7 w-7 text-indigo-400 hover:bg-teal-100/60 rounded-lg">
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default PopularDestinationsWidget
