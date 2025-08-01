// Core Web Vitals tracking and performance monitoring
'use client';

import React, { useEffect, useState } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

declare global {
  interface Window {
    gtag?: (event: string, name: string, parameters: any) => void;
  }
}

// Performance metrics interface
interface PerformanceMetrics {
  cls: number;
  inp: number;
  fcp: number;
  lcp: number;
  ttfb: number;
}

interface StoredMetric {
  value: number;
  rating: string;
  timestamp: number;
}

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
}

// Web Vitals tracker component
const WebVitalsTracker = (): null => {
  const sendToAnalytics = (metric: Metric) => {
    // In a real app, you'd send this to your analytics service
    // For now, we'll log to console and store in localStorage for debugging
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
    
    // Store metrics in localStorage for debugging
    const existingMetrics = JSON.parse(localStorage.getItem('webVitals') || '{}');
    existingMetrics[metric.name] = {
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now()
    };
    localStorage.setItem('webVitals', JSON.stringify(existingMetrics));

    // You can also send to analytics services like Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
  };

  useEffect(() => {
    // Track Core Web Vitals (FID is replaced by INP in web-vitals v5)
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // Interaction to Next Paint (replaces FID)
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null; // This component doesn't render anything
};

// Performance observer for custom metrics
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Mark the start of a performance measurement
  mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-start`);
    }
  }

  // Mark the end and calculate duration
  measure(name: string): number | null {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measure = performance.getEntriesByName(name)[0];
        const duration = measure?.duration || 0;
        
        this.metrics.set(name, duration);
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
        
        // Clean up marks
        performance.clearMarks(`${name}-start`);
        performance.clearMarks(`${name}-end`);
        performance.clearMeasures(name);
        
        return duration;
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error);
        return null;
      }
    }
    return null;
  }

  // Get all collected metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics.entries());
  }

  // Track bundle loading times
  trackBundleLoad(bundleName: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name.includes(bundleName)) {
            console.log(`[Bundle Load] ${bundleName}: ${entry.duration.toFixed(2)}ms`);
            this.metrics.set(`bundle-${bundleName}`, entry.duration);
          }
        });
      });
      
      observer.observe({ type: 'navigation', buffered: true });
      observer.observe({ type: 'resource', buffered: true });
    }
  }

  // Track component render times
  trackComponentRender(componentName: string, renderTime: number): void {
    const metricName = `component-${componentName}`;
    this.metrics.set(metricName, renderTime);
    console.log(`[Component Render] ${componentName}: ${renderTime.toFixed(2)}ms`);
  }
}

// React hook for performance tracking
const usePerformanceTracking = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();

  const startTracking = () => {
    monitor.mark(componentName);
  };

  const endTracking = () => {
    return monitor.measure(componentName);
  };

  const trackRender = (callback: () => void) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    monitor.trackComponentRender(componentName, end - start);
  };

  return { startTracking, endTracking, trackRender };
};

// Performance debug panel component
const PerformanceDebugPanel = () => {
  const [metrics, setMetrics] = useState<Record<string, StoredMetric | number>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load metrics from localStorage
    const loadMetrics = () => {
      const webVitals = JSON.parse(localStorage.getItem('webVitals') || '{}');
      const performanceMetrics = PerformanceMonitor.getInstance().getMetrics();
      setMetrics({ ...webVitals, ...performanceMetrics });
    };

    loadMetrics();
    const interval = setInterval(loadMetrics, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-crown-gold text-white p-2 rounded-full shadow-lg hover:bg-crown-gold-dark transition-colors"
        title="Toggle Performance Debug Panel"
      >
        📊
      </button>

      {/* Debug panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3 text-crown-slate">Performance Metrics</h3>
          
          <div className="space-y-2 text-sm">
            {Object.entries(metrics).map(([key, value]) => {
              const isWebVital = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB'].includes(key);
              const metricValue = typeof value === 'object' && value !== null ? (value as StoredMetric).value : (value as number);
              const displayValue = isWebVital 
                ? `${metricValue}${key === 'CLS' ? '' : 'ms'}`
                : `${typeof metricValue === 'number' ? metricValue.toFixed(2) : metricValue}ms`;
              
              const rating = typeof value === 'object' && value !== null ? (value as StoredMetric).rating : 'unknown';
              const ratingColor = rating === 'good' ? 'text-green-600' : rating === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600';
              
              return (
                <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="font-medium">{key}:</span>
                  <span className={isWebVital ? ratingColor : 'text-gray-600'}>
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={() => {
              localStorage.removeItem('webVitals');
              setMetrics({});
            }}
            className="mt-3 text-xs text-red-600 hover:text-red-800 underline"
          >
            Clear Metrics
          </button>
        </div>
      )}
    </>
  );
};

// Higher-order component for performance tracking
const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  const PerformanceTrackedComponent = (props: P) => {
    const { trackRender } = usePerformanceTracking(componentName);
    
    useEffect(() => {
      trackRender(() => {
        // Component has rendered
      });
    });

    return <WrappedComponent {...props} />;
  };

  PerformanceTrackedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return PerformanceTrackedComponent;
};

// Export performance utilities
export {
  WebVitalsTracker,
  PerformanceMonitor,
  usePerformanceTracking,
  PerformanceDebugPanel,
  withPerformanceTracking
};
