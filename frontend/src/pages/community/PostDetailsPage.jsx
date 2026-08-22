import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { ArrowLeft, Heart, MessageCircle, Share2, Send } from 'lucide-react'
import { Button, Input, Card, Avatar, Badge } from '@/components/common'

export function PostDetailsPage() {
  const { postId } = useParams()

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <Link
        to={ROUTES.COMMUNITY}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Community Feed
      </Link>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Avatar name="Elena Rossi" size="md" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Elena Rossi</h3>
            <p className="text-xs text-slate-400">Published 2 days ago</p>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Community Post #{postId}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
            Full travel log, route recommendations, hotel reviews, and itinerary insights will appear here when connected to the backend API.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Comments</h4>
          <div className="flex gap-2">
            <Input placeholder="Write a comment..." className="text-xs" />
            <Button size="sm" variant="primary" icon={Send}>
              Post
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PostDetailsPage
