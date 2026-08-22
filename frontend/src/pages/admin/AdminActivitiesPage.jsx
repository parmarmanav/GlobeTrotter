import React from 'react'
import { Card, CardHeader, CardTitle, Button } from '@/components/common'
import { Plus } from 'lucide-react'

export function AdminActivitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white font-display">Activity Catalog Management</h1>
          <p className="text-xs text-slate-400">Curate tours, sightseeing spots, culinary events, and tickets</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus}>
          Add New Activity
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 p-6">
        <div className="py-12 text-center text-xs text-slate-500">
          Activity catalog tools will connect to backend API.
        </div>
      </Card>
    </div>
  )
}

export default AdminActivitiesPage
