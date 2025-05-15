// index.js
require('dotenv').config();
const express = require('express');
const app = express();

// 1) CORS très simple
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

// 2) JSON parser + logger
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.originalUrl}`);
  next();
});

// 3) Health-check
app.get('/health', (req, res) => res.json({ status: 'UP' }));

// 4) Vos routers
app.use('/api/cleanup', require('./api/cleanup-plantype'));
app.use('/api/chat',    require('./api/chat'));

// 5) 404 + error handler
app.use((req, res) => res.status(404).json({ error: 'Route non trouvée' }));
app.use((err, req, res, next) => {
  console.error('❌ Error handler:', err);
  res.status(500).json({ error: err.message });
});

// 6) Démarre sur le bon port & interface
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on 0.0.0.0:${PORT}`);
});
