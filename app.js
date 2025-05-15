// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 1) Active CORS pour toutes les origines, toutes méthodes, tous headers


// 2) Parse JSON
app.use(express.json());

// 3) Vos routes (utilisez bien des chemins relatifs dans vos fichiers de route)
const cleanupAPI = require('./api/cleanup-plantype');
const chatAPI = require('./api/chat');

app.use('/api/cleanup', cleanupAPI);
app.use('/api/chat', chatAPI);

// 4) Root + gestion 404/500
app.get('/', (req, res) => res.send('🌐 API Express opérationnelle'));


// 5) Démarrage
app.listen(port, () => {
  console.log(`✅ Serveur actif sur http://localhost:${port}`);
});
