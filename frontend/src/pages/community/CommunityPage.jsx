import React, { useState, useEffect, useCallback } from 'react'
import { communityService } from '@/services/communityService'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { useDebounce } from '@/hooks/useDebounce'
import { MessageSquare, Plus, Search, Sparkles, TrendingUp, Filter, Users } from 'lucide-react'
import { Input, Select, Button, Pagination, EmptyState, ErrorState, Skeleton } from '@/components/common'
import { PostCard } from '@/components/community/PostCard'
import { CreatePostModal } from '@/components/community/CreatePostModal'

export function CommunityPage() {
  const { isAuthenticated } = useAuth()
  const { addToast } = useApp()

  const [posts, setPosts] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 350)

  const fetchPosts = useCallback(async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = {
        page,
        limit: 10,
        sort: sortBy,
      }

      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim()
      }

      const response = await communityService.getPosts(params)
      const data = response.data || []
      setPosts(Array.isArray(data) ? data : [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err) {
      console.warn('Failed to load community stories:', err)
      setError(err.message || 'Unable to retrieve community feed.')
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, sortBy])

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  const handleOpenCreate = () => {
    if (!isAuthenticated) {
      addToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in to publish your travel stories.',
      })
      return
    }
    setIsCreateOpen(true)
  }

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev])
  }

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => (p._id || p.id) !== postId))
  }

  const sortOptions = [
    { value: 'recent', label: 'Latest Stories' },
    { value: 'popular', label: 'Most Liked' },
    { value: 'most_commented', label: 'Most Discussed' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 flex items-center gap-1.5 w-fit">
            <Users className="w-3.5 h-3.5" /> Globetrotter Community
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
            Travel Stories & Discussions
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Share hidden spots, itinerary tips, travel advice, and connect with passionate wanderers across the world.
          </p>
          <div className="pt-2">
            <Button
              variant="accent"
              size="md"
              icon={Plus}
              onClick={handleOpenCreate}
            >
              Share Your Story
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex-1">
          <Input
            placeholder="Search stories, tips, and topics..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-56">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </div>

      {/* Feed Area */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load community feed"
          message={error}
          onRetry={() => fetchPosts(pagination.page)}
        />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No travel stories found"
          description="Be the first to share an itinerary recommendation or post your travel experiences!"
          actionLabel="Share First Story"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard
              key={post._id || post.id}
              post={post}
              onDeletePost={handleDeletePost}
            />
          ))}

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => fetchPosts(p)}
          />
        </div>
      )}

      {/* Create Story Modal */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  )
}

export default CommunityPage
