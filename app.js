const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ['https://mawa-webapp.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser uniquement si l'origine est dans la whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('⛔ Accès interdit par CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Routes
const cleanupAPI = require('./api/cleanup-plantype');
const chatAPI = require('./api/chat');

app.use('/', cleanupAPI);
app.use('/', chatAPI);

app.get('/', (req, res) => res.send('🌐 API Express opérationnelle'));

app.listen(port, () => {
  console.log(`✅ Serveur actif sur http://localhost:${port}`);
});
