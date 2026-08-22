import React from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import {
  BarChart3,
  Users,
  Map,
  Building2,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const adminNav = [
  { name: 'Analytics Overview', to: ROUTES.ADMIN_ANALYTICS, icon: BarChart3 },
  { name: 'User Management', to: ROUTES.ADMIN_USERS, icon: Users },
  { name: 'Trip Management', to: ROUTES.ADMIN_TRIPS, icon: Map },
  { name: 'City Management', to: ROUTES.ADMIN_CITIES, icon: Building2 },
  { name: 'Activity Management', to: ROUTES.ADMIN_ACTIVITIES, icon: Sparkles },
]

export function AdminSidebar({ className }) {
  return (
    <aside
      className={cn(
        'w-64 bg-slate-900 text-slate-100 flex flex-col justify-between p-4 shrink-0',
        className
      )}
    >
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Control Panel
            </p>
            <p className="text-[10px] text-slate-400 truncate">Administrator Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            System Administration
          </p>
          {adminNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-md'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </div>
      </div>

      {/* Return to App */}
      <div className="pt-4 border-t border-slate-800">
        <NavLink
          to={ROUTES.DASHBOARD}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to GlobeTrotter</span>
        </NavLink>
      </div>
    </aside>
  )
}

export default AdminSidebar
