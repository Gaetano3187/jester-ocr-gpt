diff --git a//dev/null b/api/chat-gpt.js
index 0000000000000000000000000000000000000000..ee0afd6bb8d7e7b6a403325cc4ab8fe0350d48b5 100644
--- a//dev/null
+++ b/api/chat-gpt.js
@@ -0,0 +1,53 @@
+export default async function handler(req, res) {
+  if (req.method !== 'POST') {
+    res.status(405).json({ error: 'Method not allowed' });
+    return;
+  }
+
+  const { text } = req.body || {};
+  if (!text) {
+    res.status(400).json({ error: 'Missing text' });
+    return;
+  }
+
+  const apiKey = process.env.OPENAI_API_KEY;
+  if (!apiKey) {
+    res.status(500).json({ error: 'Missing OpenAI API key' });
+    return;
+  }
+
+  try {
+    const response = await fetch('https://api.openai.com/v1/chat/completions', {
+      method: 'POST',
+      headers: {
+        'Content-Type': 'application/json',
+        'Authorization': `Bearer ${apiKey}`
+      },
+      body: JSON.stringify({
+        model: 'gpt-3.5-turbo',
+        messages: [
+          {
+            role: 'system',
+            content: 'Sei Jester, assistente per le liste della spesa. ' +
+              'Interpreta il comando dell\'utente e rispondi solo con un JSON ' +
+              "{\"azione\":\"aggiungi|rimuovi|completa\", \"lista\":\"supermercato|online|preferiti\", \"prodotto\":\"nome\"}"
+          },
+          { role: 'user', content: text }
+        ],
+        max_tokens: 60,
+        temperature: 0
+      })
+    });
+
+    if (!response.ok) {
+      const errText = await response.text();
+      res.status(response.status).send(errText);
+      return;
+    }
+
+    const data = await response.json();
+    res.status(200).json(data);
+  } catch (err) {
+    res.status(500).json({ error: err.message });
+  }
+}
