const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// ✅ Configuration CORS
const allowedOrigins = ['https://mawa-webapp.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));

app.options('*', cors()); // Gérer les pré-requêtes

// Middleware
app.use(express.json());

// Routes
const cleanupAPI = require('./api/cleanup-plantype');
app.use('/', cleanupAPI);

const chatAPI = require('./api/chat');
app.use('/', cleanupAPI);

// Default route
app.get('/', (req, res) => {
  res.send('🌐 API Express opérationnelle');
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`✅ Serveur actif sur http://localhost:${port}`);
});
