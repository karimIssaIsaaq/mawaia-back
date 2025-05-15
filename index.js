const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
console.log("serverrrrrrrrr okokokokokokokok")
const allowedOrigins = ['https://mawa-webapp.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("calllllbackkkkkk",origin)
    // Autoriser si origine est absente (Postman) ou dans la whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('⛔ Accès interdit par CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204 // Répond bien au preflight
};

// CORS middleware
app.use(cors(corsOptions));

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
