import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '@/services/authService'
import { storage } from '@/utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser())
  const [token, setToken] = useState(() => storage.getToken())
  const [isLoading, setIsLoading] = useState(true)

  // Verify and refresh user info on initial mount
  const refreshUser = useCallback(async () => {
    const storedToken = storage.getToken()
    if (!storedToken) {
      setUser(null)
      setToken(null)
      setIsLoading(false)
      return
    }

    try {
      const response = await authService.getCurrentUser()
      if (response && response.data) {
        setUser(response.data)
        storage.setUser(response.data)
      }
    } catch (err) {
      console.warn('Failed to verify existing session:', err?.message)
      storage.clear()
      setUser(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()

    // Listen for unauthorized 401 events dispatched by axios interceptor
    const handleUnauthorized = () => {
      setUser(null)
      setToken(null)
      storage.clear()
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [refreshUser])

  const login = async (credentials) => {
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)
      const data = response.data || response
      const authToken = data.token || data.accessToken
      const authUser = data.user || data

      if (authToken) {
        setToken(authToken)
        storage.setToken(authToken)
      }
      if (authUser) {
        setUser(authUser)
        storage.setUser(authUser)
      }
      return { success: true, user: authUser, token: authToken }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed. Please check your credentials.',
        errors: error.errors,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    try {
      const response = await authService.register(userData)
      const data = response.data || response
      const authToken = data.token || data.accessToken
      const authUser = data.user || data

      if (authToken) {
        setToken(authToken)
        storage.setToken(authToken)
      }
      if (authUser) {
        setUser(authUser)
        storage.setUser(authUser)
      }
      return { success: true, user: authUser, token: authToken }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed. Please check your details.',
        errors: error.errors,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout().catch(() => {})
    } finally {
      storage.clear()
      setUser(null)
      setToken(null)
      setIsLoading(false)
    }
  }

  const isAuthenticated = Boolean(token && user)
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
