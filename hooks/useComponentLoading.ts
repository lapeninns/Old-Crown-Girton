"use client";

import { useEffect, useState, useRef } from 'react';
import { useLoadingManager } from './useSeamlessLoading';

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
  } = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '100px 0px',
    triggerOnce = true,
    enablePreloading = true
  } = options;
  
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create intersection observer with optimized settings
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { 
        threshold, 
        rootMargin: enablePreloading ? rootMargin : '0px'
      }
    );

    observerRef.current = observer;
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, enablePreloading]);

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