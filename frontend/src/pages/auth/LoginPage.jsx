import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button, Input, Card } from '@/components/common'

export function LoginPage() {
  const { login, isLoading } = useAuth()
  const { addToast } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ identifier: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.identifier || !formData.password) {
      const msg = 'Please enter your email/username and password.'
      setErrorMessage(msg)
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: msg,
      })
      return
    }

    const payload = {
      identifier: formData.identifier.trim(),
      email: formData.identifier.trim(),
      password: formData.password,
    }

    const result = await login(payload)
    if (result.success) {
      addToast({
        type: 'success',
        title: 'Welcome Back!',
        message: 'You have signed in successfully.',
      })
      navigate(from, { replace: true })
    } else {
      const errMsg = result.message || 'Invalid email or password. Please try again.'
      setErrorMessage(errMsg)
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: errMsg,
      })
    }
  }

  return (
    <Card className="p-6 sm:p-8 bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl animate-in fade-in duration-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white font-display">Welcome Back</h2>
        <p className="text-xs text-slate-400 mt-1">Sign in to continue planning your journeys</p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email or Username"
          id="identifier"
          name="identifier"
          type="text"
          placeholder="traveler@globetrotter.io"
          icon={Mail}
          value={formData.identifier}
          onChange={handleChange}
          required
        />

        <div>
          <Input
            label="Password"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            required
            iconRight={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-200 cursor-pointer p-1 text-slate-400 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-3 min-h-[44px]"
          isLoading={isLoading}
          iconRight={ArrowRight}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to={ROUTES.SIGNUP} className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
          Create Account
        </Link>
      </div>
    </Card>
  )
}

export default LoginPage
