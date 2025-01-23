const CACHE_NAME = 'cadenza-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/Logo192.png',
  '/Logo512.png',
  // Add common CSS and JS files here
  '/static/css/main.css',
  '/static/js/main.js',
  '/static/js/bundle.js'
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
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // Don't cache API or socket.io requests
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/socket.io/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Update service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Only show update notification when necessary
let showUpdateNotification = false;

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Check for updates less frequently
setInterval(() => {
  showUpdateNotification = true;
}, 1000 * 60 * 60); // Check once per hour