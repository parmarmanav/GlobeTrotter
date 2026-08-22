export const TRIP_STATUS = {
  PLANNING: 'planning',
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const TRIP_STATUS_LABELS = {
  [TRIP_STATUS.PLANNING]: 'Planning',
  [TRIP_STATUS.UPCOMING]: 'Upcoming',
  [TRIP_STATUS.ONGOING]: 'Ongoing',
  [TRIP_STATUS.COMPLETED]: 'Completed',
  [TRIP_STATUS.CANCELLED]: 'Cancelled',
}

export const TRIP_STATUS_COLORS = {
  [TRIP_STATUS.PLANNING]: 'bg-slate-100 text-slate-700 border-slate-200',
  [TRIP_STATUS.UPCOMING]: 'bg-sky-50 text-sky-700 border-sky-200',
  [TRIP_STATUS.ONGOING]: 'bg-teal-50 text-teal-700 border-teal-200',
  [TRIP_STATUS.COMPLETED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [TRIP_STATUS.CANCELLED]: 'bg-rose-50 text-rose-700 border-rose-200',
}
