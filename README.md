 diff --git a/README.md b/README.md
index 78f2eff8e570a501b1c39c48f27272faa003cb50..d7c200ba2b4a03a6f231ec67794c9ab0315f6e0f 100644
--- a/README.md
+++ b/README.md
@@ -1,21 +1,30 @@
-# 📚 JESTER – OCR GPT (Vercel Ready)
+# 🧠 JESTER – Assistente Vocale per la Spesa
 
-Questa applicazione permette di caricare uno scontrino e inviarlo a GPT-4 Vision per l'estrazione automatica dei prodotti.
+Web app pronta per il deploy su Vercel che unisce comandi vocali, OCR tramite GPT‑4 Vision e funzioni PWA.
 
-## ✅ Funzionalità
-- Caricamento immagini da fotocamera
-- Invio a OpenAI GPT-4 Vision tramite endpoint /api/ocr-gpt
-- Visualizzazione elenco prodotti riconosciuti
-- Design responsive e mobile-first
+## Funzionalità principali
+- Aggiunta e rimozione prodotti con voce o clic
+- Gestione due liste: supermercato e online
+- Preferiti con aggiunta rapida
+- Pulsante "segna come acquistato" con statistiche dinamiche
+- Import prodotti da scontrino tramite `/api/ocr-gpt`
+- Generazione lista `.txt` scaricabile
+- Installabile come PWA e funzionante offline
 
-## 🚀 Deploy
-1. Carica questo progetto su Vercel
-2. In Settings → Environment Variables, aggiungi:
-   ```
-   OPENAI_API_KEY = sk-xxxxx
-   ```
-3. Deploya e apri il dominio
+## Struttura progetto
+```
+index.html          ─ interfaccia principale
+serviceWorker.js    ─ caching offline
+manifest.json       ─ configurazione PWA
+api/ocr-gpt.js      ─ endpoint serverless per GPT‑4 Vision
+icon-192.png        ─ icona applicazione
+```
 
-## 🧠 Modello
-Usa `gpt-4-vision-preview` per il riconoscimento visivo.
+## Deploy su Vercel
+1. Carica il repository su GitHub
+2. Collega il repo a Vercel
+3. In **Settings → Environment Variables** aggiungi
+   `OPENAI_API_KEY = sk-xxxxx`
+4. Avvia il deploy
 
+Dopo il primo caricamento l'app potrà funzionare anche offline.
