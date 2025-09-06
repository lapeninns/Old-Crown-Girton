"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useLoadingManager } from './useSeamlessLoading';
import { getSharedObserver, createFallbackObserver, observe } from '@/src/lib/lazy/intersection';
import LoadQueue from '@/src/lib/lazy/loadQueue';

const LAZY_V2 = process.env.NEXT_PUBLIC_LAZY_V2 === 'true';
const queue = new LoadQueue();

interface ComponentLoadingOptions {
  /** Component identifier for tracking */
  componentId: string;
  /** Artificial minimum loading time to prevent flashing */
  minimumLoadTime?: number;
  /** Whether this component is critical (above-fold) */
  isCritical?: boolean;
  /** Dependencies that must load before this component */
  dependencies?: string[];
  /** Custom loading condition function */
  isReady?: () => boolean;
}

/**
 * Hook for managing individual component loading states
 * Integrates with the global LoadingManager for coordinated loading
 */
export function useComponentLoading({
  componentId,
  minimumLoadTime = 200,
  isCritical = false,
  dependencies = [],
  isReady
}: ComponentLoadingOptions) {
  const { state, markComponentLoaded, isComponentLoaded } = useLoadingManager();
  const [isLoading, setIsLoading] = useState(true);
  const [hasMinTimeElapsed, setHasMinTimeElapsed] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Handle minimum loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setHasMinTimeElapsed(true);
      }
    }, minimumLoadTime);

    return () => clearTimeout(timer);
  }, [minimumLoadTime]);

  // Check if dependencies are loaded
  const dependenciesLoaded = dependencies.every(dep => isComponentLoaded(dep));

  // Determine if component is ready to load
  const canLoad = dependenciesLoaded && (isReady ? isReady() : true);

  // Handle loading logic
  useEffect(() => {
    if (canLoad && hasMinTimeElapsed) {
      const loadComponent = async () => {
        try {
          // For critical components, load immediately
          if (isCritical) {
            if (mountedRef.current) {
              setIsLoading(false);
              markComponentLoaded(componentId);
            }
            return;
          }

          // For non-critical components, add slight delay for better UX
          await new Promise(resolve => setTimeout(resolve, 50));
          
          if (mountedRef.current) {
            setIsLoading(false);
            markComponentLoaded(componentId);
          }
        } catch (error) {
          console.warn(`Failed to load component ${componentId}:`, error);
          if (mountedRef.current) {
            setIsLoading(false);
          }
        }
      };

      loadComponent();
    }
  }, [canLoad, hasMinTimeElapsed, isCritical, componentId, markComponentLoaded]);

  return {
    isLoading,
    isLoaded: !isLoading,
    loadingProgress: hasMinTimeElapsed ? (canLoad ? 100 : 50) : 0,
    dependenciesLoaded,
    loadingTime: Date.now() - startTimeRef.current
  };
}

/**
 * Simplified hook for critical above-fold components
 */
export function useCriticalLoading(componentId: string, isReady?: () => boolean) {
  return useComponentLoading({
    componentId,
    minimumLoadTime: 50, // Faster for critical components
    isCritical: true,
    isReady
  });
}

/**
 * Hook for components that should load on scroll/interaction with enhanced performance
 */
export function useLazyLoading(
  componentId: string, 
  options: {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    enablePreloading?: boolean;
    root?: Element | null;
    onVisible?: () => void;
  } = {}
) {
  const {
    threshold = 0, // Changed to 0 for instant
    rootMargin = '300px 0px', // Adaptive default
    triggerOnce = true,
    enablePreloading = true,
    root,
    onVisible
  } = options;
  
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const elementRef = useRef<Element | null>(null);
  const unobserveRef = useRef<() => void>();

  // Adaptive margin
  const adaptiveMargin = useMemo(() => getAdaptiveRootMargin(rootMargin), [rootMargin]);

  const config = useMemo(() => ({ root, rootMargin: adaptiveMargin, threshold }), [root, adaptiveMargin, threshold]);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      setIsIntersecting(true);
      onVisible?.();
      if (triggerOnce) {
        unobserveRef.current?.();
      }
      if (enablePreloading && LAZY_V2) {
        queue.add(() => new Promise(resolve => {
          setIsPreloading(true);
          setTimeout(() => {
            setIsPreloading(false);
            resolve();
          }, 100);
        }));
      }
    }
  }, [triggerOnce, enablePreloading, onVisible]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if ('IntersectionObserver' in window && LAZY_V2) {
      const unobserve = observe(element, callback, config);
      unobserveRef.current = unobserve;
    } else {
      const unobserve = createFallbackObserver(element, callback, config);
      unobserveRef.current = unobserve;
    }

    return () => unobserveRef.current?.();
  }, [config, callback]);

  const loading = useComponentLoading({
    componentId,
    minimumLoadTime: 150,
    isCritical: false,
    isReady: () => isIntersecting
  });

  return {
    ...loading,
    ref: elementRef,
    isIntersecting,
    isPreloading
  };
}

// Helper
function getAdaptiveRootMargin(base: string): string {
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn.saveData || ['slow-2g', '2g'].includes(conn.effectiveType || '')) {
      return base.replace(/300px/, '100px'); // Simple replace
    }
  }
  return base;
}