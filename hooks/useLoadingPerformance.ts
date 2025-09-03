"use client";

import { useEffect, useRef, useState } from 'react';
import { useLoadingManager } from './useSeamlessLoading';

interface LoadingMetrics {
  startTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  timeToInteractive?: number;
  loadingStages: {
    critical: number;
    aboveFold: number;
    belowFold: number;
  };
  componentLoadTimes: Record<string, number>;
}

interface PerformanceAnalytics {
  metrics: LoadingMetrics;
  recordComponentLoad: (componentId: string, loadTime: number) => void;
  recordStageComplete: (stage: keyof LoadingMetrics['loadingStages']) => void;
  getPerformanceReport: () => string;
}

/**
 * Hook for monitoring seamless loading performance
 */
export function useLoadingPerformance(): PerformanceAnalytics {
  const { state } = useLoadingManager();
  const [metrics, setMetrics] = useState<LoadingMetrics>({
    startTime: Date.now(),
    loadingStages: {
      critical: 0,
      aboveFold: 0,
      belowFold: 0
    },
    componentLoadTimes: {}
  });
  
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const navigationStartRef = useRef<number>(Date.now());

  useEffect(() => {
    navigationStartRef.current = performance.now();
    
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => ({
              ...prev,
              largestContentfulPaint: entry.startTime
            }));
          }
          
          if (entry.entryType === 'first-input') {
            setMetrics(prev => ({
              ...prev,
              firstInputDelay: (entry as any).processingStart - entry.startTime
            }));
          }
          
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            setMetrics(prev => ({
              ...prev,
              cumulativeLayoutShift: (prev.cumulativeLayoutShift || 0) + (entry as any).value
            }));
          }
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      performanceObserverRef.current = observer;
      
      return () => observer.disconnect();
    }
  }, []);

  // Track loading stage completions
  useEffect(() => {
    const currentTime = performance.now();
    
    if (state.stage.critical && metrics.loadingStages.critical === 0) {
      setMetrics(prev => ({
        ...prev,
        loadingStages: {
          ...prev.loadingStages,
          critical: currentTime - navigationStartRef.current
        }
      }));
    }
    
    if (state.stage.aboveFold && metrics.loadingStages.aboveFold === 0) {
      setMetrics(prev => ({
        ...prev,
        loadingStages: {
          ...prev.loadingStages,
          aboveFold: currentTime - navigationStartRef.current
        }
      }));
    }
    
    if (state.stage.belowFold && metrics.loadingStages.belowFold === 0) {
      setMetrics(prev => ({
        ...prev,
        loadingStages: {
          ...prev.loadingStages,
          belowFold: currentTime - navigationStartRef.current
        }
      }));
    }
  }, [state.stage]);

  const recordComponentLoad = (componentId: string, loadTime: number) => {
    setMetrics(prev => ({
      ...prev,
      componentLoadTimes: {
        ...prev.componentLoadTimes,
        [componentId]: loadTime
      }
    }));
  };
  
  const recordStageComplete = (stage: keyof LoadingMetrics['loadingStages']) => {
    const currentTime = performance.now();
    setMetrics(prev => ({
      ...prev,
      loadingStages: {
        ...prev.loadingStages,
        [stage]: currentTime - navigationStartRef.current
      }
    }));
  };
  
  const getPerformanceReport = (): string => {
    const report = {
      'Critical Loading Time': `${metrics.loadingStages.critical.toFixed(0)}ms`,
      'Above-fold Loading Time': `${metrics.loadingStages.aboveFold.toFixed(0)}ms`,
      'Below-fold Loading Time': `${metrics.loadingStages.belowFold.toFixed(0)}ms`,
      'Largest Contentful Paint': metrics.largestContentfulPaint ? `${metrics.largestContentfulPaint.toFixed(0)}ms` : 'N/A',
      'First Input Delay': metrics.firstInputDelay ? `${metrics.firstInputDelay.toFixed(0)}ms` : 'N/A',
      'Cumulative Layout Shift': metrics.cumulativeLayoutShift ? metrics.cumulativeLayoutShift.toFixed(3) : 'N/A',
      'Component Load Times': Object.entries(metrics.componentLoadTimes)
        .map(([component, time]) => `${component}: ${time.toFixed(0)}ms`)
        .join(', ') || 'None recorded'
    };
    
    return Object.entries(report)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  return {
    metrics,
    recordComponentLoad,
    recordStageComplete,
    getPerformanceReport
  };
}

/**
 * Development-only performance logger
 */
export function usePerformanceLogger() {
  const analytics = useLoadingPerformance();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log performance metrics after page load
      const timer = setTimeout(() => {
        console.group('🚀 Seamless Loading Performance Report');
        console.log(analytics.getPerformanceReport());
        console.groupEnd();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [analytics]);
  
  return analytics;
}
