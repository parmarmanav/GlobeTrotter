import React from 'react'
import { Card, CardHeader, CardTitle, Button } from '@/components/common'
import { Plus } from 'lucide-react'

export function AdminCitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white font-display">City Catalog Management</h1>
          <p className="text-xs text-slate-400">Add, edit, or categorize global destination records</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus}>
          Add New City
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 p-6">
        <div className="py-12 text-center text-xs text-slate-500">
          City catalog editor will load from backend API.
        </div>
      </Card>
    </div>
  )
}

export default AdminCitiesPage
