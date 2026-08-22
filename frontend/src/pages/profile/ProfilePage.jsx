import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { User, Mail, MapPin, Globe, Phone, Camera, Shield } from 'lucide-react'
import { Button, Card, Avatar, Badge } from '@/components/common'

export function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">User Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your traveler identity and personal details</p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative">
            <Avatar
              src={user?.avatar || user?.profileImage}
              name={user?.name || user?.username || 'User'}
              size="2xl"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
              aria-label="Upload photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {user?.name || user?.username || 'GlobeTrotter Traveler'}
              </h2>
              {user?.role === 'admin' && <Badge variant="primary" size="sm">Admin</Badge>}
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-xs text-teal-600 font-medium">@{user?.username || 'traveler'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase">Location</span>
            <p className="text-slate-800 font-medium">{user?.city || 'Not set'}, {user?.country || 'Not set'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase">Contact Phone</span>
            <p className="text-slate-800 font-medium">{user?.phone || 'Not set'}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProfilePage
