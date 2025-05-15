// index.js
require('dotenv').config();
const express = require('express');
const app = express();

// JSON body parser
app.use(express.json());

// Simple CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Health-check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Mount routers
app.use('/api/cleanup', require('./api/cleanup-plantype'));
app.use('/api/chat',    require('./api/chat'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error handler:', err);
  res.status(500).json({ error: err.message });
});

// Start server on the correct port
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on 0.0.0.0:${PORT}`);
});
