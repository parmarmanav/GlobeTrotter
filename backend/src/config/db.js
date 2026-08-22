const mongoose = require('mongoose');
const dns = require('node:dns');
const config = require('./env');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if not permitted
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] MongoDB connection event error: ${err.message}`);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('[Database] Mongoose connection disconnected through app termination (SIGINT)');
  process.exit(0);
});

module.exports = connectDB;
