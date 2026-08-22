import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Compass, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-teal-600 flex items-center justify-center text-white">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-800 font-display">GlobeTrotter</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to={ROUTES.EXPLORE} className="hover:text-teal-600 transition-colors">
            Destinations
          </Link>
          <Link to={ROUTES.ACTIVITIES} className="hover:text-teal-600 transition-colors">
            Activities
          </Link>
          <Link to={ROUTES.COMMUNITY} className="hover:text-teal-600 transition-colors">
            Community
          </Link>
          <Link to={ROUTES.SETTINGS} className="hover:text-teal-600 transition-colors">
            Privacy & Terms
          </Link>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <span>Empowering personalized journeys with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
