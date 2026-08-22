import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { userService } from '@/services/userService'
import { ROUTES } from '@/constants/routes'
import { Card, CardHeader, CardTitle, CardDescription, Button, Input, Select, ConfirmDialog } from '@/components/common'
import { Globe, DollarSign, Trash2, Save, ShieldAlert } from 'lucide-react'

export function SettingsPage() {
  const { user, logout, setUser } = useAuth()
  const { addToast, theme, setTheme } = useApp()
  const navigate = useNavigate()

  const [preferences, setPreferences] = useState({
    language: 'English',
    preferredBudgetRange: {
      min: 0,
      max: 10000,
      currency: 'USD',
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user?.preferences) {
      setPreferences({
        language: user.preferences.language || 'English',
        preferredBudgetRange: {
          min: user.preferences.preferredBudgetRange?.min ?? 0,
          max: user.preferences.preferredBudgetRange?.max ?? 10000,
          currency: user.preferences.preferredBudgetRange?.currency || 'USD',
        },
      })
    }
  }, [user])

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const response = await userService.updatePreferences(preferences)
      const updatedUser = response.data || response

      if (updatedUser) {
        setUser((prev) => ({ ...prev, ...updatedUser }))
      }

      addToast({
        type: 'success',
        title: 'Preferences Saved',
        message: 'Your language and currency defaults have been updated.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not update preferences.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await userService.deleteAccount()
      await logout()
      addToast({
        type: 'info',
        title: 'Account Deleted',
        message: 'Your account has been permanently removed.',
      })
      navigate(ROUTES.LOGIN, { replace: true })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Deletion Failed',
        message: err.message || 'Unable to delete account.',
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Account Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure preferences, travel defaults, and account security</p>
      </div>

      {/* Preferences Form */}
      <Card className="p-6 space-y-4">
        <CardHeader className="border-none px-0 pt-0">
          <CardTitle>Travel Preferences & Defaults</CardTitle>
          <CardDescription>Default display currency and preferred languages</CardDescription>
        </CardHeader>

        <form onSubmit={handlePreferencesSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 flex flex-col justify-center">
              <label className="block text-xs font-semibold text-slate-300">Theme Appearance</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                      : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Dark Mode
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                      : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Light Mode
                </button>
              </div>
            </div>

            <div className="space-y-1.5 flex flex-col justify-center">
              <label className="block text-xs font-semibold text-slate-300">Platform Display Currency</label>
              <div className="min-h-[44px] px-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Standard Currency</span>
                <span className="font-bold text-indigo-400">INR (₹)</span>
              </div>
            </div>

            <Select
              label="Preferred Language"
              options={[
                { value: 'English', label: 'English' },
                { value: 'Spanish', label: 'Español' },
                { value: 'French', label: 'Français' },
                { value: 'German', label: 'Deutsch' },
                { value: 'Japanese', label: '日本語' },
              ]}
              value={preferences.language}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, language: e.target.value }))
              }
            />
          </div>

          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              icon={Save}
            >
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone: Account Deletion */}
      <Card className="p-6 border-rose-200 bg-rose-50/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-rose-700 font-display flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> Danger Zone
            </h3>
            <p className="text-xs text-slate-400">
              Permanently delete your account, trips, itineraries, and logged travel history.
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Account
          </Button>
        </div>
      </Card>

      {/* Account Deletion Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Permanently delete your account?"
        message="This action will delete your profile, all created trips, itinerary stops, and saved destinations. It cannot be recovered."
        confirmText="Yes, Delete My Account"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default SettingsPage
