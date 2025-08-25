/**
 * Service Worker for Modular Content System
 * 
 * Provides advanced caching strategies, offline support, and performance optimizations
 * for the modular content system in production.
 */

const CACHE_NAME = 'modular-content-v1';
const CONTENT_CACHE_NAME = 'content-modules-v1';
const STATIC_CACHE_NAME = 'static-resources-v1';

// Cache strategies by content type
const CACHE_STRATEGIES = {
  manifest: {
    strategy: 'stale-while-revalidate',
    maxAge: 3600000, // 1 hour
  },
  core: {
    strategy: 'cache-first',
    maxAge: 1800000, // 30 minutes
  },
  pages: {
    strategy: 'network-first',
    maxAge: 600000, // 10 minutes
  },
  components: {
    strategy: 'stale-while-revalidate',
    maxAge: 300000, // 5 minutes
  },
};

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/offline',
        // Add other critical static resources
      ]);
    })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![CACHE_NAME, CONTENT_CACHE_NAME, STATIC_CACHE_NAME].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Claim all clients
  self.clients.claim();
});

// Fetch event - handle content requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Handle content API requests
  if (url.pathname.startsWith('/api/content/')) {
    event.respondWith(handleContentRequest(event.request));
    return;
  }
  
  // Handle other requests with default strategy
  event.respondWith(handleDefaultRequest(event.request));
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
      preloadContent(payload.modules);
      break;
      
    case 'CACHE_CLEAR':
      clearContentCache(payload.pattern);
      break;
      
    case 'CACHE_STATS':
      getCacheStats().then((stats) => {
        event.ports[0].postMessage(stats);
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