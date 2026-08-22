import React from 'react'
import { Card, CardHeader, CardTitle } from '@/components/common'

export function AdminTripsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white font-display">Trip Moderation & Analytics</h1>
        <p className="text-xs text-slate-400">Inspect system-wide trips, published public itineraries, and engagement</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 p-6">
        <div className="py-12 text-center text-xs text-slate-500">
          Trip records loaded from backend will render here.
        </div>
      </Card>
    </div>
  )
}

export default AdminTripsPage
