import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { communityService } from '@/services/communityService'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { formatDate } from '@/utils/formatDate'
import {
  Heart,
  MessageSquare,
  Share2,
  Trash2,
  MapPin,
  Sparkles,
  Check,
  Copy,
  MoreVertical,
} from 'lucide-react'
import { Card, Avatar, Button, ConfirmDialog } from '@/components/common'

export function PostCard({ post, onDeletePost }) {
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useApp()

  if (!post) return null

  const postId = post._id || post.id
  const author = post.userId || post.author || {}
  const authorName = `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.username || 'Traveler'
  const authorImage = author.profileImage || author.avatar

  const currentUserId = user?._id || user?.id
  const isLikedByMe = Array.isArray(post.likes)
    ? post.likes.some((id) => id === currentUserId || id?._id === currentUserId)
    : Boolean(post.isLiked)

  const [likesCount, setLikesCount] = useState(Array.isArray(post.likes) ? post.likes.length : post.likesCount || 0)
  const [isLiked, setIsLiked] = useState(isLikedByMe)
  const [isLiking, setIsLiking] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const commentsCount = Array.isArray(post.comments) ? post.comments.length : post.commentsCount || 0
  const isAuthor = (author._id || author.id || author) === currentUserId || user?.role === 'ADMIN'

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      addToast({ type: 'info', title: 'Sign In Required', message: 'Please sign in to like community posts.' })
      return
    }

    if (isLiking) return
    setIsLiking(true)

    // Optimistic UI
    const prevLiked = isLiked
    const prevCount = likesCount
    setIsLiked(!prevLiked)
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1)

    try {
      if (prevLiked) {
        await communityService.unlikePost(postId)
      } else {
        await communityService.likePost(postId)
      }
    } catch (err) {
      // Revert on failure
      setIsLiked(prevLiked)
      setLikesCount(prevCount)
      addToast({ type: 'error', title: 'Action Failed', message: err.message || 'Could not update like.' })
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/community/${postId}`
    navigator.clipboard.writeText(url)
    addToast({ type: 'success', title: 'Link Copied', message: 'Post link copied to clipboard!' })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await communityService.deletePost(postId)
      onDeletePost?.(postId)
      addToast({ type: 'success', title: 'Post Deleted', message: 'Your community post has been removed.' })
      setShowDeleteConfirm(false)
    } catch (err) {
      addToast({ type: 'error', title: 'Delete Failed', message: err.message || 'Could not delete post.' })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="p-5 sm:p-6 space-y-4 border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
        {/* Post Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={authorImage} name={authorName} size="md" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-display">
                {authorName}
              </h4>
              <p className="text-[11px] text-slate-400">
                {formatDate(post.createdAt || new Date())}
              </p>
            </div>
          </div>

          {isAuthor && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Post Content */}
        <div className="space-y-2">
          <Link to={`/community/${postId}`} className="block group/title">
            <h3 className="text-base font-bold text-slate-900 group-hover/title:text-teal-600 transition-colors font-display">
              {post.title}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        {/* Images Grid if present */}
        {Array.isArray(post.images) && post.images.length > 0 && (
          <div className={`grid gap-2 rounded-2xl overflow-hidden ${
            post.images.length === 1 ? 'grid-cols-1 max-h-80' : 'grid-cols-2 max-h-72'
          }`}>
            {post.images.slice(0, 2).map((imgUrl, i) => (
              <img
                key={i}
                src={imgUrl}
                alt="Post photo"
                className="w-full h-full object-cover rounded-xl"
              />
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleLikeToggle}
              className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{likesCount}</span>
            </button>

            <Link
              to={`/community/${postId}`}
              className="flex items-center gap-1.5 font-semibold text-slate-500 hover:text-teal-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{commentsCount}</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Share story"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </Card>

      {/* Delete Post Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Community Post?"
        message="This story and all its discussions will be permanently deleted."
        confirmText="Delete Post"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </>
  )
}

export default PostCard
