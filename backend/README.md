# GlobeTrotter Backend — Personalized Travel Planning Platform API

## Overview
GlobeTrotter Backend is built with Node.js, Express.js, and Mongoose (MongoDB Atlas). It provides a full RESTful API for user authentication, travel trip management, multi-city itineraries, community posts, and budget tracking.

---

## Stage 1 — Foundation & Database

### Features Built in Stage 1
- **Express Server**: Configured with CORS, Helmet, rate limiting, and standard JSON parsers.
- **MongoDB Atlas / Mongoose Connection**: Modular database connection (`db.js`) with connection listeners and graceful shutdown handling.
- **Environment Configuration**: Environment variable validation and `.env.example` setup.
- **Centralized Error Handling**: Global error handling middleware supporting Mongoose validation, duplicate key, and JWT errors.
- **Swagger Documentation**: Interactive OpenAPI 3.0 UI available at `/api/v1/docs`.
- **Health Check Endpoint**: `GET /api/v1/health`.
- **Initial Mongoose Schemas**:
  - `User.js` (with pre-save password hashing and compare method)
  - `Trip.js` (with embedded stops, itinerary days, activities, budget & expenses)
  - `City.js` (with geo/popularity indexes)
  - `Activity.js` (with category and rating fields)
  - `CommunityPost.js` & `PublicTrip.js`

---

## Installation & Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection string:
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Verify API Status**:
   - Health Check: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)
   - Swagger Documentation: [http://localhost:5000/api/v1/docs](http://localhost:5000/api/v1/docs)

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health Check Endpoint |
| GET | `/api/v1/docs` | Swagger API Interactive Documentation |
