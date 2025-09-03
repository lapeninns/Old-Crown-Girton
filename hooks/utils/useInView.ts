/**
 * Optimized useInView hook for restaurant website
 * Integrates with existing performance monitoring and follows project standards
 * Based on the project's intersection observer patterns with enhanced performance
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from '@/lib/motion/accessibility';

export interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  skip?: boolean;
  initialInView?: boolean;
  trackPerformance?: boolean;
  elementId?: string;
  delay?: number;
}

export interface UseInViewResult {
  ref: React.RefObject<any>;
  isInView: boolean;
  hasTriggered: boolean;
  entry?: IntersectionObserverEntry;
}

/**
 * Performance-optimized intersection observer hook
 * Features:
 * - Respects reduced motion preferences
 * - Optional performance tracking
 * - Memory leak prevention
 * - Threshold optimization for restaurant content
 * - Integration with existing performance monitoring
 */
export function useInView(options: UseInViewOptions = {}): UseInViewResult {
  const {
    threshold = 0.15, // Optimized for restaurant content sections
    rootMargin = '0px 0px -10% 0px', // Trigger slightly before coming into view
    triggerOnce = true,
    skip = false,
    initialInView = false,
    trackPerformance = false,
    elementId,
    delay = 0,
  } = options;

  const [isInView, setIsInView] = useState(initialInView);
  const [hasTriggered, setHasTriggered] = useState(initialInView);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const ref = useRef<any>(null);
  const observerRef = useRef<IntersectionObserver>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const prefersReducedMotion = useReducedMotion();

  // Performance tracking (optional)
  const trackIntersection = useCallback((isIntersecting: boolean, element?: Element) => {
    if (!trackPerformance || !element) return;
    
    try {
      const elementName = elementId || element.tagName.toLowerCase();
      const metricName = `intersection:${elementName}:${isIntersecting ? 'enter' : 'exit'}`;
      performance.mark(metricName);
      
      // Track timing for performance monitoring
      if (isIntersecting && !hasTriggered) {
        performance.measure(
          `${elementName}:first-view`,
          'navigationStart',
          metricName
        );
      }
    } catch (error) {
      // Silently handle performance API errors
      console.debug('Performance tracking error:', error);
    }
  }, [elementId, hasTriggered, trackPerformance]);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [currentEntry] = entries;
    if (!currentEntry) return;

    setEntry(currentEntry);
    const isCurrentlyInView = currentEntry.isIntersecting;
    
    // Apply delay if specified
    if (delay > 0 && isCurrentlyInView) {
      timeoutRef.current = setTimeout(() => {
        setIsInView(true);
        if (!hasTriggered) {
          setHasTriggered(true);
          trackIntersection(true, currentEntry.target);
        }
      }, delay);
    } else {
      setIsInView(isCurrentlyInView);
      
      if (isCurrentlyInView && !hasTriggered) {
        setHasTriggered(true);
        trackIntersection(true, currentEntry.target);
      }
    }

    // Disconnect observer if triggerOnce and element is in view
    if (triggerOnce && isCurrentlyInView && observerRef.current) {
      observerRef.current.disconnect();
    }
  }, [delay, hasTriggered, triggerOnce, trackIntersection]);

  useEffect(() => {
    const element = ref.current;
    
    // Skip if no element, skip flag is true, or reduced motion is preferred for non-essential animations
    if (!element || skip) return;
    
    // For reduced motion, trigger immediately for essential content
    if (prefersReducedMotion && triggerOnce) {
      setIsInView(true);
      setHasTriggered(true);
      return;
    }

    // Create intersection observer with optimized settings
    try {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold,
        rootMargin,
        // Use passive event handling for better performance
      });

      observerRef.current.observe(element);
    } catch (error) {
      console.warn('IntersectionObserver not supported, falling back to immediate trigger');
      setIsInView(true);
      setHasTriggered(true);
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, skip, prefersReducedMotion, triggerOnce, handleIntersection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ref,
    isInView,
    hasTriggered,
    entry,
  };
}

/**
 * Specialized hook for menu cards with optimized settings
 */
export function useInViewMenuCard(delay = 0) {
  return useInView({
    threshold: 0.2,
    rootMargin: '0px 0px -15% 0px',
    triggerOnce: true,
    trackPerformance: true,
    elementId: 'menu-card',
    delay,
  });
}

/**
 * Specialized hook for section headers
 */
export function useInViewSectionHeader() {
  return useInView({
    threshold: 0.3,
    rootMargin: '0px 0px -5% 0px',
    triggerOnce: true,
    trackPerformance: true,
    elementId: 'section-header',
  });
}

/**
 * Specialized hook for hero content (immediate trigger)
 */
export function useInViewHero() {
  return useInView({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
    initialInView: true, // Hero should be immediately visible
    trackPerformance: true,
    elementId: 'hero',
  });
}

/**
 * Hook for staggered animations (multiple elements)
 */
export function useInViewStagger(itemCount: number, staggerDelay = 50) {
  const refs = useRef<(HTMLElement | null)[]>(new Array(itemCount).fill(null));
  const [triggeredItems, setTriggeredItems] = useState<boolean[]>(new Array(itemCount).fill(false));
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      // Immediately trigger all items for reduced motion
      setTriggeredItems(new Array(itemCount).fill(true));
      return;
    }

    const observers: IntersectionObserver[] = [];

    refs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setTriggeredItems(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * staggerDelay);
            
            observer.disconnect();
          }
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -10% 0px',
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [itemCount, staggerDelay, prefersReducedMotion]);

  const setRef = useCallback((index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el;
  }, []);

  return {
    setRef,
    triggeredItems,
  };
}

export default useInView;