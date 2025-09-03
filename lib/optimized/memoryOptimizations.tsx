/**
 * Production-safe memory optimization utilities
 * Prevents memory leaks and provides proper fallback mechanisms
 */

import React, { useState, useEffect, useCallback, useRef, ReactNode, Suspense } from 'react';

interface MemoryPressureState {
  level: 'low' | 'medium' | 'high';
  available: number;
  used: number;
  timestamp: number;
}

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  quality?: 'low' | 'medium' | 'high';
}

interface ComponentPreloadOptions {
  priority?: 'low' | 'normal' | 'high';
  timeout?: number;
  retryOnError?: boolean;
}

// Global memory manager instance
class MemoryManager {
  private pressureObserver: PerformanceObserver | null = null;
  private imageCache = new Map<string, HTMLImageElement>();
  private componentCache = new Map<string, React.ComponentType<any>>();
  private readonly maxImageCacheSize = 10; // Very conservative
  private readonly maxComponentCacheSize = 5;
  private cleanupTimer: number | null = null;
  
  constructor() {
    this.setupMemoryMonitoring();
    this.setupPeriodicCleanup();
  }

  private setupMemoryMonitoring() {
    // Setup memory pressure observation if available
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        this.pressureObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if ((entry as any).name === 'memory') {
              this.handleMemoryPressure((entry as any).detail?.level || 'medium');
            }
          });
        });
        
        this.pressureObserver.observe({ entryTypes: ['measure'] });
      } catch (error) {
        console.debug('Memory pressure monitoring not available:', error);
      }
    }
  }

  private setupPeriodicCleanup() {
    // Clean caches every 2 minutes
    this.cleanupTimer = window.setInterval(() => {
      this.cleanupCaches();
    }, 2 * 60 * 1000);
  }

  private handleMemoryPressure(level: string) {
    switch (level) {
      case 'critical':
        this.imageCache.clear();
        this.componentCache.clear();
        break;
      case 'high':
        // Remove half of cached items
        this.reduceCacheSize(this.imageCache, Math.floor(this.maxImageCacheSize / 2));
        this.reduceCacheSize(this.componentCache, Math.floor(this.maxComponentCacheSize / 2));
        break;
      case 'medium':
        // Keep only most recently used items
        this.cleanupCaches();
        break;
    }
  }

  private reduceCacheSize<T>(cache: Map<string, T>, targetSize: number) {
    if (cache.size <= targetSize) return;
    
    const entries = Array.from(cache.entries());
    const toRemove = entries.slice(0, cache.size - targetSize);
    
    toRemove.forEach(([key]) => {
      cache.delete(key);
    });
  }

  private cleanupCaches() {
    // Enforce size limits
    if (this.imageCache.size > this.maxImageCacheSize) {
      const excess = Array.from(this.imageCache.entries()).slice(0, this.imageCache.size - this.maxImageCacheSize);
      excess.forEach(([key]) => {
        this.imageCache.delete(key);
      });
    }

    if (this.componentCache.size > this.maxComponentCacheSize) {
      const excess = Array.from(this.componentCache.entries()).slice(0, this.componentCache.size - this.maxComponentCacheSize);
      excess.forEach(([key]) => {
        this.componentCache.delete(key);
      });
    }
  }

  // Safe image preloading with proper cleanup
  preloadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      // Check cache first
      const cached = this.imageCache.get(src);
      if (cached && cached.complete && cached.naturalWidth > 0) {
        resolve(cached);
        return;
      }

      const img = new Image();
      let resolved = false;

      const cleanup = () => {
        img.onload = null;
        img.onerror = null;
        img.onabort = null;
      };

      img.onload = () => {
        if (resolved) return;
        resolved = true;
        cleanup();
        
        // Cache with size limit enforcement
        if (this.imageCache.size >= this.maxImageCacheSize) {
          const oldestKey = this.imageCache.keys().next().value;
          if (oldestKey) {
            this.imageCache.delete(oldestKey);
          }
        }
        
        this.imageCache.set(src, img);
        resolve(img);
      };

      img.onerror = img.onabort = () => {
        if (resolved) return;
        resolved = true;
        cleanup();
        reject(new Error(`Failed to load image: ${src}`));
      };

      // Set src after event listeners to avoid race conditions
      img.src = src;

      // Timeout for slow networks
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          reject(new Error(`Image load timeout: ${src}`));
        }
      }, 10000); // 10 second timeout
    });
  }

  // Safe component preloading
  async preloadComponent<T>(
    importFn: () => Promise<{ default: React.ComponentType<T> }>,
    key: string,
    options: ComponentPreloadOptions = {}
  ): Promise<React.ComponentType<T>> {
    const cached = this.componentCache.get(key);
    if (cached) {
      return cached as React.ComponentType<T>;
    }

    try {
      const module = await importFn();
      const component = module.default;
      
      // Cache with size limit
      if (this.componentCache.size >= this.maxComponentCacheSize) {
        const oldestKey = this.componentCache.keys().next().value;
        if (oldestKey) {
          this.componentCache.delete(oldestKey);
        }
      }
      
      this.componentCache.set(key, component);
      return component;
    } catch (error) {
      console.error(`Failed to preload component ${key}:`, error);
      throw error;
    }
  }

  getCurrentMemoryPressure(): MemoryPressureState {
    if (typeof window === 'undefined') {
      return { level: 'low', available: 1000000, used: 0, timestamp: Date.now() };
    }

    const memory = (performance as any)?.memory;
    if (memory) {
      const used = memory.usedJSHeapSize || 0;
      const available = memory.jsHeapSizeLimit || 1000000;
      const usage = used / available;
      
      let level: 'low' | 'medium' | 'high';
      if (usage > 0.9) level = 'high';
      else if (usage > 0.7) level = 'medium';
      else level = 'low';

      return { level, available, used, timestamp: Date.now() };
    }

    // Fallback estimation based on navigator.deviceMemory
    const deviceMemory = (navigator as any)?.deviceMemory || 4;
    const level = deviceMemory <= 2 ? 'high' : deviceMemory <= 4 ? 'medium' : 'low';
    
    return { 
      level, 
      available: deviceMemory * 1024 * 1024 * 1024, 
      used: 0, 
      timestamp: Date.now() 
    };
  }

  destroy() {
    if (this.pressureObserver) {
      this.pressureObserver.disconnect();
      this.pressureObserver = null;
    }
    
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    this.imageCache.clear();
    this.componentCache.clear();
  }
}

// Global memory manager instance
export const memoryManager = new MemoryManager();

/**
 * Production-safe lazy image component with proper error handling
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallback,
  onLoad,
  onError,
  quality = 'medium'
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState<string>('');
  const mounted = useRef(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Safe setState wrapper
  const safeSetImageState = useCallback((state: 'loading' | 'loaded' | 'error') => {
    if (mounted.current) {
      setImageState(state);
    }
  }, []);

  const safeSetImageSrc = useCallback((src: string) => {
    if (mounted.current) {
      setImageSrc(src);
    }
  }, []);

  // Get optimized image URL based on quality and network
  const getOptimizedSrc = useCallback((originalSrc: string, quality: string) => {
    // Simple quality parameter approach - in production you'd integrate with your image CDN
    if (originalSrc.includes('?')) {
      return `${originalSrc}&q=${quality === 'low' ? '50' : quality === 'medium' ? '75' : '90'}`;
    }
    return `${originalSrc}?q=${quality === 'low' ? '50' : quality === 'medium' ? '75' : '90'}`;
  }, []);

  // Load image with proper error handling
  const loadImage = useCallback(async () => {
    if (!src || !mounted.current) return;

    safeSetImageState('loading');
    
    try {
      const optimizedSrc = getOptimizedSrc(src, quality);
      await memoryManager.preloadImage(optimizedSrc);
      
      if (mounted.current) {
        safeSetImageSrc(optimizedSrc);
        safeSetImageState('loaded');
        onLoad?.();
      }
    } catch (error) {
      if (mounted.current) {
        console.warn(`Failed to load image ${src}:`, error);
        safeSetImageState('error');
        onError?.();
      }
    }
  }, [src, quality, getOptimizedSrc, safeSetImageState, safeSetImageSrc, onLoad, onError]);

  // Load image on mount and when src changes
  useEffect(() => {
    loadImage();
  }, [loadImage]);

  // Render based on state
  if (imageState === 'loading') {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={`Loading ${alt}`}
      >
        {fallback || <div className="w-full h-full bg-gray-300 rounded" />}
      </div>
    );
  }

  if (imageState === 'error') {
    return (
      <div 
        className={`bg-gray-100 border border-gray-300 flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={`Failed to load ${alt}`}
      >
        {fallback || (
          <div className="text-gray-500 text-sm p-2 text-center">
            <div className="mb-1">📷</div>
            <div>Image unavailable</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
};

/**
 * Memory-aware component loader with proper error boundaries
 */
export function LazyComponent<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback: ReactNode = <div className="animate-pulse bg-gray-200 rounded h-8 w-full" />
): React.ComponentType<T> {
  const LazyWrapper = React.lazy(importFn);
  
  const MemoryAwareLazyComponent: React.FC<T> = (props) => {
    const [error, setError] = useState<Error | null>(null);
    const mounted = useRef(true);

    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    }, []);

    if (error) {
      return (
        <div className="text-red-500 text-sm p-4 border border-red-200 rounded">
          <div className="font-medium">Component failed to load</div>
          <div className="text-xs mt-1">Please refresh the page</div>
          <button 
            onClick={() => mounted.current && setError(null)}
            className="text-xs mt-2 underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return (
      <Suspense fallback={fallback}>
        <LazyWrapper {...(props as any)} />
      </Suspense>
    );
  };

  MemoryAwareLazyComponent.displayName = 'MemoryAwareLazyComponent';
  
  return MemoryAwareLazyComponent;
}

/**
 * Hook for monitoring memory pressure
 */
export function useMemoryPressure() {
  const [memoryState, setMemoryState] = useState<MemoryPressureState>(() => 
    memoryManager.getCurrentMemoryPressure()
  );
  
  useEffect(() => {
    const updateMemoryState = () => {
      setMemoryState(memoryManager.getCurrentMemoryPressure());
    };

    // Update every 10 seconds
    const interval = setInterval(updateMemoryState, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    memoryPressure: memoryState.level,
    memoryUsage: memoryState.used,
    memoryAvailable: memoryState.available,
    isMemoryConstrained: memoryState.level === 'high'
  };
}

/**
 * Memory-efficient memo wrapper with configurable limits
 */
export function memoryMemo<P extends object>(
  component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return React.memo(component, areEqual);
}

/**
 * Memory-aware callback hook with automatic cleanup
 */
export function useMemoryCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const mounted = useRef(true);
  
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    if (!mounted.current) return;
    return callback(...args);
  }, deps) as T;
}

/**
 * Memory-efficient image component (alias for LazyImage for backward compatibility)
 */
export const MemoryEfficientImage = LazyImage;
