import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { userService } from '@/services/userService'
import {
  User,
  Mail,
  MapPin,
  Globe,
  Phone,
  Camera,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, Avatar, Badge, Spinner } from '@/components/common'

export function ProfilePage() {
  const { user, setUser } = useAuth()
  const { addToast } = useApp()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    city: '',
    country: '',
    bio: '',
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || user.phone || '',
        city: user.city || '',
        country: user.country || '',
        bio: user.bio || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errorMessage) setErrorMessage('')
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      const data = new FormData()
      data.append('profileImage', file)

      const response = await userService.uploadProfileImage(data)
      const updatedUser = response.data || response

      if (updatedUser) {
        setUser((prev) => ({ ...prev, ...updatedUser }))
        addToast({
          type: 'success',
          title: 'Photo Updated',
          message: 'Your profile picture has been updated.',
        })
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Could not upload image.',
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMessage('')

    try {
      const response = await userService.updateProfile(formData)
      const updatedUser = response.data || response

      if (updatedUser) {
        setUser((prev) => ({ ...prev, ...updatedUser }))
      }

      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal information has been saved.',
      })
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const fullName = `${formData.firstName} ${formData.lastName}`.trim() || user?.name || user?.username || 'Traveler'

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">User Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your traveler identity and personal details</p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Profile Overview Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative">
            <Avatar
              src={user?.profileImage || user?.avatar}
              name={fullName}
              size="2xl"
            />
            <button
              type="button"
              onClick={handleImageClick}
              disabled={isUploadingImage}
              className="absolute bottom-0 right-0 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-md cursor-pointer transition-colors disabled:opacity-50"
              aria-label="Upload photo"
            >
              {isUploadingImage ? (
                <Spinner size="sm" className="text-white" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {fullName}
              </h2>
              {user?.role === 'admin' && (
                <Badge variant="primary" size="sm">
                  Administrator
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-xs text-teal-600 font-medium">@{user?.username || 'traveler'}</p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Username"
              name="username"
              icon={User}
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              value={formData.email}
              disabled
              helperText="Contact support to modify primary email address"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Phone Number"
              name="phoneNumber"
              icon={Phone}
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <Input
              label="City"
              name="city"
              icon={MapPin}
              value={formData.city}
              onChange={handleChange}
            />
            <Input
              label="Country"
              name="country"
              icon={Globe}
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <Textarea
            label="Bio / Traveler Notes"
            name="bio"
            placeholder="Tell fellow globetrotters about your favorite destinations and travel passions..."
            rows={3}
            value={formData.bio}
            onChange={handleChange}
          />

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              icon={Save}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ProfilePage
