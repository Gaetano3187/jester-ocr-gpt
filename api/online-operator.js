export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { products } = body || {};
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'products must be an array' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Agisci come assistente shopping. In base alla lista di prodotti fornisci una breve descrizione delle migliori offerte online. Restituisci un testo riassuntivo.'
          },
          {
            role: 'user',
            content: products.join(', ')
          }
        ],
        max_tokens: 150
      })
    });

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      return res.status(openaiRes.status).json({ error: 'OpenAI Error', details: text });
    }

    const data = await openaiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('online operator error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
