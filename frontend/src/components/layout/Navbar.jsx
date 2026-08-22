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
  Sun,
  Moon,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Avatar } from '@/components/common/Avatar'
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/common/Dropdown'

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { toggleSidebar, theme, toggleTheme } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <header className="sticky top-0 z-40 w-full dark-glass-panel border-b border-[var(--color-border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Mobile Menu Button */}
        <div className="flex items-center gap-3 min-w-0">
          {isAuthenticated && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-slate-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} className="flex items-center gap-2.5 group min-w-0 hover-lift">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold font-display text-slate-100 tracking-tight leading-none group-hover:text-indigo-400 transition-colors truncate-safe">
                Globe<span className="text-indigo-500">Trotter</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase truncate-safe">
                Travel Planner
              </span>
            </div>
          </Link>
        </div>



        {/* Right: Actions / Auth / Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center border border-slate-700/40 hover-lift"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              <Link to={ROUTES.CREATE_TRIP} className="hidden sm:inline-flex">
                <Button size="sm" variant="primary" icon={Plus} className="shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow">
                  Plan Trip
                </Button>
              </Link>

              {/* Profile Dropdown */}
              <Dropdown
                align="right"
                trigger={
                  <div className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] justify-center cursor-pointer">
                    <Avatar
                      src={user?.avatar || user?.profileImage}
                      name={user?.name || user?.username || 'User'}
                      size="sm"
                    />
                  </div>
                }
              >
                <div className="px-3.5 py-2.5 border-b border-slate-700 bg-slate-900 rounded-t-lg">
                  <p className="text-xs font-semibold text-slate-200 truncate-safe">
                    {user?.name || user?.username || 'Traveler'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate-safe">{user?.email}</p>
                </div>
                
                <div className="bg-slate-800 rounded-b-lg overflow-hidden">
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
                      <DropdownDivider className="border-slate-700" />
                      <DropdownItem
                        icon={Shield}
                        onClick={() => navigate(ROUTES.ADMIN)}
                      >
                        Admin Dashboard
                      </DropdownItem>
                    </>
                  )}

                  <DropdownDivider className="border-slate-700" />
                  <DropdownItem
                    icon={LogOut}
                    destructive
                    onClick={handleLogout}
                  >
                    Sign Out
                  </DropdownItem>
                </div>
              </Dropdown>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800 min-h-[44px]">
                  Sign In
                </Button>
              </Link>
              <Link to={ROUTES.SIGNUP}>
                <Button variant="primary" size="sm" className="min-h-[44px]">
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
