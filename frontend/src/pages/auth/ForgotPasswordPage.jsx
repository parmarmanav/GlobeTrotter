import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { authService } from '@/services/authService'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button, Input, Card } from '@/components/common'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setErrorMessage('Please provide your email address.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    try {
      await authService.forgotPassword({ email })
      setIsSent(true)
    } catch (err) {
      setErrorMessage(err.message || 'Unable to send password reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 sm:p-8 border-slate-200/90 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Reset Password</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your email and we'll send a recovery link
        </p>
      </div>

      {isSent ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            If an account exists for <strong className="text-slate-900">{email}</strong>, you will receive password reset instructions shortly.
          </p>
          <Link to={ROUTES.LOGIN} className="block mt-4">
            <Button variant="outline" size="sm" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <Input
            label="Email Address"
            id="email"
            type="email"
            placeholder="traveler@globetrotter.io"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>

          <div className="text-center pt-2">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </Card>
  )
}

export default ForgotPasswordPage
