/**
 * Service Worker Registration and Management
 * 
 * Handles registration, updates, and communication with the service worker
 * for the modular content system.
 */

import { getProductionConfig } from './config/production';

export interface ServiceWorkerManager {
  register: () => Promise<ServiceWorkerRegistration | null>;
  unregister: () => Promise<boolean>;
  update: () => Promise<boolean>;
  preloadModules: (modules: string[]) => Promise<void>;
  clearCache: (pattern?: string) => Promise<void>;
  getCacheStats: () => Promise<CacheStats>;
  onUpdate: (callback: (registration: ServiceWorkerRegistration) => void) => void;
  onOffline: (callback: () => void) => void;
  onOnline: (callback: () => void) => void;
}

export interface CacheStats {
  content: { count: number; size: number };
  static: { count: number; size: number };
  total: { count: number; size: number };
}

class ServiceWorkerManagerImpl implements ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateCallbacks: Array<(registration: ServiceWorkerRegistration) => void> = [];
  private offlineCallbacks: Array<() => void> = [];
  private onlineCallbacks: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupNetworkListeners();
    }
  }

  async register(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return null;
    }

    const config = getProductionConfig();
    
    // Only register in production or when explicitly enabled
    if (config.environment !== 'prod' && !process.env.NEXT_PUBLIC_ENABLE_SW) {
      console.log('Service Worker disabled in development');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      console.log('✅ Service Worker registered successfully');

      // Check for updates
      this.setupUpdateHandler();
      
      // Preload critical content
      await this.preloadCriticalContent();

      return this.registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      return null;
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const result = await this.registration.unregister();
      console.log('Service Worker unregistered');
      this.registration = null;
      return result;
    } catch (error) {
      console.error('Failed to unregister Service Worker:', error);
      return false;
    }
  }

  async update(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('Failed to update Service Worker:', error);
      return false;
    }
  }

  async preloadModules(modules: string[]): Promise<void> {
    if (!this.registration || !this.registration.active) {
      console.warn('Service Worker not available for preloading');
      return;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = () => {
        resolve();
      };

      this.registration!.active!.postMessage(
        {
          type: 'CACHE_PRELOAD',
          payload: { modules },
        },
        [messageChannel.port2]
      );
    });
  }

  async clearCache(pattern?: string): Promise<void> {
    if (!this.registration || !this.registration.active) {
      console.warn('Service Worker not available for cache clearing');
      return;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = () => {
        resolve();
      };

      this.registration!.active!.postMessage(
        {
          type: 'CACHE_CLEAR',
          payload: { pattern },
        },
        [messageChannel.port2]
      );
    });
  }

  async getCacheStats(): Promise<CacheStats> {
    if (!this.registration || !this.registration.active) {
      throw new Error('Service Worker not available for cache stats');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      setTimeout(() => {
        reject(new Error('Cache stats request timeout'));
      }, 5000);

      this.registration!.active!.postMessage(
        {
          type: 'CACHE_STATS',
        },
        [messageChannel.port2]
      );
    });
  }

  onUpdate(callback: (registration: ServiceWorkerRegistration) => void): void {
    this.updateCallbacks.push(callback);
  }

  onOffline(callback: () => void): void {
    this.offlineCallbacks.push(callback);
  }

  onOnline(callback: () => void): void {
    this.onlineCallbacks.push(callback);
  }

  private setupUpdateHandler(): void {
    if (!this.registration) return;

    this.registration.addEventListener('updatefound', () => {
      const installingWorker = this.registration!.installing;
      if (!installingWorker) return;

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New update available
            console.log('🆕 New Service Worker version available');
            this.updateCallbacks.forEach(callback => {
              callback(this.registration!);
            });
          }
        }
      });
    });
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('📶 Back online');
      this.onlineCallbacks.forEach(callback => callback());
    });

    window.addEventListener('offline', () => {
      console.log('📴 Gone offline');
      this.offlineCallbacks.forEach(callback => callback());
    });
  }

  private async preloadCriticalContent(): Promise<void> {
    const config = getProductionConfig();
    
    if (!config.features.performanceOptimization) {
      return;
    }

    // Preload critical modules based on configuration
    const criticalModules = [
      'core/global',
      'core/ui',
      'core/accessibility',
    ];

    try {
      await this.preloadModules(criticalModules);
      console.log('🚀 Critical content preloaded');
    } catch (error) {
      console.warn('Failed to preload critical content:', error);
    }
  }
}

// Singleton instance
let serviceWorkerManager: ServiceWorkerManager | null = null;

/**
 * Get the global service worker manager instance
 */
export function getServiceWorkerManager(): ServiceWorkerManager {
  if (!serviceWorkerManager) {
    serviceWorkerManager = new ServiceWorkerManagerImpl();
  }
  return serviceWorkerManager;
}

/**
 * Initialize service worker with default settings
 */
export async function initializeServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  const manager = getServiceWorkerManager();
  
  // Set up default event handlers
  manager.onUpdate((registration) => {
    // Show update notification to user
    if (typeof window !== 'undefined' && 'Notification' in window) {
      new Notification('App Update Available', {
        body: 'A new version of the app is available. Refresh to update.',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'app-update',
      });
    }
  });

  manager.onOffline(() => {
    // Show offline indicator
    document.body.classList.add('offline');
  });

  manager.onOnline(() => {
    // Hide offline indicator
    document.body.classList.remove('offline');
  });

  return manager.register();
}

/**
 * Hook for using service worker in React components
 */
export function useServiceWorker() {
  const manager = getServiceWorkerManager();

  return {
    preloadModules: manager.preloadModules.bind(manager),
    clearCache: manager.clearCache.bind(manager),
    getCacheStats: manager.getCacheStats.bind(manager),
    update: manager.update.bind(manager),
    onUpdate: manager.onUpdate.bind(manager),
    onOffline: manager.onOffline.bind(manager),
    onOnline: manager.onOnline.bind(manager),
  };
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  static getMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: Record<string, any> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      result[name] = {
        avg: values.reduce((sum, val) => sum + val, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    }
    
    return result;
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }
}

/**
 * Content performance utilities
 */
export function measureContentLoading<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  return operation().finally(() => {
    const duration = performance.now() - startTime;
    PerformanceMonitor.recordMetric(`content.${name}`, duration);
  });
}

// Auto-initialize in browser environment
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Initialize after page load
  window.addEventListener('load', () => {
    initializeServiceWorker().catch(console.error);
  });
}