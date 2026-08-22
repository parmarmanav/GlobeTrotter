/**
 * Form validation utility regexes and helpers
 */
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email)
}

export function isValidPassword(password) {
  // At least 6 characters
  return typeof password === 'string' && password.length >= 6
}
