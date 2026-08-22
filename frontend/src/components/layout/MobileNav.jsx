import React from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard,
  Map,
  Compass,
  Users,
  User,
  LogIn,
} from 'lucide-react'
import { cn } from '@/utils/cn'

export function MobileNav() {
  const { isAuthenticated } = useAuth()

  const navItems = isAuthenticated
    ? [
        { name: 'Dashboard', to: ROUTES.DASHBOARD, icon: LayoutDashboard },
        { name: 'My Trips', to: ROUTES.TRIPS, icon: Map },
        { name: 'Explore', to: ROUTES.EXPLORE, icon: Compass },
        { name: 'Community', to: ROUTES.COMMUNITY, icon: Users },
        { name: 'Profile', to: ROUTES.PROFILE, icon: User },
      ]
    : [
        { name: 'Explore', to: ROUTES.EXPLORE, icon: Compass },
        { name: 'Community', to: ROUTES.COMMUNITY, icon: Users },
        { name: 'Sign In', to: ROUTES.LOGIN, icon: LogIn },
      ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-card)]/95 backdrop-blur-md border-t border-[var(--color-border-subtle)]/80 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors',
                  isActive
                    ? 'text-indigo-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                )
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default MobileNav
