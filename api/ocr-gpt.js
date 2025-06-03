export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let rawBody = '';
  if (req.body) {
    rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  } else {
    for await (const chunk of req) rawBody += chunk;
  }

  let body;
  try {
    body = typeof req.body === 'object' && req.body !== null ? req.body : JSON.parse(rawBody || '{}');
  } catch {
    body = {};
  }

  const { base64Image } = body || {};
  if (!base64Image) {
    res.status(400).json({ error: 'base64Image is required' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Missing OPENAI_API_KEY');
    res.status(500).json({ error: 'Server misconfigured' });
    return;
  }

  const imageData = base64Image.startsWith('data:')
    ? base64Image
    : `data:image/png;base64,${base64Image}`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Estrarre la lista dei prodotti con i prezzi da questo scontrino:' },
              { type: 'image_url', image_url: { url: imageData } }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      res.status(openaiRes.status).json({ error: 'OpenAI Error', details: text });
      return;
    }

    const data = await openaiRes.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('OCR GPT error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
