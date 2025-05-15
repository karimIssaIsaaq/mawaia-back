// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS global : autorise toutes les origines
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Si vous préférez gérer manuellement les en-têtes CORS : décommentez la partie ci-dessous
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  // Répondre directement aux requêtes OPTIONS (pré-flight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
*/

app.use(express.json());

// Vos routes (vérifiez bien que vous n’utilisez QUE des chemins relatifs, ex. '/mon-chemin')
const cleanupAPI = require('./api/cleanup-plantype');
const chatAPI    = require('./api/chat');
app.use('/cleanup', cleanupAPI);
app.use('/chat',     chatAPI);

app.get('/', (req, res) => {
  res.send('🌐 API Express opérationnelle avec CORS ouvert à tous');
});

// 404 pour les routes inconnues
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestionnaire d’erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`✅ Serveur actif sur http://localhost:${port}`);
});
