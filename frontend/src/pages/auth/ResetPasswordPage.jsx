import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { authService } from '@/services/authService'
import { Lock, CheckCircle2 } from 'lucide-react'
import { Button, Input, Card } from '@/components/common'

export function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    try {
      await authService.resetPassword(token, { password })
      setIsSuccess(true)
    } catch (err) {
      setErrorMessage(err.message || 'Reset link is invalid or has expired.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 sm:p-8 border-slate-200/90 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Create New Password</h2>
        <p className="text-xs text-slate-500 mt-1">Please choose a secure new password</p>
      </div>

      {isSuccess ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-600">
            Your password has been successfully reset.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="w-full mt-4"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Sign In with New Password
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            Update Password
          </Button>
        </form>
      )}
    </Card>
  )
}

export default ResetPasswordPage
