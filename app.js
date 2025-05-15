// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 1) CORS simplissime
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

// 2) JSON parser
app.use(express.json());

// 3) Route de test
app.get('/test', (req, res) => {
  res.json({ message: '🔥 Serveur minimal opérationnel' });
});

// 4) Démarrage
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
