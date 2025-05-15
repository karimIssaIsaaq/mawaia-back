// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 1) Ouvre CORS pour **toutes** les origines / méthodes / headers
app.use(cors());

// 2) Parse automatiquement les JSON
app.use(express.json());

// 3) Monte vos routers :
//    - Assurez-vous d’avoir ./api/cleanup-plantype.js et ./api/chat.js
app.use('/api/cleanup', require('./api/cleanup-plantype'));
app.use('/api/chat',    require('./api/chat'));

// 4) Route racine pour vérifier que le serveur tourne
app.get('/', (req, res) => {
  res.send('✅ API Express opérationnelle (CORS ouvert)');
});

// 5) 404 + Error handler
app.use((req, res) => res.status(404).json({ error: 'Route non trouvée' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// 6) Lancement
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
