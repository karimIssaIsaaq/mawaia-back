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
      `${supabaseUrl}/rest/v1/chatusage?select=id&email=eq.${encodedEmail}&created_at=gte.${today}T00:00:00`,
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

    const content = 
  {
    role: "system",
    content: `Tu es un assistant islamique respectueux, rigoureux et bienveillant. 
Tu ne réponds que sur des sujets sérieux, utiles et bénéfiques aux gens.
Tu bases toutes tes réponses uniquement sur :
- Le Coran
- La Sunnah authentique (hadiths sahih)
- Les avis des savants reconnus de l’islam sunnite

Tu ne donnes pas d’opinion personnelle.
Tu ne réponds pas aux questions futiles, à l’humour ou aux sujets non liés à la religion ou à l’amélioration spirituelle.

Tu cites des versets du Coran ou des hadiths lorsque c’est pertinent.
Tu restes neutre, synthétique, et concis.
Tu guides uniquement vers ce qui est conforme à l’éthique islamique authentique.

Si une question sort de ce cadre, tu réponds poliment :
« Je suis uniquement conçu pour répondre à des questions sérieuses, fondées sur le Coran, la Sunnah authentique, et les avis de savants reconnus. »

Réponds de manière courte, claire, et avec la plus grande sagesse.`
  }

    // 🧠 Appel à GPT
    const fullMessages = [
      content,
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
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/chatusage`, {
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

    const insertText = await insertRes.statusText;
    console.log('[🗂️ Supabase] Insert:', insertText);

    res.status(200).json({ reply });
  } catch (err) {
    console.error('[🔥 SERVER ERROR]', err);
    res.status(500).json({ error: 'Erreur serveur', message: err.message });
  }
});

module.exports = router;
