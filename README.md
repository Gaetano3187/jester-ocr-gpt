 diff --git a/README.md b/README.md
index 78f2eff8e570a501b1c39c48f27272faa003cb50..a0eb6c4f21f9c7942080d46784bf49fdb91c2167 100644
--- a/README.md
+++ b/README.md
@@ -1,21 +1,47 @@
-# 📚 JESTER – OCR GPT (Vercel Ready)
+# 🛒 JESTER – Assistente Spesa PWA
 
-Questa applicazione permette di caricare uno scontrino e inviarlo a GPT-4 Vision per l'estrazione automatica dei prodotti.
+Jester è un assistente vocale per la gestione della spesa che funziona interamente nel browser. Puoi creare liste di prodotti, gestire preferiti e analizzare scontrini con GPT‑4 Vision. L'app è pensata per il deploy su **Vercel** e richiede solo l'inserimento della chiave OpenAI.
 
 ## ✅ Funzionalità
-- Caricamento immagini da fotocamera
-- Invio a OpenAI GPT-4 Vision tramite endpoint /api/ocr-gpt
-- Visualizzazione elenco prodotti riconosciuti
-- Design responsive e mobile-first
+- Due liste separate: **Supermercato** e **Online**
+- Aggiunta e rimozione manuale o tramite comandi vocali (Web Speech API)
+- Possibilità di marcare i prodotti acquistati e vedere l'avanzamento con barra di progresso
+- Esportazione delle liste in formato `.txt`
+- Analisi OCR degli scontrini tramite l'endpoint `/api/ocr-gpt`
+- Comprensione dei comandi vocali con ChatGPT via `/api/chat-gpt`
+- Gestione dei preferiti
+- Funzionamento offline tramite Service Worker e installazione PWA
+
+## Storage Locale
+I dati vengono salvati in `localStorage` con le seguenti chiavi:
+- `jester_utente_supermercato`
+- `jester_utente_online`
+- `jester_utente_acquisti_supermercato`
+- `jester_utente_acquisti_online`
+- `jester_utente_preferiti`
+- `jester_ocr_confirmed`
 
 ## 🚀 Deploy
-1. Carica questo progetto su Vercel
-2. In Settings → Environment Variables, aggiungi:
+1. Carica questo progetto su **Vercel**
+2. In *Settings → Environment Variables* aggiungi:
    ```
-   OPENAI_API_KEY = sk-xxxxx
+   OPENAI_API_KEY=sk-xxxxx
    ```
-3. Deploya e apri il dominio
+3. Avvia il deploy e visita il dominio generato
+
+## 🧠 Modelli utilizzati
+- `gpt-3.5-turbo` per la comprensione dei comandi vocali
+- `gpt-4-vision-preview` per il riconoscimento visivo
 
-## 🧠 Modello
-Usa `gpt-4-vision-preview` per il riconoscimento visivo.
+## 📂 Struttura del progetto
+```
+index.html       # Interfaccia principale
+main.js          # Logica dell'applicazione
+manifest.json    # Configurazione PWA
+serviceWorker.js # Cache offline
+api/chat-gpt.js  # Endpoint serverless per i comandi vocali
+api/ocr-gpt.js   # Endpoint serverless per l'OCR dello scontrino
+install.sh       # Script opzionale di installazione
+LICENSE          # Licenza del progetto
+```
 
