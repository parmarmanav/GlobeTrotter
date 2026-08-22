const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err);
  process.exit(1);
});

// Connect Database and Start Server
const startServer = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`[Server] GlobeTrotter API server running in ${config.env} mode on port ${config.port}`);
    console.log(`[Server] Health Check: http://localhost:${config.port}/api/v1/health`);
    console.log(`[Server] API Docs: http://localhost:${config.port}/api/v1/docs`);
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    console.error('[Process] Unhandled Rejection:', err);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
