import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, Button, Input } from '@/components/common'
import { Bell, Lock, Trash2 } from 'lucide-react'

export function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure preferences, security, and application notifications</p>
      </div>

      <Card className="p-6 space-y-4">
        <CardHeader className="border-none px-0 pt-0">
          <CardTitle>Travel Preferences</CardTitle>
          <CardDescription>Default currency, units, and notifications</CardDescription>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Default Currency" defaultValue="USD ($)" />
          <Input label="Default Language" defaultValue="English" />
        </div>
      </Card>

      <Card className="p-6 border-rose-100 bg-rose-50/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-rose-700 font-display">Danger Zone</h3>
            <p className="text-xs text-slate-600 mt-0.5">Permanently delete your account and all travel history</p>
          </div>
          <Button variant="danger" size="sm" icon={Trash2}>
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default SettingsPage
