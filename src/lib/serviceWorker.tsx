/**
 * Service Worker Registration and Management
 * Handles service worker lifecycle and provides utilities for cache management
 */

'use client';

import React from 'react';

interface ServiceWorkerMessage {
  type: string;
  payload?: any;
}

interface CacheStatus {
  caches: Record<string, { entries: number; urls: string[] }>;
  timestamp: string;
  version: string;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported = false;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.isSupported = 'serviceWorker' in navigator;
  }

  /**
   * Register service worker
   */
  async register(): Promise<boolean> {
    if (!this.isSupported) {
      console.log('[SWM] Service worker not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      });

      console.log('[SWM] Service worker registered:', this.registration.scope);

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          console.log('[SWM] New service worker installing...');
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SWM] New service worker installed, prompting update');
              this.emit('update-available');
            }
          });
        }
      });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleMessage(event.data);
      });

      // Handle controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[SWM] Service worker controller changed');
        this.emit('controller-change');
      });

      return true;
    } catch (error) {
      console.error('[SWM] Service worker registration failed:', error);
      return false;
    }
  }

  /**
   * Update service worker
   */
  async update(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
      console.log('[SWM] Service worker update check completed');
    } catch (error) {
      console.error('[SWM] Service worker update failed:', error);
    }
  }

  /**
   * Skip waiting and activate new service worker
   */
  async skipWaiting(): Promise<void> {
    if (!this.registration || !this.registration.waiting) return;

    this.sendMessage({ type: 'SKIP_WAITING' });
    
    // Reload page after new service worker takes control
    this.once('controller-change', () => {
      window.location.reload();
    });
  }

  /**
   * Send message to service worker
   */
  sendMessage(message: ServiceWorkerMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!navigator.serviceWorker.controller) {
        reject(new Error('No active service worker'));
        return;
      }

      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data);
        }
      };

      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    });
  }

  /**
   * Get cache status
   */
  async getCacheStatus(): Promise<CacheStatus | null> {
    try {
      return await this.sendMessage({ type: 'GET_CACHE_STATUS' });
    } catch (error) {
      console.error('[SWM] Failed to get cache status:', error);
      return null;
    }
  }

  /**
   * Clear caches
   */
  async clearCache(cacheNames?: string[]): Promise<void> {
    try {
      await this.sendMessage({
        type: 'CLEAR_CACHE',
        payload: { cacheNames: cacheNames || [] }
      });
      console.log('[SWM] Cache cleared');
    } catch (error) {
      console.error('[SWM] Failed to clear cache:', error);
    }
  }

  /**
   * Cache specific URLs
   */
  async cacheUrls(urls: string[]): Promise<void> {
    try {
      await this.sendMessage({
        type: 'CACHE_URLS',
        payload: { urls }
      });
      console.log('[SWM] URLs cached:', urls);
    } catch (error) {
      console.error('[SWM] Failed to cache URLs:', error);
    }
  }

  /**
   * Preload critical content
   */
  async preloadContent(): Promise<void> {
    const criticalUrls = [
      '/api/content',
      '/api/menu',
      '/api/restaurant',
      '/images/logo.png'
    ];

    try {
      await this.cacheUrls(criticalUrls);
      console.log('[SWM] Critical content preloaded');
    } catch (error) {
      console.error('[SWM] Failed to preload content:', error);
    }
  }

  /**
   * Event listener management
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  once(event: string, callback: Function): void {
    const wrappedCallback = (...args: any[]) => {
      callback(...args);
      this.off(event, wrappedCallback);
    };
    this.on(event, wrappedCallback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  private handleMessage(data: any): void {
    console.log('[SWM] Received message:', data);

    switch (data.type) {
      case 'SYNC_COMPLETE':
        this.emit('sync-complete', data);
        break;
      case 'CACHE_UPDATE':
        this.emit('cache-update', data);
        break;
      default:
        this.emit('message', data);
    }
  }

  /**
   * Check if app is running offline
   */
  get isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Get service worker state
   */
  get state(): string {
    if (!this.registration) return 'unregistered';
    if (this.registration.installing) return 'installing';
    if (this.registration.waiting) return 'waiting';
    if (this.registration.active) return 'active';
    return 'unknown';
  }
}

// Global service worker manager instance
export const swManager = new ServiceWorkerManager();

/**
 * React hook for service worker integration
 */
export function useServiceWorker() {
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [cacheStatus, setCacheStatus] = React.useState<CacheStatus | null>(null);

  React.useEffect(() => {
    // Register service worker
    swManager.register().then(setIsRegistered);

    // Listen for online/offline changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for service worker events
    swManager.on('update-available', () => setUpdateAvailable(true));
    swManager.on('sync-complete', () => {
      console.log('Background sync completed');
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateServiceWorker = React.useCallback(async () => {
    await swManager.skipWaiting();
    setUpdateAvailable(false);
  }, []);

  const getCacheStatus = React.useCallback(async () => {
    const status = await swManager.getCacheStatus();
    setCacheStatus(status);
    return status;
  }, []);

  const clearCache = React.useCallback(async () => {
    await swManager.clearCache();
    setCacheStatus(null);
  }, []);

  const preloadContent = React.useCallback(async () => {
    await swManager.preloadContent();
  }, []);

  return {
    isRegistered,
    isOnline,
    updateAvailable,
    cacheStatus,
    updateServiceWorker,
    getCacheStatus,
    clearCache,
    preloadContent
  };
}

/**
 * Initialize service worker for the app
 */
export async function initializeServiceWorker(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const registered = await swManager.register();
    
    if (registered) {
      console.log('✅ Service worker initialized successfully');
      
      // Preload critical content
      setTimeout(() => {
        swManager.preloadContent().catch(console.error);
      }, 2000);
    }
  } catch (error) {
    console.error('❌ Service worker initialization failed:', error);
  }
}

// Auto-initialize in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  initializeServiceWorker();
}

export default swManager;