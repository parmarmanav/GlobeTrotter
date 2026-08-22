import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import {
  Compass,
  Menu,
  Plus,
  Search,
  Bell,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Shield,
  Bookmark,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Avatar } from '@/components/common/Avatar'
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/common/Dropdown'

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { toggleSidebar } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-display text-slate-900 tracking-tight leading-none group-hover:text-teal-700 transition-colors">
                Globe<span className="text-teal-600">Trotter</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Travel Planner
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to={ROUTES.EXPLORE}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              location.pathname.startsWith('/explore') || location.pathname.startsWith('/cities')
                ? 'text-teal-700 bg-teal-50/70'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Destinations
          </Link>
          <Link
            to={ROUTES.ACTIVITIES}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              location.pathname.startsWith('/activities')
                ? 'text-teal-700 bg-teal-50/70'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Activities
          </Link>
          <Link
            to={ROUTES.COMMUNITY}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              location.pathname.startsWith('/community')
                ? 'text-teal-700 bg-teal-50/70'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Community
          </Link>
        </nav>

        {/* Right: Actions / Auth / Profile */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.CREATE_TRIP} className="hidden sm:inline-flex">
                <Button size="sm" variant="primary" icon={Plus}>
                  Plan Trip
                </Button>
              </Link>

              {/* Profile Dropdown */}
              <Dropdown
                align="right"
                trigger={
                  <div className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors">
                    <Avatar
                      src={user?.avatar || user?.profileImage}
                      name={user?.name || user?.username || 'User'}
                      size="sm"
                    />
                  </div>
                }
              >
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {user?.name || user?.username || 'Traveler'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>

                <DropdownItem
                  icon={UserIcon}
                  onClick={() => navigate(ROUTES.PROFILE)}
                >
                  My Profile
                </DropdownItem>
                <DropdownItem
                  icon={Bookmark}
                  onClick={() => navigate(ROUTES.SAVED_DESTINATIONS)}
                >
                  Saved Destinations
                </DropdownItem>
                <DropdownItem
                  icon={SettingsIcon}
                  onClick={() => navigate(ROUTES.SETTINGS)}
                >
                  Settings
                </DropdownItem>

                {isAdmin && (
                  <>
                    <DropdownDivider />
                    <DropdownItem
                      icon={Shield}
                      onClick={() => navigate(ROUTES.ADMIN)}
                    >
                      Admin Dashboard
                    </DropdownItem>
                  </>
                )}

                <DropdownDivider />
                <DropdownItem
                  icon={LogOut}
                  destructive
                  onClick={handleLogout}
                >
                  Sign Out
                </DropdownItem>
              </Dropdown>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to={ROUTES.SIGNUP}>
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
