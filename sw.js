// =============================================
//  SERVICE WORKER — 365 Travel
//  Mise en cache complète pour usage hors-ligne
// =============================================

const CACHE_NAME = "voyage-v12";

// Fichiers essentiels à pré-charger dès l'installation
const FILES_TO_CACHE = [
  "./index.html",
  "./europe.html",
  "./asie.html",
  "./amerique.html",
  "./pays.html",
  "./pays.json",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./images/icon-192.png",
  "./images/icon-512.png",
  "./images/logo.png"
];

// ─── INSTALLATION : mise en cache initiale ───
self.addEventListener("install", (event) => {
  console.log("[SW] Installation en cours...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Mise en cache des fichiers essentiels");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ─── ACTIVATION : nettoyage des anciens caches ───
self.addEventListener("activate", (event) => {
  console.log("[SW] Activation...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("[SW] Suppression ancien cache :", name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// ─── FETCH : stratégie adaptative ───
// - Pour pays.json : Network First (toujours essayer d'avoir la dernière version, fallback sur cache si hors-ligne)
// - Pour tout le reste : Cache First + mise en cache automatique de tout nouveau fichier visité (images, pages, etc.)
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Stratégie spéciale pour pays.json : Network First
  if (url.includes("pays.json")) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Hors-ligne → on sert la version en cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Stratégie Cache First pour tout le reste (HTML, CSS, JS, images...)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Mise en cache automatique de TOUT nouveau fichier chargé avec succès
          // (images, nouvelles pages, etc.) — c'est ce qui permet le hors-ligne complet
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === "basic" || networkResponse.type === "cors")
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Hors-ligne et pas en cache
          if (event.request.destination === "document") {
            return caches.match("./index.html");
          }
          // Pour les images manquantes en cache, on ne peut rien faire de mieux
        });
    })
  );
});
