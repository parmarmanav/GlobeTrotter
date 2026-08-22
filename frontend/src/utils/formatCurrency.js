/**
 * Format a number to INR currency format (₹) with Indian numbering format (e.g. ₹45,000)
 * @param {number} amount 
 * @param {string} _currencyCode - Ignored, locked to INR
 * @returns {string}
 */
export function formatCurrency(amount = 0, _currencyCode = 'INR') {
  const numericAmount = Number(amount) || 0
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount)
}

/**
 * Format number to compact INR currency format (e.g. ₹1.2L or ₹45K)
 */
export function formatCompactCurrency(amount = 0, _currencyCode = 'INR') {
  const numericAmount = Number(amount) || 0
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(numericAmount)
}

export default formatCurrency
