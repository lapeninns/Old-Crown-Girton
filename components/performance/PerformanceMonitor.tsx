'use client';

import { useEffect, useRef } from 'react';

/**
 * Performance monitor for tracking scroll jank and animation performance
 * This helps ensure our optimizations are working effectively across the website
 */
export function PerformanceMonitor(): null {
  const metricsRef = useRef({
    scrollJank: 0,
    animationFrameDrops: 0,
    lastFrameTime: 0,
    isMonitoring: false
  });

  useEffect(() => {
    // Only run performance monitoring in development
    if (process.env.NODE_ENV !== 'development') return;

    let animationId: number;
    const metrics = metricsRef.current;
    
    function measureFrameRate() {
      const now = performance.now();
      
      if (metrics.lastFrameTime > 0) {
        const frameDuration = now - metrics.lastFrameTime;
        // Target is 16.67ms for 60fps
        if (frameDuration > 20) {
          metrics.animationFrameDrops++;
        }
      }
      
      metrics.lastFrameTime = now;
      
      if (metrics.isMonitoring) {
        animationId = requestAnimationFrame(measureFrameRate);
      }
    }

    // Monitor scroll performance
    let scrollTimeout: NodeJS.Timeout;
    function handleScroll() {
      clearTimeout(scrollTimeout);
      
      const startTime = performance.now();
      
      scrollTimeout = setTimeout(() => {
        const scrollDuration = performance.now() - startTime;
        if (scrollDuration > 16.67) {
          metrics.scrollJank++;
        }
      }, 100);
    }

    // Start monitoring
    metrics.isMonitoring = true;
    animationId = requestAnimationFrame(measureFrameRate);
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Log performance metrics periodically
    const metricsInterval = setInterval(() => {
      if (metrics.animationFrameDrops > 0 || metrics.scrollJank > 0) {
        console.group('🚀 Performance Metrics');
        console.log('Animation frame drops:', metrics.animationFrameDrops);
        console.log('Scroll jank events:', metrics.scrollJank);
        console.log('Consider using PerformantMotion components for smoother animations');
        console.groupEnd();
        
        // Reset metrics
        metrics.animationFrameDrops = 0;
        metrics.scrollJank = 0;
      }
    }, 10000); // Log every 10 seconds

    return () => {
      metrics.isMonitoring = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(metricsInterval);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Performance monitor doesn't render anything
  return null;
}

/**
 * Hook to measure component render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderTimeRef = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      renderTimeRef.current = renderTime;
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  return renderTimeRef.current;
}

/**
 * Performance-aware scroll handler
 */
export function createOptimizedScrollHandler(
  callback: () => void,
  delay: number = 100
) {
  let timeoutId: NodeJS.Timeout;
  let animationId: number;

  return function optimizedScrollHandler() {
    // Cancel previous calls
    clearTimeout(timeoutId);
    cancelAnimationFrame(animationId);

    // Use requestAnimationFrame for smooth performance
    animationId = requestAnimationFrame(() => {
      timeoutId = setTimeout(callback, delay);
    });
  };
}

export default PerformanceMonitor;