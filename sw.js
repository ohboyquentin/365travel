// =============================================
//  SERVICE WORKER — Mon Site Voyage
//  Mise en cache de toutes les pages et assets
// =============================================

const CACHE_NAME = "voyage-v5";

// Toutes les ressources à mettre en cache
const FILES_TO_CACHE = [
  // Pages HTML
  "./index.html",
  "./europe.html",
  "./asie.html",
  "./amerique.html",
  "./pays.html",

  // Données JSON
  "./pays.json",

  // CSS & JS
  "./style.css",
  "./script.js",

  // Manifest & icônes PWA
  "./manifest.json",
  "./images/icon-192.png",
  "./images/icon-512.png"
];

// ─── INSTALLATION : mise en cache initiale ───
self.addEventListener("install", (event) => {
  console.log("[SW] Installation en cours...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Mise en cache des fichiers");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Force l'activation immédiate sans attendre la fermeture des onglets
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
  // Prend le contrôle immédiatement
  self.clients.claim();
});

// ─── FETCH : stratégie Cache First (offline d'abord) ───
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si trouvé en cache → on le retourne directement
      if (cachedResponse) {
        return cachedResponse;
      }

      // Sinon → on tente le réseau
      return fetch(event.request)
        .then((networkResponse) => {
          // On met en cache les nouvelles ressources trouvées en ligne
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Hors ligne et pas en cache → page de secours si disponible
          if (event.request.destination === "document") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
