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

  const { base64Image } = body || {};
  if (!base64Image) {
    return res.status(400).json({ error: 'base64Image is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not set');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const imageData = base64Image.startsWith('data:')
    ? base64Image
    : `data:image/png;base64,${base64Image}`;

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
                image_url: { url: imageData }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    if (!openaiRes.ok) {
      const details = await openaiRes.text();
      return res.status(openaiRes.status).json({ error: 'OpenAI Error', details });
    }

    const data = await openaiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('OCR GPT error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
