// Service Worker registration and PWA utilities
'use client';

import { useEffect, useState } from 'react';

// Extend ServiceWorkerRegistration interface for background sync
declare global {
  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
    };
  }
  
  interface Window {
    BeforeInstallPromptEvent?: any;
    deferredPrompt?: BeforeInstallPromptEvent;
  }

  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }
}

// Service Worker registration hook
export const useServiceWorker = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      setRegistration(reg);
      setIsRegistered(true);

      // Service Worker registered successfully

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
              // New service worker available
            }
          });
        }
      });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        // Message received from SW
      });

    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  };

  const updateServiceWorker = async () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      window.location.reload();
    }
  };

  return {
    isSupported,
    isRegistered,
    registration,
    updateAvailable,
    updateServiceWorker
  };
};

// PWA install prompt hook
export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      // Install prompt available
    };

    // Listen for successful install
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      // App installed successfully
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    try {
      (deferredPrompt as any).prompt();
      const { outcome } = await (deferredPrompt as any).userChoice;
      
      if (outcome === 'accepted') {
        // User accepted install prompt
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        // User dismissed install prompt
        return false;
      }
    } catch (error) {
      console.error('[PWA] Install prompt failed:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    promptInstall
  };
};

// Offline status hook
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Connection restored
        // Could trigger a sync or show a notification
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      // Connection lost
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
};

// Background sync utility
export const useBackgroundSync = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      setIsSupported(true);
    }
  }, []);

  const requestBackgroundSync = async (tag: string) => {
    if (!isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration.sync) {
        await registration.sync.register(tag);
        // Background sync registered
        return true;
      }
      console.warn('[PWA] Background sync not supported');
      return false;
    } catch (error) {
      console.error('[PWA] Background sync registration failed:', error);
      return false;
    }
  };

  return { isSupported, requestBackgroundSync };
};

// Push notifications utility
export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ('Notification' in window && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('[PWA] Notification permission request failed:', error);
      return false;
    }
  };

  const subscribeToPush = async () => {
    if (!isSupported || permission !== 'granted') return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY
      });

      setSubscription(sub);
      // Push subscription successful
      return sub;
    } catch (error) {
      console.error('[PWA] Push subscription failed:', error);
      return null;
    }
  };

  const unsubscribeFromPush = async () => {
    if (subscription) {
      try {
        await subscription.unsubscribe();
        setSubscription(null);
        // Push unsubscription successful
        return true;
      } catch (error) {
        console.error('[PWA] Push unsubscription failed:', error);
        return false;
      }
    }
    return false;
  };

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush
  };
};

// Offline data storage utility
export const useOfflineStorage = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('indexedDB' in window);
  }, []);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('OldCrownDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('reservations')) {
          db.createObjectStore('reservations', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('contact-forms')) {
          db.createObjectStore('contact-forms', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('favorites')) {
          db.createObjectStore('favorites', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  };

  const storeOfflineData = async (storeName: string, data: any) => {
    if (!isSupported) return false;

    try {
      const db = await openDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      await new Promise((resolve, reject) => {
        const request = store.add({ data, timestamp: Date.now() });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Data stored offline
      return true;
    } catch (error) {
      console.error('[PWA] Offline storage failed:', error);
      return false;
    }
  };

  const getOfflineData = async (storeName: string) => {
    if (!isSupported) return [];

    try {
      const db = await openDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      return await new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('[PWA] Offline data retrieval failed:', error);
      return [];
    }
  };

  return {
    isSupported,
    storeOfflineData,
    getOfflineData
  };
};

// PWA analytics and metrics
export const usePWAMetrics = () => {
  const [metrics, setMetrics] = useState({
    isStandalone: false,
    displayMode: 'browser',
    installSource: 'unknown'
  });

  useEffect(() => {
    // Detect display mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    
    let displayMode = 'browser';
    if (isStandalone) displayMode = 'standalone';
    else if (window.matchMedia('(display-mode: minimal-ui)').matches) displayMode = 'minimal-ui';
    else if (window.matchMedia('(display-mode: fullscreen)').matches) displayMode = 'fullscreen';

    setMetrics({
      isStandalone,
      displayMode,
      installSource: localStorage.getItem('pwa-install-source') || 'unknown'
    });

    // Track PWA usage
    if (isStandalone) {
      // Running in standalone mode
      // Could send analytics event here
    }
  }, []);

  const trackInstallSource = (source: string) => {
    localStorage.setItem('pwa-install-source', source);
    setMetrics(prev => ({ ...prev, installSource: source }));
  };

  return { metrics, trackInstallSource };
};
