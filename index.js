// server.js
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 1) Parse JSON bodies
app.use(express.json());

// 2) Manual CORS headers — runs on every request, before your routers
app.use((req, res, next) => {
  // 🌍 allow any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  // which methods you want to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  // which headers the client can send
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  // immediately answer OPTIONS (preflight) requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 3) Mount your actual API routers
const cleanupAPI = require('./api/cleanup-plantype');
const chatAPI    = require('./api/chat');

// make sure your routers only use **relative** paths, e.g. '/do-stuff'
app.use('/api/cleanup', cleanupAPI);
app.use('/api/chat',    chatAPI);

app.get('/', (req, res) => {
  res.send('🌐 API Express opérationnelle (CORS ouvert à tous)');
});

// 4) 404 + error handlers
app.use((req, res) => res.status(404).json({ error: 'Route non trouvée' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`✅ Serveur actif sur http://localhost:${port}`);
});
