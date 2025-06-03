diff --git a//dev/null b/api/ocr-gpt.js
index 0000000000000000000000000000000000000000..3cae9b10e456ee273bd35434a883fa38dd537b1c 100644
--- a//dev/null
+++ b/api/ocr-gpt.js
@@ -0,0 +1,56 @@
+export default async function handler(req, res) {
+  if (req.method !== 'POST') {
+    res.status(405).json({ error: 'Method not allowed' });
+    return;
+  }
+
+  const { base64Image } = req.body || {};
+  if (!base64Image) {
+    res.status(400).json({ error: 'Missing base64Image' });
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
+        model: 'gpt-4-vision-preview',
+        messages: [
+          {
+            role: 'system',
+            content: 'Estrai la lista dei prodotti dallo scontrino. Rispondi solo con l\'elenco, uno per riga.'
+          },
+          {
+            role: 'user',
+            content: [
+              { type: 'image_url', image_url: { url: base64Image } },
+              { type: 'text', text: 'Elenca i prodotti presenti nello scontrino.' }
+            ]
+          }
+        ],
+        max_tokens: 200
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
