// index.js
require('dotenv').config();
const express = require('express');
const app = express();

// JSON body parser
app.use(express.json());


// Health-check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Mount routers
app.use('/api/cleanup', require('./api/cleanup-plantype'));
app.use('/api/chat',    require('./api/chat'));



// Start server on the correct port
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on 0.0.0.0:${PORT}`);
});
