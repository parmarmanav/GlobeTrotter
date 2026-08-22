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
        'w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 shrink-0',
        className
      )}
    >
      <div className="space-y-6">
        {/* Quick Action */}
        <NavLink
          to={ROUTES.CREATE_TRIP}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium text-xs shadow-xs transition-all duration-150 active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Trip Plan</span>
        </NavLink>

        {/* Main Navigation */}
        <div className="space-y-1">
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
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-teal-50 text-teal-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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

      {/* Footer / Settings in Sidebar */}
      <div className="space-y-1 pt-4 border-t border-slate-100">
        <NavLink
          to={ROUTES.SETTINGS}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors',
              isActive
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            )
          }
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar
