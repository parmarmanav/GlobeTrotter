import React, { useState } from 'react'
import { communityService } from '@/services/communityService'
import { useApp } from '@/context/AppContext'
import { Modal, Input, Textarea, Button } from '@/components/common'
import { Plus, Image, Send, MapPin, Sparkles } from 'lucide-react'

export function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { addToast } = useApp()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setErrorMessage('Please provide both a title and story content.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        images: imageUrl.trim() ? [imageUrl.trim()] : [],
      }

      const response = await communityService.createPost(payload)
      const createdPost = response.data || response

      addToast({
        type: 'success',
        title: 'Story Published!',
        message: 'Your travel story has been shared with the community.',
      })

      onPostCreated?.(createdPost)
      handleClose()
    } catch (err) {
      setErrorMessage(err.message || 'Could not publish post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setTitle('')
    setContent('')
    setImageUrl('')
    setErrorMessage('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Share a Travel Story"
      description="Inspire the GlobeTrotter community with your itineraries and tips"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <Input
          label="Post Title *"
          placeholder="e.g. 5 Hidden Gems We Found in Montmartre, Paris"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errorMessage) setErrorMessage('')
          }}
          required
        />

        <Textarea
          label="Story / Travel Experience *"
          placeholder="Write about the highlights, transit tips, food recommendations, and advice for other travelers..."
          rows={5}
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            if (errorMessage) setErrorMessage('')
          }}
          required
        />

        <Input
          label="Cover Image URL (Optional)"
          placeholder="https://images.unsplash.com/..."
          icon={Image}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--color-border-subtle)]">
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            icon={Send}
          >
            Publish Story
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreatePostModal
