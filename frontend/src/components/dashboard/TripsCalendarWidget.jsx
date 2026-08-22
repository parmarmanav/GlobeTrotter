import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, formatDateRange, getDurationDays } from '@/utils/formatDate'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Plus,
  Compass,
} from 'lucide-react'
import { Card, Button, Badge } from '@/components/common'
import { ROUTES } from '@/constants/routes'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Color palettes for trip badges on calendar
const TRIP_COLORS = [
  { bg: 'bg-teal-500/15', text: 'text-teal-800', border: 'border-teal-300', dot: 'bg-teal-500' },
  { bg: 'bg-indigo-500/15', text: 'text-indigo-800', border: 'border-indigo-300', dot: 'bg-indigo-500' },
  { bg: 'bg-amber-500/15', text: 'text-amber-800', border: 'border-amber-300', dot: 'bg-amber-500' },
  { bg: 'bg-rose-500/15', text: 'text-rose-800', border: 'border-rose-300', dot: 'bg-rose-500' },
  { bg: 'bg-emerald-500/15', text: 'text-emerald-800', border: 'border-emerald-300', dot: 'bg-emerald-500' },
  { bg: 'bg-sky-500/15', text: 'text-sky-800', border: 'border-sky-300', dot: 'bg-sky-500' },
]

export function TripsCalendarWidget({ trips = [] }) {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Compute month days grid
  const { daysInMonth, startDayOfWeek, totalCells } = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const startDay = firstDay.getDay()
    const numDays = new Date(currentYear, currentMonth + 1, 0).getDate()
    return {
      daysInMonth: numDays,
      startDayOfWeek: startDay,
      totalCells: Math.ceil((startDay + numDays) / 7) * 7,
    }
  }, [currentYear, currentMonth])

  // Filter trips that have start & end dates
  const validTrips = useMemo(() => {
    return (Array.isArray(trips) ? trips : []).filter(
      (t) => t.startDate && t.endDate
    ).map((t, idx) => {
      const start = new Date(t.startDate)
      const end = new Date(t.endDate)
      const duration = getDurationDays(t.startDate, t.endDate)
      const color = TRIP_COLORS[idx % TRIP_COLORS.length]
      return {
        ...t,
        startDateObj: start,
        endDateObj: end,
        duration,
        color,
      }
    })
  }, [trips])

  // Find trips spanning a specific day
  const getTripsForDay = (day) => {
    const checkDate = new Date(currentYear, currentMonth, day)
    checkDate.setHours(0, 0, 0, 0)

    return validTrips.filter((t) => {
      const s = new Date(t.startDateObj)
      s.setHours(0, 0, 0, 0)
      const e = new Date(t.endDateObj)
      e.setHours(23, 59, 59, 999)
      return checkDate >= s && checkDate <= e
    })
  }

  // Trips active in current displayed month
  const monthTrips = useMemo(() => {
    const monthStart = new Date(currentYear, currentMonth, 1)
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

    return validTrips.filter((t) => {
      return t.startDateObj <= monthEnd && t.endDateObj >= monthStart
    })
  }, [validTrips, currentYear, currentMonth])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    setSelectedDate(null)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date().getDate())
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === day
    )
  }

  return (
    <Card className="p-5 sm:p-7 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              Trips & Schedule Calendar
              <Badge variant="primary" size="sm" className="font-semibold">
                {validTrips.length} {validTrips.length === 1 ? 'Trip' : 'Trips'} Scheduled
              </Badge>
            </h2>
            <p className="text-xs text-slate-500">
              Overview of all your planned journeys with their durations
            </p>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="text-xs text-teal-700 hover:bg-teal-50"
          >
            Today
          </Button>
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 min-w-[110px] text-center font-display">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Calendar on Left, Month Trips Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="text-[11px] font-bold text-slate-400 py-1 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: totalCells }).map((_, index) => {
              const dayNum = index - startDayOfWeek + 1
              const isValidDay = dayNum > 0 && dayNum <= daysInMonth

              if (!isValidDay) {
                return (
                  <div
                    key={index}
                    className="min-h-[70px] sm:min-h-[85px] rounded-xl bg-slate-50/50 border border-transparent p-1.5 opacity-30"
                  />
                )
              }

              const dayTrips = getTripsForDay(dayNum)
              const today = isToday(dayNum)
              const isSelected = selectedDate === dayNum

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(dayNum)}
                  className={`min-h-[70px] sm:min-h-[85px] rounded-xl border p-1.5 transition-all cursor-pointer flex flex-col justify-between ${
                    today
                      ? 'bg-teal-50/40 border-teal-400 ring-1 ring-teal-400/30'
                      : isSelected
                      ? 'bg-slate-100 border-slate-400 shadow-2xs'
                      : dayTrips.length > 0
                      ? 'bg-white border-slate-200 hover:border-teal-300 shadow-2xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                        today
                          ? 'bg-teal-600 text-white'
                          : isSelected
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayTrips.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    )}
                  </div>

                  {/* Trip badges inside the day cell */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayTrips.slice(0, 2).map((t) => (
                      <div
                        key={t._id || t.id}
                        className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate border ${t.color.bg} ${t.color.text} ${t.color.border}`}
                        title={`${t.name} (${t.duration} days)`}
                      >
                        {t.name}
                      </div>
                    ))}
                    {dayTrips.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-semibold pl-1">
                        +{dayTrips.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Sidebar: Active Month Trips & Duration List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {selectedDate
                  ? `Trips on ${MONTH_NAMES[currentMonth]} ${selectedDate}`
                  : `Trips in ${MONTH_NAMES[currentMonth]}`} ({selectedDate ? getTripsForDay(selectedDate).length : monthTrips.length})
              </h3>
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="text-[11px] font-semibold text-teal-600 hover:text-teal-800 cursor-pointer"
                >
                  Show all month
                </button>
              )}
            </div>

            {/* List of trips */}
            {(() => {
              const displayList = selectedDate ? getTripsForDay(selectedDate) : monthTrips

              if (displayList.length === 0) {
                return (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                    <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600">
                      {selectedDate
                        ? `No trips scheduled for ${MONTH_NAMES[currentMonth]} ${selectedDate}`
                        : `No trips scheduled for ${MONTH_NAMES[currentMonth]} ${currentYear}`}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Pick another month or start a new adventure.
                    </p>
                    <Link to={ROUTES.CREATE_TRIP} className="inline-block pt-1">
                      <Button size="xs" variant="primary" icon={Plus}>
                        Plan Trip
                      </Button>
                    </Link>
                  </div>
                )
              }

              return (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {displayList.map((t) => {
                    const tripId = t._id || t.id
                    const range = formatDateRange(t.startDate, t.endDate)
                    const stops = Array.isArray(t.stops) ? t.stops : []

                    return (
                      <div
                        key={tripId}
                        className={`p-3.5 rounded-2xl border transition-all ${t.color.bg} ${t.color.border} hover:shadow-xs`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`w-2 h-2 rounded-full ${t.color.dot}`} />
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/80 ${t.color.text}`}>
                                {t.duration} {t.duration === 1 ? 'Day' : 'Days'} Duration
                              </span>
                              <Badge variant="secondary" size="sm" className="text-[9px]">
                                {t.status || 'PLANNED'}
                              </Badge>
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {t.name}
                            </h4>

                            <p className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                              <CalendarIcon className="w-3 h-3 text-slate-400" />
                              {range}
                            </p>

                            {stops.length > 0 && (
                              <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                                <span>{stops.map((s) => s.cityName || s.cityId?.name).filter(Boolean).join(' → ')}</span>
                              </p>
                            )}
                          </div>

                          <Link
                            to={`/trips/${tripId}`}
                            className="p-1.5 rounded-xl bg-white text-slate-700 hover:text-teal-700 shadow-2xs hover:scale-105 transition-all shrink-0"
                            title="View Trip Details"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>

          {/* Quick Action Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link to={ROUTES.TRIPS} className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1">
              <span>View all my trips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to={ROUTES.CREATE_TRIP}>
              <Button size="xs" variant="outline" icon={Plus}>
                Add Trip
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TripsCalendarWidget
