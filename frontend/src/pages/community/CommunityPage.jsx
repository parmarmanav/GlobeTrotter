import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Heart, MessageCircle, Share2, Compass, Sparkles } from 'lucide-react'
import { Button, Input, Card, Avatar, Badge } from '@/components/common'

export function CommunityPage() {
  const [search, setSearch] = useState('')

  const samplePosts = [
    {
      id: 'post-1',
      title: '7 Days in Northern Italy: Hidden Gems & Trattorias',
      author: 'Elena Rossi',
      authorAvatar: '',
      likes: 42,
      comments: 8,
      tags: ['Italy', 'Culinary', 'RoadTrip'],
      date: '2 days ago',
      image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'post-2',
      title: 'Budget Backpacking Tokyo & Kyoto: Full Cost Breakdown',
      author: 'Marcus Vance',
      authorAvatar: '',
      likes: 89,
      comments: 19,
      tags: ['Japan', 'BudgetTravel', 'Solo'],
      date: '4 days ago',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Traveler Community</h1>
          <p className="text-xs text-slate-500 mt-1">
            Exchange tips, discover shared itineraries, and find inspiration from global wanderers
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus}>
          Create Post
        </Button>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <Input
          placeholder="Search travel discussions, guides, and tips..."
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-5">
        {samplePosts.map((post) => (
          <Card key={post.id} className="p-5 hoverable">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Avatar name={post.author} size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{post.author}</h4>
                  <p className="text-[10px] text-slate-400">{post.date}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {post.tags.map((t) => (
                  <Badge key={t} variant="primary" size="sm">#{t}</Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <div className="sm:col-span-3 space-y-2">
                <Link to={`/community/${post.id}`} className="block group">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors font-display">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Detailed itinerary tips, hotel recommendations, and transportation advice from our week-long trip.
                </p>
              </div>
              <div className="sm:col-span-1 h-24 rounded-xl overflow-hidden bg-slate-100">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <button type="button" className="flex items-center gap-1 hover:text-rose-600 transition-colors cursor-pointer">
                  <Heart className="w-4 h-4" /> {post.likes}
                </button>
                <button type="button" className="flex items-center gap-1 hover:text-teal-600 transition-colors cursor-pointer">
                  <MessageCircle className="w-4 h-4" /> {post.comments}
                </button>
              </div>
              <Link to={`/community/${post.id}`} className="font-bold text-teal-600 hover:text-teal-700">
                Join Discussion &rarr;
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CommunityPage
