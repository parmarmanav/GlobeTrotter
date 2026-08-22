import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Compass, Sparkles, ShieldCheck, MapPin } from 'lucide-react'
import { ToastContainer } from '@/components/common/Toast'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left side: Premium Travel Presentation Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle Decorative Background Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="flex items-center gap-3 group inline-flex">
            <div className="w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-tight text-white">
                Globe<span className="text-teal-400">Trotter</span>
              </span>
              <p className="text-xs text-slate-400">Personalized Travel Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 space-y-8 my-auto max-w-md">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-tight text-white">
              Plan your dream journey with effortless precision.
            </h1>
            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              Design multi-city itineraries, organize day-by-day activities, track real-time budgets, and discover curated global experiences.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-teal-300">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Multi-City Sequencing</h4>
                <p className="text-xs text-slate-400">Seamlessly connect stops and map out transit effortlessly.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-orange-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dynamic Budget Breakdown</h4>
                <p className="text-xs text-slate-400">Monitor expenses per category, day, and stop in real-time.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial / Credential */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10">
          <span>&copy; {new Date().getFullYear()} GlobeTrotter SaaS</span>
          <span className="flex items-center gap-1.5 text-teal-400">
            <ShieldCheck className="w-4 h-4" /> 256-bit Secure TLS
          </span>
        </div>
      </div>

      {/* Right side: Auth Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Brand Link */}
          <div className="lg:hidden mb-8 text-center">
            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-display text-slate-900 tracking-tight">
                Globe<span className="text-teal-600">Trotter</span>
              </span>
            </Link>
          </div>

          <Outlet />
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}

export default AuthLayout
