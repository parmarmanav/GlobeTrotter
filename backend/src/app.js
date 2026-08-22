const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config/env');
const setupSwagger = require('./config/swagger');
const errorHandler = require('./middlewares/error.middleware');
const ApiResponse = require('./utils/apiResponse');

// Import routes
const healthRoutes = require('./routes/health.routes');

const app = express();

// Security Middlewares
app.use(helmet());

app.use(
  cors({
    origin: config.clientUrl || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);

// Body Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Setup Swagger Documentation
setupSwagger(app);

// Mount API v1 Routes
app.use('/api/v1', healthRoutes);

// Handle 404 Not Found
app.use((req, res, next) => {
  return ApiResponse.error(res, `Route not found: ${req.originalUrl}`, 404);
});

// Centralized Error Handler Middleware
app.use(errorHandler);

module.exports = app;
