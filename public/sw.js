/**
 * Service Worker for The Old Crown Girton
 * Focused on aggressive caching for static assets, API responses, and offline fallbacks.
 */

const CACHE_NAME = 'restaurant-v1.0.3';
const STATIC_CACHE = 'static-v1.0.3';
const IMAGE_CACHE = 'images-v1.0.3';
const API_CACHE = 'api-v1.0.3';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main.js',
  '/images/logo.png',
  '/fonts/inter-var.woff2',
  '/fonts/playfair-display-var.woff2'
];

// Network-first resources (always try network, fallback to cache)
const NETWORK_FIRST = [
  '/api/',
  '/config/',
  '.json'
];

// Cache-first resources (serve from cache, update in background)
const CACHE_FIRST = [
  '/_next/static/',
  '/images/',
  '/fonts/',
  '.woff2',
  '.woff',
  '.css',
  '.js'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('💾 Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES.filter((url) => !url.includes('undefined')));
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (name) =>
                name !== CACHE_NAME &&
                name !== STATIC_CACHE &&
                name !== IMAGE_CACHE &&
                name !== API_CACHE
            )
            .map((name) => {
              console.log('🗑️ Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (!url.origin.includes(self.location.origin) && !url.protocol.startsWith('http')) {
    return;
  }

  if (url.pathname.includes('/admin') || url.pathname.includes('/auth')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  try {
    if (NETWORK_FIRST.some((pattern) => url.pathname.includes(pattern))) {
      return await networkFirst(request, API_CACHE);
    }

    if (
      url.pathname.includes('/images/') ||
      /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(url.pathname)
    ) {
      return await staleWhileRevalidate(request, IMAGE_CACHE, {
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }

    if (CACHE_FIRST.some((pattern) => url.pathname.includes(pattern))) {
      return await cacheFirst(request, STATIC_CACHE, {
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
    }

    if (request.headers.get('accept')?.includes('text/html')) {
      return await networkFirst(request, CACHE_NAME, { timeout: 2000 });
    }

    return await fetch(request);
  } catch (error) {
    console.warn('SW fetch error:', error);

    if (request.headers.get('accept')?.includes('text/html')) {
      const cachedResponse = await caches.match('/');
      if (cachedResponse) return cachedResponse;
    }

    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

async function networkFirst(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName);
  const { timeout = 5000 } = options;

  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), timeout))
    ]);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error('Network response not ok');
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log('📦 Serving from cache (network failed):', request.url);
      return cachedResponse;
    }

    throw error;
  }
}

async function cacheFirst(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName);
  const { maxAge = 24 * 60 * 60 * 1000 } = options;

  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    const cachedDate = new Date(cachedResponse.headers.get('date') || 0);
    const isExpired = Date.now() - cachedDate.getTime() > maxAge;

    if (!isExpired) {
      console.log('💾 Serving from cache:', request.url);
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    if (cachedResponse) {
      console.log('📦 Serving stale from cache (network failed):', request.url);
      return cachedResponse;
    }

    throw new Error('Network error and no cache');
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => {});

  if (cachedResponse) {
    console.log('💾 Serving from cache (updating in background):', request.url);
    return cachedResponse;
  }

  return fetchPromise;
}

if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      event.waitUntil(updateCriticalData());
    }
  });
}

async function updateCriticalData() {
  try {
    const cache = await caches.open(API_CACHE);

    const restaurantResponse = await fetch('/config/restaurant.json');
    if (restaurantResponse.ok) {
      cache.put('/config/restaurant.json', restaurantResponse.clone());
    }

    const menuResponse = await fetch('/config/menu.json');
    if (menuResponse.ok) {
      cache.put('/config/menu.json', menuResponse.clone());
    }

    console.log('🔄 Background sync completed');
  } catch (error) {
    console.warn('Background sync failed:', error);
  }
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_STATS') {
    getCacheStats().then((stats) => {
      event.ports[0].postMessage(stats);
    });
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

async function getCacheStats() {
  const cacheNames = await caches.keys();
  const stats = {};

  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    stats[name] = keys.length;
  }

  return stats;
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  console.log('🗑️ All caches cleared');
}

console.log('🚀 Service Worker activated');
