import React from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import {
  LayoutDashboard,
  Map,
  Compass,
  Sparkles,
  Users,
  Bookmark,
  PlusCircle,
  Settings,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const navigationItems = [
  { name: 'Dashboard', to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: 'My Trips', to: ROUTES.TRIPS, icon: Map },
  { name: 'Destinations', to: ROUTES.EXPLORE, icon: Compass },
  { name: 'Community', to: ROUTES.COMMUNITY, icon: Users },
  { name: 'Saved', to: ROUTES.SAVED_DESTINATIONS, icon: Bookmark },
]

export function Sidebar({ className }) {
  return (
    <aside
      className={cn(
        'w-64 bg-[var(--color-card)] border-r border-[var(--color-border-subtle)] flex flex-col justify-between p-4 shrink-0 transition-colors',
        className
      )}
    >
      <div className="space-y-6 flex flex-col min-w-0">
        {/* Quick Action */}
        <NavLink
          to={ROUTES.CREATE_TRIP}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-xs shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/40 transition-all duration-200 active:scale-95 min-h-[44px]"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span className="truncate-safe">New Trip Plan</span>
        </NavLink>

        {/* Main Navigation */}
        <div className="space-y-1 min-w-0 flex flex-col">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Menu
          </p>
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
               <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold transition-all duration-200 min-h-[44px] min-w-0',
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 shadow-inner'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:translate-x-1'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate-safe">{item.name}</span>
              </NavLink>
            )
          })}
        </div>
      </div>

      {/* Footer / Settings in Sidebar */}
      <div className="space-y-1 pt-4 border-t border-slate-800 min-w-0 flex flex-col">
        <NavLink
          to={ROUTES.SETTINGS}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-medium transition-all duration-200 min-h-[44px] min-w-0',
              isActive
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300 hover:translate-x-1'
            )
          }
        >
          <Settings className="w-4 h-4 shrink-0 text-slate-400" />
          <span className="truncate-safe">Settings</span>
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar
