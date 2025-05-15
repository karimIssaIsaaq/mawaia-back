const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

router.get('/api/cleanup', async (req, res) => {
  const { email, planType } = req.query;

  if (!email || !planType) {
    return res.status(400).json({ error: 'Paramètres manquants : email et planType requis.' });
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_TABLE } = process.env;
  const rollingDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let cleaned = 0;

  try {
    // Étape 1 : récupérer les enregistrements à mettre à jour
    const getUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?select=id&email=eq.${encodeURIComponent(email)}&created_at=gt.${rollingDate}&planType=not.eq.${encodeURIComponent(planType)}`;

    const getRes = await fetch(getUrl, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!getRes.ok) throw new Error(`Erreur récupération : ${getRes.statusText}`);
    const records = await getRes.json();

    // Étape 2 : mettre à jour chaque record
    for (const { id } of records) {
      const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({ planType: null })
      });

      if (patchRes.ok) cleaned++;
    }

    return res.json({ cleaned, message: `${cleaned} planType nettoyé(s)` });

  } catch (err) {
    console.error('❌ Erreur Supabase cleanup:', err.message);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
