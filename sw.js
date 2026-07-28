const CACHE_NAME = 'plataforma-biobio-v1';
const ASSETS_TO_CACHE = [
  '/plataforma-biobio-demo/',
  '/plataforma-biobio-demo/index.html',
  '/plataforma-biobio-demo/mapa.html',
  '/plataforma-biobio-demo/DBB Color.png',
  '/plataforma-biobio-demo/icon-192.png',
  '/plataforma-biobio-demo/icon-512.png',
  '/plataforma-biobio-demo/manifest.json'
];

// Install: cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
