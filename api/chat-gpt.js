 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/api/ocr-gpt.js
index 0000000000000000000000000000000000000000..e09dbdebe04a7ff6299391c9ec812414c8be3a82 100644
--- a//dev/null
+++ b/api/ocr-gpt.js
@@ -0,0 +1,41 @@
+export default async function handler(req, res) {
+  if (req.method !== 'POST') {
+    return res.status(405).send('Method Not Allowed');
+  }
+
+  const { base64Image } = req.body || {};
+  if (!base64Image) {
+    return res.status(400).send('Missing image');
+  }
+
+  try {
+    const response = await fetch('https://api.openai.com/v1/chat/completions', {
+      method: 'POST',
+      headers: {
+        'Content-Type': 'application/json',
+        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
+      },
+      body: JSON.stringify({
+        model: 'gpt-4-vision-preview',
+        messages: [{
+          role: 'user',
+          content: [
+            { type: 'text', text: 'Estrai l\'elenco dei prodotti dallo scontrino in formato elenco puntato.' },
+            { type: 'image_url', image_url: { url: base64Image } }
+          ]
+        }],
+        max_tokens: 300
+      })
+    });
+
+    if (!response.ok) {
+      const err = await response.text();
+      return res.status(500).send(err);
+    }
+
+    const data = await response.json();
+    res.status(200).json(data);
+  } catch (err) {
+    res.status(500).send(err.toString());
+  }
+}
 
EOF
)
