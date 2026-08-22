import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Footer } from '@/components/layout/Footer'
import { Drawer } from '@/components/common/Drawer'
import { ToastContainer } from '@/components/common/Toast'

export function MainLayout() {
  const { isAuthenticated } = useAuth()
  const { sidebarOpen, closeSidebar } = useApp()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (Only for authenticated users) */}
        {isAuthenticated && (
          <Sidebar className="hidden lg:flex" />
        )}

        {/* Mobile Sidebar Drawer */}
        {isAuthenticated && (
          <Drawer
            isOpen={sidebarOpen}
            onClose={closeSidebar}
            title="GlobeTrotter Navigation"
            position="left"
            size="max-w-xs"
          >
            <Sidebar className="w-full border-none p-0" />
          </Drawer>
        )}

        {/* Dynamic Content Area */}
        <main className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

export default MainLayout
