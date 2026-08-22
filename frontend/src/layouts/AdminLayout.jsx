import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { ROUTES } from '@/constants/routes'
import { Compass, Shield, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Avatar } from '@/components/common/Avatar'
import { Badge } from '@/components/common/Badge'
import { ToastContainer } from '@/components/common/Toast'

export function AdminLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Admin Desktop Sidebar */}
      <AdminSidebar className="hidden md:flex" />

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Admin Top Header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={ROUTES.ADMIN} className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
            </Link>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400" />
              GlobeTrotter Admin Console
            </h1>
            <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
              ADMIN MODE
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar
                src={user?.avatar}
                name={user?.name || user?.username || 'Admin'}
                size="sm"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-none">
                  {user?.name || user?.username || 'Admin User'}
                </p>
                <p className="text-[10px] text-teal-400 font-mono mt-0.5">Role: {user?.role || 'Admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}

export default AdminLayout
