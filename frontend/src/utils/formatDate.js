/**
 * Format a date string or object into a human-readable date.
 * @param {string|Date} date 
 * @param {Intl.DateTimeFormatOptions} options 
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(d)
}

/**
 * Format date range into "Oct 12 - Oct 18, 2025" or "Oct 28 - Nov 4, 2025"
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate) return ''
  if (!endDate) return formatDate(startDate)

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return ''

  const sameYear = start.getFullYear() === end.getFullYear()
  const sameMonth = sameYear && start.getMonth() === end.getMonth()

  if (sameMonth) {
    return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`
  } else if (sameYear) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`
  } else {
    return `${formatDate(start)} - ${formatDate(end)}`
  }
}

/**
 * Calculate duration in days between two dates
 */
export function getDurationDays(startDate, endDate) {
  if (!startDate || !endDate) return 1
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1
}
