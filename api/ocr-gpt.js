export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body whether it's already an object or a string
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { base64Image } = body;

  if (!base64Image) {
    return res.status(400).json({ error: 'base64Image is required' });
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
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Estrarre la lista dei prodotti con i prezzi da questo scontrino:'
              },
              {
                type: 'image_url',
                image_url: { url: base64Image }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      return res.status(openaiRes.status).json({ error: 'OpenAI Error', details: errorText });
    }

    const data = await openaiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('OCR GPT error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
