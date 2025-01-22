const CACHE_NAME = 'cadenza-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Dynamically cache JS and CSS files
const cacheFiles = async (cache) => {
  try {
    // Cache initial URLs
    await cache.addAll(urlsToCache);

    // Find and cache all JS and CSS files from the document
    const cssFiles = Array.from(document.styleSheets).map(sheet => sheet.href).filter(Boolean);
    const jsFiles = Array.from(document.scripts).map(script => script.src).filter(Boolean);

    await cache.addAll([...cssFiles, ...jsFiles]);
  } catch (error) {
    console.error('Cache files error:', error);
  }
};

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cacheFiles(cache);
      })
  );
  self.skipWaiting();
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
        if (response) {
          // Return cached response and update cache in background
          fetch(event.request)
            .then(networkResponse => {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, networkResponse.clone());
                })
                .catch(error => console.error('Cache update error:', error));
            })
            .catch(error => console.error('Background fetch error:', error));

          return response;
        }

        // Network request
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => console.error('Cache put error:', error));

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