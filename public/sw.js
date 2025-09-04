/**
 * Enhanced Service Worker for Old Crown Restaurant
 * 
 * Provides advanced caching strategies, offline support, and performance optimizations
 * with restaurant-specific optimizations and background sync capabilities.
 */

/**
 * Service Worker for Mobile Performance Optimization
 * Implements aggressive caching strategies for mobile devices
 */

const CACHE_NAME = 'restaurant-mobile-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'images-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline',
  // Critical CSS and JS will be added by Next.js build process
];

// Image extensions to cache
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];

// Cache durations (in seconds)
const CACHE_DURATIONS = {
  static: 86400 * 30, // 30 days
  dynamic: 86400 * 7, // 7 days  \n  images: 86400 * 14, // 14 days
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE && 
                     cacheName !== IMAGE_CACHE;
            })
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Determine caching strategy based on request type
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Image request handler - cache first with fallback
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATIONS.images)) {
      return cachedResponse;
    }
    
    // Network request with timeout for mobile
    const networkResponse = await fetchWithTimeout(request, 8000);
    
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // Return cached version even if expired
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline image
    return new Response(
      `<svg width=\"400\" height=\"300\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"100%\" height=\"100%\" fill=\"#f3f4f6\"/>\n        <text x=\"50%\" y=\"50%\" text-anchor=\"middle\" fill=\"#9ca3af\" font-family=\"sans-serif\">Image unavailable</text>\n      </svg>`,
      { 
        headers: { 
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        } 
      }
    );
    
  } catch (error) {
    console.error('[SW] Image request failed:', error);
    return caches.match('/offline.jpg') || new Response('Image failed to load');
  }
}

// Static asset handler - cache first
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background if expired
      if (isExpired(cachedResponse, CACHE_DURATIONS.static)) {
        fetchWithTimeout(request, 5000)
          .then(response => {
            if (response && response.status === 200) {
              cache.put(request, response);
            }
          })
          .catch(() => {}); // Silent fail for background update
      }
      return cachedResponse;
    }
    
    const networkResponse = await fetchWithTimeout(request, 5000);
    
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network failed');
    
  } catch (error) {
    console.error('[SW] Static request failed:', error);
    return caches.match('/offline');
  }
}

// API request handler - network first with cache fallback
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetchWithTimeout(request, 3000);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network failed');
    
  } catch (error) {
    console.error('[SW] API request failed, trying cache:', error);
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(
      JSON.stringify({ error: 'Service unavailable', cached: false }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Dynamic content handler - network first
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetchWithTimeout(request, 3000);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network failed');
    
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return caches.match('/offline');
  }
}

// Utility functions
function isImageRequest(request) {
  const url = new URL(request.url);
  return IMAGE_EXTENSIONS.some(ext => url.pathname.toLowerCase().includes(ext)) ||
         request.destination === 'image';
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/_next/static/') ||
         url.pathname.includes('/static/') ||
         url.pathname.match(/\\.(css|js|woff|woff2|ttf|eot)$/);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

function isExpired(response, maxAge) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return true;
  
  const responseTime = new Date(dateHeader).getTime();
  const now = Date.now();
  return (now - responseTime) > (maxAge * 1000);
}

async function fetchWithTimeout(request, timeout = 5000) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Fetch timeout')), timeout)
    )
  ]);
}

// Background sync for failed requests (if supported)
if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      event.waitUntil(
        // Implement background sync logic here
        console.log('[SW] Background sync triggered')
      );
    }
  });
}

// Handle push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

/**
 * Handle content API requests with advanced caching
 */
async function handleContentRequest(request) {
  const url = new URL(request.url);
  const isManifest = url.pathname.includes('manifest');
  const isModule = url.pathname.includes('modules/');
  
  let strategy = 'network-first';
  let maxAge = 300000; // 5 minutes default
  
  if (isManifest) {
    strategy = CACHE_STRATEGIES.manifest.strategy;
    maxAge = CACHE_STRATEGIES.manifest.maxAge;
  } else if (isModule) {
    // Determine module type from URL
    const moduleId = url.pathname.split('/modules/')[1];
    if (moduleId?.startsWith('core/')) {
      strategy = CACHE_STRATEGIES.core.strategy;
      maxAge = CACHE_STRATEGIES.core.maxAge;
    } else if (moduleId?.startsWith('pages/')) {
      strategy = CACHE_STRATEGIES.pages.strategy;
      maxAge = CACHE_STRATEGIES.pages.maxAge;
    } else if (moduleId?.startsWith('components/')) {
      strategy = CACHE_STRATEGIES.components.strategy;
      maxAge = CACHE_STRATEGIES.components.maxAge;
    }
  }
  
  // Apply caching strategy
  switch (strategy) {
    case 'cache-first':
      return cacheFirst(request, CONTENT_CACHE_NAME, maxAge);
    case 'network-first':
      return networkFirst(request, CONTENT_CACHE_NAME, maxAge);
    case 'stale-while-revalidate':
      return staleWhileRevalidate(request, CONTENT_CACHE_NAME, maxAge);
    default:
      return fetch(request);
  }
}

/**
 * Handle default requests
 */
async function handleDefaultRequest(request) {
  const url = new URL(request.url);
  
  // For static assets, use cache-first
  if (url.pathname.startsWith('/_next/') || 
      url.pathname.startsWith('/static/') ||
      /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/.test(url.pathname)) {
    return cacheFirst(request, STATIC_CACHE_NAME, 86400000); // 24 hours
  }
  
  // For pages, use network-first with offline fallback
  return networkFirstWithOfflineFallback(request);
}

/**
 * Cache-first strategy
 */
async function cacheFirst(request, cacheName, maxAge) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      // Update cache in background
      fetch(request).then((response) => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Ignore background update failures
      });
      
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached response if available, even if expired
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Network-first strategy
 */
async function networkFirst(request, cacheName, maxAge) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Stale-while-revalidate strategy
 */
async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always attempt to fetch from network
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Ignore network failures for this strategy
  });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    // Trigger background update
    fetchPromise;
    return cachedResponse;
  }
  
  // Wait for network if no cache available
  return fetchPromise;
}

/**
 * Network-first with offline fallback
 */
async function networkFirstWithOfflineFallback(request) {
  try {
    return await fetch(request);
  } catch (error) {
    // Check if we have a cached version
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/offline');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

/**
 * Check if cached response is expired
 */
function isExpired(response, maxAge) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) {
    // No timestamp, consider it fresh (new cache entry)
    return false;
  }
  
  const age = Date.now() - parseInt(cachedAt);
  return age > maxAge;
}

/**
 * Message handler for cache management
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_PRELOAD':
      // Defensive: ensure modules is an array of strings/ids
      try {
        const modules = Array.isArray(payload && payload.modules) ? payload.modules : [];
        preloadContent(modules);
      } catch (e) {
        console.warn('CACHE_PRELOAD: invalid payload.modules', payload && payload.modules);
      }
      break;
      
    case 'CACHE_URLS':
      // Defensive: coerce URLs array and filter invalid entries
      try {
        const raw = payload && payload.urls;
        const urls = Array.isArray(raw)
          ? raw
              .map((u) =>
                typeof u === 'string' ? u : u && u.href ? String(u.href) : u ? String(u) : null
              )
              .filter(Boolean)
          : [];

        cacheUrls(urls)
          .then(() => {
            if (event.ports[0]) {
              event.ports[0].postMessage({ success: true });
            }
          })
          .catch((error) => {
            if (event.ports[0]) {
              event.ports[0].postMessage({ error: error.message });
            }
          });
      } catch (e) {
        console.warn('CACHE_URLS: invalid payload', payload);
        if (event.ports[0]) {
          event.ports[0].postMessage({ error: 'invalid payload for CACHE_URLS' });
        }
      }
      break;
      
    case 'CACHE_CLEAR':
      clearContentCache(payload.pattern);
      break;
      
    case 'CACHE_STATS':
      getCacheStats().then((stats) => {
        event.ports[0].postMessage(stats);
      });
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then((status) => {
        if (event.ports[0]) {
          event.ports[0].postMessage(status);
        }
      }).catch((error) => {
        if (event.ports[0]) {
          event.ports[0].postMessage({ error: error.message });
        }
      });
      break;
      
    case 'CLEAR_CACHE':
      clearCacheByNames(payload.cacheNames).then(() => {
        if (event.ports[0]) {
          event.ports[0].postMessage({ success: true });
        }
      }).catch((error) => {
        if (event.ports[0]) {
          event.ports[0].postMessage({ error: error.message });
        }
      });
      break;
  }
});

/**
 * Preload content modules
 */
async function preloadContent(modules) {
  const cache = await caches.open(CONTENT_CACHE_NAME);
  
  const preloadPromises = modules.map(async (moduleId) => {
    const url = `/api/content/modules/${moduleId}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.warn(`Failed to preload module ${moduleId}:`, error);
    }
  });
  
  await Promise.allSettled(preloadPromises);
}

/**
 * Cache specific URLs
 */
async function cacheUrls(urls) {
  if (!Array.isArray(urls)) {
    console.warn('cacheUrls: urls must be an array, got:', typeof urls);
    return;
  }
  
  const cache = await caches.open(API_CACHE_NAME);
  
  const cachePromises = urls.map(async (url) => {
    if (typeof url !== 'string') {
      console.warn('cacheUrls: invalid URL type:', typeof url, url);
      return;
    }
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response.clone());
        console.log(`Cached: ${url}`);
      } else {
        console.warn(`Failed to cache ${url}: ${response.status}`);
      }
    } catch (error) {
      console.warn(`Failed to cache ${url}:`, error);
    }
  });
  
  await Promise.allSettled(cachePromises);
}

/**
 * Get comprehensive cache status
 */
async function getCacheStatus() {
  const cacheNames = [CACHE_NAME, CONTENT_CACHE_NAME, STATIC_CACHE_NAME, IMAGE_CACHE_NAME, API_CACHE_NAME];
  const caches = {};
  let totalEntries = 0;
  
  for (const cacheName of cacheNames) {
    try {
      const cache = await self.caches.open(cacheName);
      const keys = await cache.keys();
      const urls = keys.map(request => request.url);
      
      caches[cacheName] = {
        entries: keys.length,
        urls: urls
      };
      totalEntries += keys.length;
    } catch (error) {
      caches[cacheName] = {
        entries: 0,
        urls: [],
        error: error.message
      };
    }
  }
  
  return {
    caches,
    timestamp: new Date().toISOString(),
    version: CACHE_NAME,
    totalEntries
  };
}

/**
 * Clear caches by name
 */
async function clearCacheByNames(cacheNames = []) {
  if (cacheNames.length === 0) {
    // Clear all caches
    cacheNames = [CACHE_NAME, CONTENT_CACHE_NAME, STATIC_CACHE_NAME, IMAGE_CACHE_NAME, API_CACHE_NAME];
  }
  
  for (const cacheName of cacheNames) {
    try {
      await self.caches.delete(cacheName);
      console.log(`Cleared cache: ${cacheName}`);
    } catch (error) {
      console.warn(`Failed to clear cache ${cacheName}:`, error);
    }
  }
}

/**
 * Clear content cache based on pattern
 */
async function clearContentCache(pattern) {
  const cache = await caches.open(CONTENT_CACHE_NAME);
  const keys = await cache.keys();
  
  const deletePromises = keys
    .filter((request) => {
      const url = new URL(request.url);
      return pattern ? url.pathname.includes(pattern) : true;
    })
    .map((request) => cache.delete(request));
  
  await Promise.all(deletePromises);
}

/**
 * Get cache statistics
 */
async function getCacheStats() {
  const caches = await Promise.all([
    caches.open(CONTENT_CACHE_NAME),
    caches.open(STATIC_CACHE_NAME),
  ]);
  
  const stats = {
    content: await getCacheSizeAndCount(caches[0]),
    static: await getCacheSizeAndCount(caches[1]),
  };
  
  return {
    ...stats,
    total: {
      count: stats.content.count + stats.static.count,
      size: stats.content.size + stats.static.size,
    },
  };
}

/**
 * Get cache size and count for a specific cache
 */
async function getCacheSizeAndCount(cache) {
  const keys = await cache.keys();
  let totalSize = 0;
  
  for (const key of keys) {
    try {
      const response = await cache.match(key);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    } catch (error) {
      // Ignore errors for individual entries
    }
  }
  
  return {
    count: keys.length,
    size: totalSize,
  };
}

// Lightweight Service Worker for Mobile Performance
// Focused on aggressive caching for static assets and API responses

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
      // Cache critical resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('💾 Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES.filter(url => !url.includes('undefined')));
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== STATIC_CACHE && name !== IMAGE_CACHE && name !== API_CACHE)
            .map(name => {
              console.log('🗑️ Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests and chrome-extension
  if (!url.origin.includes(self.location.origin) && !url.protocol.startsWith('http')) {
    return;
  }

  // Skip authentication and admin routes
  if (url.pathname.includes('/admin') || url.pathname.includes('/auth')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // API requests - Network first with cache fallback
    if (NETWORK_FIRST.some(pattern => url.pathname.includes(pattern))) {
      return await networkFirst(request, API_CACHE);
    }

    // Images - Cache first with stale-while-revalidate
    if (url.pathname.includes('/images/') || /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(url.pathname)) {
      return await staleWhileRevalidate(request, IMAGE_CACHE, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
    }

    // Static assets - Cache first with long-term caching
    if (CACHE_FIRST.some(pattern => url.pathname.includes(pattern))) {
      return await cacheFirst(request, STATIC_CACHE, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
    }

    // HTML pages - Network first with fast cache fallback
    if (request.headers.get('accept')?.includes('text/html')) {
      return await networkFirst(request, CACHE_NAME, { timeout: 2000 });
    }

    // Default: Network only
    return await fetch(request);

  } catch (error) {
    console.warn('SW fetch error:', error);
    
    // Fallback for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      const cachedResponse = await caches.match('/');
      if (cachedResponse) return cachedResponse;
    }

    // Return basic error response
    return new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Network-first strategy with cache fallback
async function networkFirst(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName);
  const { timeout = 5000 } = options;

  try {
    // Try network with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), timeout)
      )
    ]);

    if (networkResponse.ok) {
      // Cache successful response
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log('📦 Serving from cache (network failed):', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache-first strategy for static assets
async function cacheFirst(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName);
  const { maxAge = 24 * 60 * 60 * 1000 } = options; // 24 hours default
  
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    const cachedDate = new Date(cachedResponse.headers.get('date') || 0);
    const isExpired = Date.now() - cachedDate.getTime() > maxAge;
    
    if (!isExpired) {
      console.log('💾 Serving from cache:', request.url);
      return cachedResponse;
    }
  }

  // Cache miss or expired - fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // Return stale cache if network fails
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

// Stale-while-revalidate strategy for images
async function staleWhileRevalidate(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Fetch updated version in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Silent fail for background updates
  });

  // Return cached version immediately if available
  if (cachedResponse) {
    console.log('💾 Serving from cache (updating in background):', request.url);
    return cachedResponse;
  }

  // No cache - wait for network
  try {
    return await fetchPromise;
  } catch (error) {
    throw error;
  }
}

// Background sync for API updates (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      event.waitUntil(
        // Update critical data in background
        updateCriticalData()
      );
    }
  });
}

async function updateCriticalData() {
  try {
    const cache = await caches.open(API_CACHE);
    
    // Update restaurant data
    const restaurantResponse = await fetch('/config/restaurant.json');
    if (restaurantResponse.ok) {
      cache.put('/config/restaurant.json', restaurantResponse.clone());
    }

    // Update menu data
    const menuResponse = await fetch('/config/menu.json');
    if (menuResponse.ok) {
      cache.put('/config/menu.json', menuResponse.clone());
    }

    console.log('🔄 Background sync completed');
  } catch (error) {
    console.warn('Background sync failed:', error);
  }
}

// Message handler for cache management
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
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('🗑️ All caches cleared');
}

console.log('🚀 Service Worker activated');
