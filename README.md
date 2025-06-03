# 🛒 Jester – Assistente Spesa PWA

Jester è un assistente vocale per la gestione della spesa che funziona interamente nel browser. L'app permette di creare e modificare liste, analizzare scontrini con GPT‑4 Vision e può essere installata come **Progressive Web App**.

## Funzionalità
- Due liste separate: **Supermercato** e **Online**
- Aggiunta e rimozione manuale o tramite comandi vocali (Web Speech API)
- Possibilità di marcare i prodotti acquistati
- Esportazione delle liste in formato `.txt`
- Analisi OCR degli scontrini attraverso l'endpoint `/api/ocr-gpt`
- Gestione dei preferiti
- Statistiche di completamento con barra di avanzamento colorata
- Funzionamento offline tramite Service Worker e installazione PWA

## Storage Locale
I dati vengono salvati in `localStorage` con le seguenti chiavi:
- `jester_utente_supermercato`
- `jester_utente_online`
- `jester_utente_acquisti_supermercato`
- `jester_utente_acquisti_online`
- `jester_utente_preferiti`
- `jester_ocr_confirmed`

## Struttura del progetto
```
index.html          # Interfaccia principale
manifest.json       # Configurazione PWA
serviceWorker.js    # Cache offline e notifiche
icon-192.png        # Icona app
favicon.ico         # Icona tab browser
api/ocr-gpt.js      # Endpoint serverless per GPT-4 Vision
```

## Deploy su Vercel
1. Carica l'intero progetto su **Vercel**
2. In *Settings → Environment Variables* aggiungi:
   ```
   OPENAI_API_KEY=sk-xxxxx
   ```
3. Avvia il deploy e visita il dominio generato

Puoi verificare il funzionamento dell'endpoint con `node -c api/ocr-gpt.js`.

Per testare localmente è sufficiente aprire `index.html` in un browser moderno.
