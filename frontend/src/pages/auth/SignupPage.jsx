import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { Mail, Lock, User, MapPin, Eye, EyeOff, Globe, Phone } from 'lucide-react'
import { Button, Input, Card } from '@/components/common'

export function SignupPage() {
  const { register, isLoading } = useAuth()
  const { addToast } = useApp()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    city: '',
    country: '',
  })
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('Please provide your first and last name.')
      return
    }
    if (!formData.username.trim() || formData.username.trim().length < 3) {
      setErrorMessage('Username must be at least 3 characters.')
      return
    }
    if (!formData.email.trim()) {
      setErrorMessage('A valid email address is required.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      return
    }

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      username: formData.username.trim().toLowerCase(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phoneNumber: formData.phoneNumber.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
    }

    const result = await register(payload)
    if (result.success) {
      addToast({
        type: 'success',
        title: 'Account Created!',
        message: 'Welcome to GlobeTrotter! Start planning your trips.',
      })
      navigate(ROUTES.DASHBOARD, { replace: true })
    } else {
      setErrorMessage(result.message || 'Registration failed. Please check the fields.')
    }
  }

  return (
    <Card className="p-6 sm:p-8 border-slate-200/90 shadow-lg my-4 animate-in fade-in duration-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Create Account</h2>
        <p className="text-xs text-slate-500 mt-1">Join GlobeTrotter and plan trips smarter</p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name *"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            label="Last Name *"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Username *"
          name="username"
          placeholder="johndoe_travels"
          icon={User}
          value={formData.username}
          onChange={handleChange}
          required
        />

        <Input
          label="Email Address *"
          name="email"
          type="email"
          placeholder="john@example.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          placeholder="+1 (555) 000-0000"
          icon={Phone}
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City"
            name="city"
            placeholder="San Francisco"
            icon={MapPin}
            value={formData.city}
            onChange={handleChange}
          />
          <Input
            label="Country"
            name="country"
            placeholder="United States"
            icon={Globe}
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Password *"
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
              className="hover:text-slate-600 cursor-pointer p-1 text-slate-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <Input
          label="Confirm Password *"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-3"
          isLoading={isLoading}
        >
          Create Free Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-teal-600 hover:text-teal-700 font-bold">
          Sign In
        </Link>
      </div>
    </Card>
  )
}

export default SignupPage
