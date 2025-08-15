// Service Worker for Progressive Web App capabilities
// Implements advanced caching strategies and offline functionality

const CACHE_NAME = 'old-crown-restaurant-v1';
const STATIC_CACHE = 'old-crown-static-v1';
const DYNAMIC_CACHE = 'old-crown-dynamic-v1';
const IMAGE_CACHE = 'old-crown-images-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/menu',
  '/about',
  '/contact',
  '/events',
  '/offline',
  '/_offline',
  '/manifest.json',
  // Critical CSS and JS (these will be updated during build)
  '/_next/static/css/app/globals.css',
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
  // Critical images
  '/hero-restaurant.jpg',
  '/restaurant-interior.jpg',
  '/apple-icon.png',
  '/icon.png'
];

// Routes that should always try network first
const NETWORK_FIRST_ROUTES = [
  '/api/',
  '/dashboard',
  '/_next/webpack-hmr'
];

// Routes that can be served from cache
const CACHE_FIRST_ROUTES = [
  '/_next/static/',
  '/static/',
  '/images/',
  '/icons/',
  '/dishes/',
  '/restaurant/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    (async () => {
      try {
        // Cache static assets
        const staticCache = await caches.open(STATIC_CACHE);
        await staticCache.addAll(STATIC_ASSETS);
        
        console.log('[SW] Static assets cached successfully');
        
        // Skip waiting to activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error('[SW] Failed to cache static assets:', error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames
          .filter(name => !name.includes('v1')) // Keep current version
          .map(name => caches.delete(name));
        
        await Promise.all(deletePromises);
        
        // Claim all clients
        await self.clients.claim();
        
        console.log('[SW] Service worker activated and clients claimed');
      } catch (error) {
        console.error('[SW] Failed to activate service worker:', error);
      }
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!url.protocol.startsWith('http')) return;
  
  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') return;
  
  event.respondWith(handleFetch(request));
});

// Main fetch handler with intelligent caching strategies
async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Network First (API calls, dynamic content)
    if (NETWORK_FIRST_ROUTES.some(route => url.pathname.startsWith(route))) {
      return await networkFirst(request);
    }
    
    // Strategy 2: Cache First (static assets)
    if (CACHE_FIRST_ROUTES.some(route => url.pathname.startsWith(route))) {
      return await cacheFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate (HTML pages)
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
      return await staleWhileRevalidate(request);
    }
    
    // Strategy 4: Cache First for images
    if (request.destination === 'image') {
      return await cacheFirstImages(request);
    }
    
    // Default: Network First
    return await networkFirst(request);
    
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    return await handleOfflineFallback(request);
  }
}

// Network First strategy (for API calls)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fall back to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Cache First strategy (for static assets)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  const networkResponse = await fetch(request);
  
  if (networkResponse.status === 200) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Stale While Revalidate strategy (for HTML pages)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  return await fetchPromise || await handleOfflineFallback(request);
}

// Cache First for images with long-term caching
async function cacheFirstImages(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return placeholder image for offline
    return new Response(
      '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="var(--color-neutral-80, #f3f4f6)"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="var(--color-text-secondary, #6b7280)">Image unavailable offline</text></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// Handle offline fallbacks
async function handleOfflineFallback(request) {
  const url = new URL(request.url);
  
  // For navigation requests, return offline page
  if (request.mode === 'navigate') {
    const offlineResponse = await caches.match('/offline');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Fallback offline HTML
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline - Old Crown Restaurant</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0; padding: 20px; text-align: center; background: var(--color-background, #f9fafb);
            }
            .container { 
              max-width: 400px; margin: 100px auto; padding: 40px; 
              background: var(--color-surface, white); border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            }
            h1 { color: var(--color-brand-primary-light, #D4941E); margin-bottom: 16px; }
            p { color: var(--color-text-secondary, #6b7280); line-height: 1.6; }
            .icon { font-size: 48px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📱</div>
            <h1>You're Offline</h1>
            <p>It looks like you've lost your internet connection. The Old Crown Restaurant app works offline for previously visited pages.</p>
            <p><strong>Try:</strong></p>
            <ul style="text-align: left; color: var(--color-text-secondary, #6b7280);">
              <li>Check your internet connection</li>
              <li>Go back to a previously visited page</li>
              <li>Visit our menu (if you've been there before)</li>
            </ul>
          </div>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });
  }
  
  // For other requests, return a network error
  return new Response('Network error occurred', {
    status: 408,
    statusText: 'Network error occurred'
  });
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'reservation-sync') {
    event.waitUntil(syncReservations());
  }
  
  if (event.tag === 'contact-sync') {
    event.waitUntil(syncContactForms());
  }
});

// Sync pending reservations
async function syncReservations() {
  try {
    const db = await openIndexedDB();
    const pendingReservations = await getFromDB(db, 'reservations');
    
    for (const reservation of pendingReservations) {
      try {
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reservation.data)
        });
        
        if (response.ok) {
          await deleteFromDB(db, 'reservations', reservation.id);
          console.log('[SW] Reservation synced successfully');
        }
      } catch (error) {
        console.error('[SW] Failed to sync reservation:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Sync pending contact forms
async function syncContactForms() {
  try {
    const db = await openIndexedDB();
    const pendingForms = await getFromDB(db, 'contact-forms');
    
    for (const form of pendingForms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          await deleteFromDB(db, 'contact-forms', form.id);
          console.log('[SW] Contact form synced successfully');
        }
      } catch (error) {
        console.error('[SW] Failed to sync contact form:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Contact form sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'Your table reservation has been confirmed!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Menu',
        icon: '/menu-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/close-icon.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data = { ...options.data, ...data };
  }
  
  event.waitUntil(
    self.registration.showNotification('Old Crown Restaurant', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/menu'));
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow('/'));
  }
});

// IndexedDB helpers for offline data
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OldCrownDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('reservations')) {
        db.createObjectStore('reservations', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('contact-forms')) {
        db.createObjectStore('contact-forms', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getFromDB(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function deleteFromDB(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

console.log('[SW] Service worker script loaded');
