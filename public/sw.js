// Service Worker with Cache-First Strategy
const CACHE_NAME = 'desktop-hotel-v1';
const STATIC_CACHE = 'desktop-hotel-static-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/index.jsx',
  '/src/App.jsx',
  '/src/styles/global.css',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.error('[Service Worker] Failed to cache static assets:', err);
      });
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim all clients immediately
  return self.clients.claim();
});

// Fetch event - Cache First Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip chrome extension requests
  if (request.url.includes('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[Service Worker] Serving from cache:', request.url);
        // Return cached response and update cache in background
        fetchAndCache(request);
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache it
      console.log('[Service Worker] Fetching from network:', request.url);
      return fetchAndCache(request);
    }).catch((error) => {
      console.error('[Service Worker] Fetch failed:', error);
      // Return a fallback response if needed
      return new Response('Offline - Content not available', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
    })
  );
});

// Helper function to fetch and cache
function fetchAndCache(request) {
  return fetch(request).then((response) => {
    // Only cache successful responses
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    // Clone the response as it can only be consumed once
    const responseToCache = response.clone();

    caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, responseToCache);
    });

    return response;
  });
}

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        return self.clients.matchAll();
      }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'CACHE_CLEARED' });
        });
      })
    );
  }
});
