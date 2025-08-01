/**
 * Performance monitoring utilities for Sprint 2
 * Tracks Core Web Vitals and custom performance metrics
 */

// Web Vitals monitoring
export interface WebVital {
  id: string;
  name: 'CLS' | 'INP' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  delta: number;
  entries: PerformanceEntry[];
}

// Performance configuration
const VITALS_URL = process.env.NEXT_PUBLIC_VITALS_URL || '/api/vitals';
const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID;

/**
 * Get connection speed information
 */
function getConnectionSpeed(): string {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return connection?.effectiveType || 'unknown';
  }
  return 'unknown';
}

/**
 * Send performance metric to analytics
 */
function sendToAnalytics(metric: WebVital): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Performance Metric:', metric);
    return;
  }
  
  if (!ANALYTICS_ID) return;

  const body = JSON.stringify({
    dsn: ANALYTICS_ID,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
    timestamp: Date.now(),
    user_agent: navigator.userAgent,
  });

  // Use sendBeacon for reliability, fallback to fetch
  if (navigator.sendBeacon) {
    navigator.sendBeacon(VITALS_URL, body);
  } else {
    fetch(VITALS_URL, {
      body,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      keepalive: true,
    }).catch(console.error);
  }
}

/**
 * Setup Web Vitals monitoring
 * Dynamically imports web-vitals to avoid bundle bloat
 */
export async function setupPerformanceMonitoring(): Promise<void> {
  try {
    const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');
    
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // INP replaced FID in web-vitals v4+
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);

    console.log('✅ Performance monitoring initialized');
  } catch (error) {
    console.warn('⚠️ Failed to initialize performance monitoring:', error);
  }
}

/**
 * Custom performance tracking for React components
 */
export class ComponentPerformanceTracker {
  private static instance: ComponentPerformanceTracker;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): ComponentPerformanceTracker {
    if (!ComponentPerformanceTracker.instance) {
      ComponentPerformanceTracker.instance = new ComponentPerformanceTracker();
    }
    return ComponentPerformanceTracker.instance;
  }

  /**
   * Start tracking component render time
   */
  startTracking(componentName: string): string {
    const trackingId = `${componentName}-${Date.now()}-${Math.random()}`;
    performance.mark(`${trackingId}-start`);
    return trackingId;
  }

  /**
   * End tracking and record render time
   */
  endTracking(trackingId: string, componentName: string): void {
    performance.mark(`${trackingId}-end`);
    performance.measure(trackingId, `${trackingId}-start`, `${trackingId}-end`);
    
    const measure = performance.getEntriesByName(trackingId)[0];
    if (measure) {
      this.recordMetric(componentName, measure.duration);
      
      // Clean up performance marks
      performance.clearMarks(`${trackingId}-start`);
      performance.clearMarks(`${trackingId}-end`);
      performance.clearMeasures(trackingId);
    }
  }

  /**
   * Record component performance metric
   */
  private recordMetric(componentName: string, duration: number): void {
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, []);
    }
    
    const componentMetrics = this.metrics.get(componentName)!;
    componentMetrics.push(duration);
    
    // Keep only last 100 measurements
    if (componentMetrics.length > 100) {
      componentMetrics.shift();
    }

    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && duration > 16) {
      console.warn(`🐌 Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Get performance stats for a component
   */
  getStats(componentName: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
  } | null {
    const metrics = this.metrics.get(componentName);
    if (!metrics || metrics.length === 0) return null;

    const sorted = [...metrics].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const average = sum / count;
    const min = sorted[0];
    const max = sorted[count - 1];
    const p95Index = Math.floor(count * 0.95);
    const p95 = sorted[p95Index];

    return { count, average, min, max, p95 };
  }

  /**
   * Get all performance stats
   */
  getAllStats(): Record<string, ReturnType<ComponentPerformanceTracker['getStats']>> {
    const stats: Record<string, ReturnType<ComponentPerformanceTracker['getStats']>> = {};
    
    this.metrics.forEach((_, componentName) => {
      stats[componentName] = this.getStats(componentName);
    });
    
    return stats;
  }
}

/**
 * React hook for component performance tracking
 */
export function useComponentPerformance(componentName: string) {
  const tracker = ComponentPerformanceTracker.getInstance();
  
  return {
    startTracking: () => tracker.startTracking(componentName),
    endTracking: (trackingId: string) => tracker.endTracking(trackingId, componentName),
    getStats: () => tracker.getStats(componentName),
  };
}

/**
 * Bundle size monitoring
 */
export function logBundleSize(): void {
  if (typeof window === 'undefined') return;
  
  // Log bundle information in development
  if (process.env.NODE_ENV === 'development') {
    console.group('📦 Bundle Information');
    console.log('Page:', window.location.pathname);
    console.log('User Agent:', navigator.userAgent);
    console.log('Connection:', getConnectionSpeed());
    console.groupEnd();
  }
}

/**
 * Memory usage monitoring
 */
export function monitorMemoryUsage(): void {
  if (typeof window === 'undefined' || !('performance' in window)) return;
  
  const memory = (performance as any).memory;
  if (!memory) return;

  const used = Math.round(memory.usedJSHeapSize / 1048576); // MB
  const total = Math.round(memory.totalJSHeapSize / 1048576); // MB
  const limit = Math.round(memory.jsHeapSizeLimit / 1048576); // MB

  if (process.env.NODE_ENV === 'development') {
    console.log(`🧠 Memory Usage: ${used}MB / ${total}MB (Limit: ${limit}MB)`);
  }

  // Alert if memory usage is high
  if (used > limit * 0.8) {
    console.warn('⚠️ High memory usage detected:', { used, total, limit });
  }
}
