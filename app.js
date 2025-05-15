// index.js
require('dotenv').config();
const express = require('express');
// Catch synchronous errors
process.on('uncaughtException', err => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});
// Catch promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

const app = express();

// Simple CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// JSON body parser
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.originalUrl}`);
  next();
});

// Health-check endpoint
app.get('/health', (req, res) => res.json({ status: 'UP' }));

// Try mounting cleanup router
try {
  const cleanupAPI = require('./api/cleanup-plantype');
  app.use('/api/cleanup', cleanupAPI);
  console.log('✅ cleanup-plantype router mounted');
} catch (err) {
  console.error('❌ Error mounting cleanup-plantype:', err);
}

// Try mounting chat router
try {
  const chatAPI = require('./api/chat');
  app.use('/api/chat', chatAPI);
  console.log('✅ chat router mounted');
} catch (err) {
  console.error('❌ Error mounting chat:', err);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err);
  res.status(500).json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on 0.0.0.0:${PORT}`);
});
