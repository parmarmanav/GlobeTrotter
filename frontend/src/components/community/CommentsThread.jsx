import React, { useState } from 'react'
import { communityService } from '@/services/communityService'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { formatDate } from '@/utils/formatDate'
import { MessageSquare, Send, Trash2, User } from 'lucide-react'
import { Avatar, Button, Textarea } from '@/components/common'

export function CommentsThread({ postId, initialComments = [] }) {
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useApp()

  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      addToast({ type: 'info', title: 'Sign In Required', message: 'Please sign in to join the discussion.' })
      return
    }
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await communityService.addComment(postId, { text: newComment.trim() })
      const addedComment = response.data || response
      setComments((prev) => [...prev, addedComment])
      setNewComment('')
      addToast({ type: 'success', title: 'Comment Added', message: 'Your comment was posted.' })
    } catch (err) {
      addToast({ type: 'error', title: 'Failed', message: err.message || 'Could not post comment.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await communityService.deleteComment(postId, commentId)
      setComments((prev) => prev.filter((c) => (c._id || c.id) !== commentId))
      addToast({ type: 'success', title: 'Comment Removed', message: 'Comment was deleted.' })
    } catch (err) {
      addToast({ type: 'error', title: 'Delete Failed', message: err.message || 'Could not delete comment.' })
    }
  }

  const currentUserId = user?._id || user?.id

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-teal-600" /> Discussion ({comments.length})
      </h3>

      {/* Add Comment Input */}
      <form onSubmit={handleAddComment} className="space-y-3">
        <Textarea
          placeholder={isAuthenticated ? 'Write a thoughtful comment or question...' : 'Sign in to join the conversation.'}
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!isAuthenticated || isSubmitting}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            variant="primary"
            disabled={!isAuthenticated || !newComment.trim() || isSubmitting}
            isLoading={isSubmitting}
            icon={Send}
          >
            Post Comment
          </Button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-4 text-center">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-3 pt-2">
          {comments.map((c, i) => {
            const commentId = c._id || c.id || i
            const author = c.userId || c.author || {}
            const authorName = `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.username || 'Traveler'
            const isOwner = (author._id || author.id || author) === currentUserId || user?.role === 'ADMIN'

            return (
              <div
                key={commentId}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <Avatar src={author.profileImage} name={authorName} size="sm" />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{authorName}</span>
                      <span className="text-[10px] text-slate-400">{formatDate(c.createdAt || new Date())}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {c.text || c.content}
                    </p>
                  </div>
                </div>

                {isOwner && (
                  <button
                    type="button"
                    onClick={() => handleDeleteComment(commentId)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CommentsThread
