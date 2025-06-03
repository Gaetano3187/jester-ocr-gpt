export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { prompt } = body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
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
              'Analizza il comando vocale e restituisci il testo da eseguire per Jester. Rispondi solo con il comando e niente altro.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 50
      })
    });

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      return res.status(openaiRes.status).json({ error: 'OpenAI Error', details: text });
    }

    const data = await openaiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Chat GPT error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
