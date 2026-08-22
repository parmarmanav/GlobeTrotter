import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { communityService } from '@/services/communityService'
import { ROUTES } from '@/constants/routes'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { Card, Skeleton, ErrorState } from '@/components/common'
import { PostCard } from '@/components/community/PostCard'
import { CommentsThread } from '@/components/community/CommentsThread'

export function PostDetailsPage() {
  const { postId } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPost = useCallback(async () => {
    if (!postId) return
    setIsLoading(true)
    setError(null)
    try {
      const [postRes, commentsRes] = await Promise.all([
        communityService.getPostById(postId),
        communityService.getComments(postId).catch(() => ({ data: [] })),
      ])

      const pData = postRes.data || postRes
      setPost(pData)

      const cData = commentsRes.data || pData.comments || []
      setComments(Array.isArray(cData) ? cData : [])
    } catch (err) {
      console.warn('Failed to load post details:', err)
      setError(err.message || 'Unable to retrieve travel story.')
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 rounded-2xl w-full" />
        <Skeleton className="h-48 rounded-2xl w-full" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <ErrorState
        title="Story not found"
        message={error || 'The requested story does not exist.'}
        onRetry={fetchPost}
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <Link
        to={ROUTES.COMMUNITY}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Community Feed
      </Link>

      <PostCard post={post} onDeletePost={() => navigate(ROUTES.COMMUNITY)} />

      <Card className="p-6">
        <CommentsThread postId={postId} initialComments={comments} />
      </Card>
    </div>
  )
}

export default PostDetailsPage
