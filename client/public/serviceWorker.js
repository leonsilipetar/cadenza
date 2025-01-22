const CACHE_NAME = 'cadenza-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  './manifest.json',
  './favicon.ico',
  './logo192.png',
  './logo512.png'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Ensure the new service worker activates immediately
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // Don't cache API requests
  if (event.request.url.includes('/api/')) {
    return;
  }

  // Don't cache POST requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached response if found
        if (response) {
          // Fetch new version in background
          fetch(event.request).then(response => {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response);
            });
          });
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return cached version if network fails
            return caches.match(event.request);
          });
      })
  );
});

// Update service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Take control of all clients
      clients.claim(),
      // Remove old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Handle service worker updates
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});