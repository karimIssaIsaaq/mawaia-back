const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
const cleanupAPI = require('./api/cleanup-plantype');
app.use('/', cleanupAPI);

// Default route
app.get('/', (req, res) => {
  res.send('🌐 API Express opérationnelle');
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`✅ Serveur actif sur http://localhost:${port}`);
});
