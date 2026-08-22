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
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 relative selection:bg-indigo-500 selection:text-white">
      {/* Subtle Ambient Background Gradients */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

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
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full min-w-0">
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
