// index.js
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 1) Manual CORS middleware — doit être le tout premier app.use()
app.use((req, res, next) => {
  // Autorise toutes les origines
  res.setHeader('Access-Control-Allow-Origin', '*');
  // En-têtes autorisés
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  // Méthodes autorisées
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  // Répondre directement aux OPTIONS (pré-flight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// 2) JSON body parser
app.use(express.json());

// 3) Monte vos routes (relatives !)
app.use('/api/cleanup', require('./api/cleanup-plantype'));
app.use('/api/chat',    require('./api/chat'));

// 4) Root & gestion d’erreurs
app.get('/', (req, res) => {
  res.send('✅ API Express opérationnelle (CORS ouvert)');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// 5) Lancement du serveur
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
