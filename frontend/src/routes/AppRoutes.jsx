import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

// Layouts
import { MainLayout } from '@/layouts/MainLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Guards
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { AdminRoute } from '@/routes/AdminRoute'
import { PublicRoute } from '@/routes/PublicRoute'

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'

// Dashboard & Core App
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { TripsListPage } from '@/pages/trips/TripsListPage'
import { CreateTripPage } from '@/pages/trips/CreateTripPage'
import { TripDetailsPage } from '@/pages/trips/TripDetailsPage'
import { ItineraryBuilderPage } from '@/pages/trips/ItineraryBuilderPage'
import { BudgetPage } from '@/pages/trips/BudgetPage'
import { CalendarPage } from '@/pages/trips/CalendarPage'

// Discovery
import { ExplorePage } from '@/pages/discovery/ExplorePage'
import { CityDetailsPage } from '@/pages/discovery/CityDetailsPage'
import { ActivitiesPage } from '@/pages/discovery/ActivitiesPage'
import { ActivityDetailsPage } from '@/pages/discovery/ActivityDetailsPage'

// Community & Sharing
import { CommunityPage } from '@/pages/community/CommunityPage'
import { PostDetailsPage } from '@/pages/community/PostDetailsPage'
import { PublicTripPage } from '@/pages/community/PublicTripPage'

// Profile & Settings
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { SettingsPage } from '@/pages/profile/SettingsPage'
import { SavedDestinationsPage } from '@/pages/profile/SavedDestinationsPage'

// Admin Pages
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminTripsPage } from '@/pages/admin/AdminTripsPage'
import { AdminCitiesPage } from '@/pages/admin/AdminCitiesPage'
import { AdminActivitiesPage } from '@/pages/admin/AdminActivitiesPage'

// 404
import { NotFoundPage } from '@/pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>

      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        {/* Default Home redirect to dashboard if auth or explore */}
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* Discovery & Community (Accessible to all / protected actions handled internally) */}
        <Route path={ROUTES.EXPLORE} element={<ExplorePage />} />
        <Route path={ROUTES.CITIES} element={<ExplorePage />} />
        <Route path={ROUTES.CITY_DETAILS} element={<CityDetailsPage />} />
        <Route path={ROUTES.ACTIVITIES} element={<ActivitiesPage />} />
        <Route path={ROUTES.ACTIVITY_DETAILS} element={<ActivityDetailsPage />} />
        <Route path={ROUTES.COMMUNITY} element={<CommunityPage />} />
        <Route path={ROUTES.POST_DETAILS} element={<PostDetailsPage />} />
        <Route path={ROUTES.PUBLIC_TRIP} element={<PublicTripPage />} />

        {/* Protected User Routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TRIPS}
          element={
            <ProtectedRoute>
              <TripsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CREATE_TRIP}
          element={
            <ProtectedRoute>
              <CreateTripPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TRIP_DETAILS}
          element={
            <ProtectedRoute>
              <TripDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TRIP_ITINERARY}
          element={
            <ProtectedRoute>
              <ItineraryBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TRIP_BUDGET}
          element={
            <ProtectedRoute>
              <BudgetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TRIP_CALENDAR}
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SAVED_DESTINATIONS}
          element={
            <ProtectedRoute>
              <SavedDestinationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path={ROUTES.ADMIN} element={<Navigate to={ROUTES.ADMIN_ANALYTICS} replace />} />
        <Route path={ROUTES.ADMIN_ANALYTICS} element={<AdminAnalyticsPage />} />
        <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
        <Route path={ROUTES.ADMIN_TRIPS} element={<AdminTripsPage />} />
        <Route path={ROUTES.ADMIN_CITIES} element={<AdminCitiesPage />} />
        <Route path={ROUTES.ADMIN_ACTIVITIES} element={<AdminActivitiesPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
