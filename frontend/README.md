# GlobeTrotter Frontend

Empowering Personalized Travel Planning — React SaaS Client.

## Tech Stack
- **React.js 19** + **Vite 6**
- **React Router DOM v7**
- **Tailwind CSS v4**
- **Axios** (Centralized API Client with interceptors & JWT)
- **Lucide React** (Modern iconography)
- **React Hook Form**
- **Recharts**
- **Context API** (`AuthContext`, `AppContext`)

## Project Architecture
```text
src/
├── api/          # Axios instance and centralized endpoints
├── components/   # Reusable UI system (Button, Modal, Drawer, etc.) & Layouts
├── constants/    # Routes, Categories, Trip Statuses
├── context/      # AuthContext & AppContext
├── hooks/        # Custom hooks (useAuth, useTrips, useDebounce, etc.)
├── layouts/      # MainLayout, AuthLayout, AdminLayout
├── pages/        # Authentication, Dashboard, Trips, Discovery, Community, Profile, Admin
├── routes/       # ProtectedRoute, AdminRoute, AppRoutes
├── services/     # Centralized domain services (tripService, cityService, etc.)
├── styles/       # Tailwind CSS v4 and typography
└── utils/        # Date, currency, validation and storage helpers
```

## Running the Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
