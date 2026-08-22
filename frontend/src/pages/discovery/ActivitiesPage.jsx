import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Sparkles, Clock, DollarSign, Star, Plus } from 'lucide-react'
import { Input, Select, Card, Badge, Button } from '@/components/common'
import { ACTIVITY_CATEGORIES } from '@/constants/categories'

export function ActivitiesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const sampleActivities = [
    { id: 'eiffel-tower', name: 'Eiffel Tower Sunset Summit', city: 'Paris', duration: '2.5 hrs', cost: '$38', category: 'Sightseeing', rating: 4.9, image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80' },
    { id: 'tokyo-ramen', name: 'Shinjuku Hidden Ramen Tasting Tour', city: 'Tokyo', duration: '3 hrs', cost: '$65', category: 'Food', rating: 4.95, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80' },
    { id: 'colosseum-gladiator', name: 'Colosseum & Underground Vaults Access', city: 'Rome', duration: '3.5 hrs', cost: '$52', category: 'Culture', rating: 4.85, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Discover Activities</h1>
        <p className="text-xs text-slate-500 mt-1">
          Search iconic sights, culinary experiences, walking tours, and adventure excursions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search activities by name or keywords..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <Select
            placeholder="All Categories"
            options={ACTIVITY_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleActivities.map((act) => (
          <Card key={act.id} className="p-0 overflow-hidden group hoverable border-slate-200/90">
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <img
                src={act.image}
                alt={act.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="primary" size="sm" className="bg-white/90 text-teal-800 border-none font-semibold">
                  {act.category}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" size="sm" className="backdrop-blur-md bg-slate-900/80 font-bold">
                  {act.cost}
                </Badge>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{act.name}</h3>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {act.duration}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {act.rating}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Link to={`/activities/${act.id}`} className="text-xs font-bold text-teal-600 hover:text-teal-700">
                  Details &rarr;
                </Link>
                <Button size="sm" variant="outline" icon={Plus}>
                  Add to Day
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ActivitiesPage
