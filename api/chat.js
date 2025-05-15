const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

router.get('/', (req, res) => {
  res.json({ status: 'Chat API OK' });
});



router.post('/', async (req, res) => {
  console.log("routtteeeee chatttttt")
  const { email, messages = [] } = req.body;

  console.log('[📥 Reçu] Email:', email);
  console.log('[📥 Reçu] Messages:', messages);

  if (!email || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Email et messages requis.' });
  }

  const today = new Date().toISOString().split('T')[0];
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  const encodedEmail = encodeURIComponent(email);

  try {
    // 🔍 Vérifier le quota
    const checkRes = await fetch(
      `${supabaseUrl}/rest/v1/ChatUsage?select=id&email=eq.${encodedEmail}&created_at=gte.${today}T00:00:00`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const logs = await checkRes.json();
    console.log(`[📊 Quota] ${logs.length} messages aujourd’hui`);

    if (logs.length >= 20) {
      return res.status(429).json({ error: '⛔ Limite de 20 messages atteinte pour aujourd’hui.' });
    }

    // 🧠 Appel à GPT
    const fullMessages = [
      { role: 'system', content: 'Tu es un assistant bienveillant et précis.' },
      ...messages
    ];

    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const gptData = await gptRes.json();
    const reply = gptData?.choices?.[0]?.message?.content || 'Réponse indisponible.';
    console.log('[✅ GPT réponse]', reply);

    // 📝 Insertion dans Supabase
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/ChatUsage`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        email,
        created_at: new Date().toISOString(),
        origin: 'chat',
        tokens_used: 0
      })
    });

    const insertText = await insertRes.text();
    console.log('[🗂️ Supabase] Insert:', insertText);

    res.status(200).json({ reply });
  } catch (err) {
    console.error('[🔥 SERVER ERROR]', err);
    res.status(500).json({ error: 'Erreur serveur', message: err.message });
  }
});

module.exports = router;
