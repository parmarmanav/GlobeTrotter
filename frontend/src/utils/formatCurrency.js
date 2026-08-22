/**
 * Format a number to currency format (USD by default or custom currency)
 * @param {number} amount 
 * @param {string} currencyCode 
 * @returns {string}
 */
export function formatCurrency(amount = 0, currencyCode = 'USD') {
  const numericAmount = Number(amount) || 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount)
}

/**
 * Format number to compact currency format (e.g. $1.2k)
 */
export function formatCompactCurrency(amount = 0, currencyCode = 'USD') {
  const numericAmount = Number(amount) || 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(numericAmount)
}
