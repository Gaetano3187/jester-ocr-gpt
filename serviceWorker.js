const CACHE_NAME = "jester-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/icon-192.png",
  "/favicon.ico",
  "/manifest.json"
];

// INSTALL CACHE
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// FETCH FROM CACHE OR NETWORK
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// PLACEHOLDER FOR PUSH NOTIFICATION SUPPORT
self.addEventListener("push", function(event) {
  const data = event.data ? event.data.text() : "Nuova notifica da Jester!";
  event.waitUntil(
    self.registration.showNotification("📦 Jester Notifica", {
      body: data,
      icon: "/icon-192.png"
    })
  );
});
