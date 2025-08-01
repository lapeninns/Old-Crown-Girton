// Advanced Web Vitals Analytics Dashboard
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Web Vitals Metrics Interface
interface WebVitalsMetrics {
  // Core Web Vitals
  CLS: number | null;      // Cumulative Layout Shift
  INP: number | null;      // Interaction to Next Paint (replaced FID)
  FCP: number | null;      // First Contentful Paint
  LCP: number | null;      // Largest Contentful Paint
  TTFB: number | null;     // Time to First Byte

  // Additional Performance Metrics
  navigationTiming: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    timeToInteractive: number;
  } | null;
  
  // Resource Loading
  resourceMetrics: {
    totalResources: number;
    totalSize: number;
    imageCount: number;
    scriptCount: number;
    stylesheetCount: number;
  } | null;

  // Restaurant-Specific Metrics
  restaurantMetrics: {
    menuLoadTime: number | null;
    heroImageLoadTime: number | null;
    reservationFormReady: number | null;
    contactInfoVisible: number | null;
  };
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: number;
  suggestions: string[];
}

// Performance thresholds based on Core Web Vitals standards
const PERFORMANCE_THRESHOLDS = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  INP: { good: 200, needsImprovement: 500 },
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  TTFB: { good: 800, needsImprovement: 1800 }
};

export const useWebVitalsAnalytics = () => {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    CLS: null,
    INP: null,
    FCP: null,
    LCP: null,
    TTFB: null,
    navigationTiming: null,
    resourceMetrics: null,
    restaurantMetrics: {
      menuLoadTime: null,
      heroImageLoadTime: null,
      reservationFormReady: null,
      contactInfoVisible: null
    }
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  // Initialize Web Vitals tracking
  const initializeTracking = useCallback(async () => {
    if (typeof window === 'undefined' || isTracking) return;
    
    setIsTracking(true);

    try {
      // Import web-vitals dynamically to avoid SSR issues
      const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');

      // Track Core Web Vitals
      onCLS((metric: any) => {
        setMetrics(prev => ({ ...prev, CLS: metric.value }));
        checkThreshold('CLS', metric.value);
      });

      onINP((metric: any) => {
        setMetrics(prev => ({ ...prev, INP: metric.value }));
        checkThreshold('INP', metric.value);
      });

      onFCP((metric: any) => {
        setMetrics(prev => ({ ...prev, FCP: metric.value }));
        checkThreshold('FCP', metric.value);
      });

      onLCP((metric: any) => {
        setMetrics(prev => ({ ...prev, LCP: metric.value }));
        checkThreshold('LCP', metric.value);
      });

      onTTFB((metric: any) => {
        setMetrics(prev => ({ ...prev, TTFB: metric.value }));
        checkThreshold('TTFB', metric.value);
      });

      // Track Navigation Timing
      trackNavigationTiming();
      
      // Track Resource Metrics
      trackResourceMetrics();
      
      // Track Restaurant-Specific Metrics
      trackRestaurantMetrics();

    } catch (error) {
      console.error('Error initializing Web Vitals tracking:', error);
    }
  }, [isTracking]);

  // Check performance thresholds and create alerts
  const checkThreshold = (metric: string, value: number) => {
    const threshold = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!threshold) return;

    let alertType: 'warning' | 'error' | 'info' = 'info';
    let suggestions: string[] = [];

    if (value > threshold.needsImprovement) {
      alertType = 'error';
      suggestions = getOptimizationSuggestions(metric, value);
    } else if (value > threshold.good) {
      alertType = 'warning';
      suggestions = getOptimizationSuggestions(metric, value);
    }

    if (alertType !== 'info') {
      const alert: PerformanceAlert = {
        id: `${metric}-${Date.now()}`,
        type: alertType,
        metric,
        value,
        threshold: threshold.good,
        message: `${metric} is ${alertType === 'error' ? 'poor' : 'needs improvement'}: ${value.toFixed(2)}ms`,
        timestamp: Date.now(),
        suggestions
      };

      setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
    }
  };

  // Get optimization suggestions based on metric
  const getOptimizationSuggestions = (metric: string, value: number): string[] => {
    const suggestions: Record<string, string[]> = {
      CLS: [
        'Add size attributes to images and videos',
        'Reserve space for dynamic content',
        'Avoid inserting content above existing content',
        'Use CSS transform instead of changing layout properties'
      ],
      INP: [
        'Optimize event handlers',
        'Debounce frequent interactions',
        'Use CSS animations over JavaScript',
        'Reduce DOM complexity'
      ],
      FCP: [
        'Reduce server response time',
        'Eliminate render-blocking resources',
        'Minify CSS and JavaScript',
        'Use efficient image formats (WebP, AVIF)'
      ],
      LCP: [
        'Optimize critical resource loading',
        'Preload key resources',
        'Optimize images (compression, sizing)',
        'Use CDN for faster delivery'
      ],
      TTFB: [
        'Optimize server performance',
        'Use CDN for static assets',
        'Enable HTTP/2 and HTTP/3',
        'Implement efficient caching strategies'
      ]
    };

    return suggestions[metric] || ['Optimize overall performance'];
  };

  // Track Navigation Timing API metrics
  const trackNavigationTiming = () => {
    if (!window.performance?.timing) return;

    const timing = window.performance.timing;
    const navigationStart = timing.navigationStart;

    const navigationMetrics = {
      domContentLoaded: timing.domContentLoadedEventEnd - navigationStart,
      loadComplete: timing.loadEventEnd - navigationStart,
      firstPaint: 0, // Will be populated by Performance Observer
      timeToInteractive: 0 // Calculated based on various factors
    };

    // Use Performance Observer for First Paint
    if (window.PerformanceObserver) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-paint') {
            navigationMetrics.firstPaint = entry.startTime;
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }

    setMetrics(prev => ({ ...prev, navigationTiming: navigationMetrics }));
  };

  // Track Resource Loading Metrics
  const trackResourceMetrics = () => {
    if (!window.performance?.getEntriesByType) return;

    const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const resourceMetrics = {
      totalResources: resources.length,
      totalSize: resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
      imageCount: resources.filter(r => r.initiatorType === 'img').length,
      scriptCount: resources.filter(r => r.initiatorType === 'script').length,
      stylesheetCount: resources.filter(r => r.initiatorType === 'link').length
    };

    setMetrics(prev => ({ ...prev, resourceMetrics }));
  };

  // Track Restaurant-Specific Performance Metrics
  const trackRestaurantMetrics = () => {
    // Menu Load Time
    const menuObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.classList.contains('menu-container')) {
          const menuLoadTime = performance.now();
          setMetrics(prev => ({
            ...prev,
            restaurantMetrics: { ...prev.restaurantMetrics, menuLoadTime }
          }));
          menuObserver.disconnect();
        }
      });
    });

    // Hero Image Load Time
    const heroImage = document.querySelector('img[src*="hero"]') as HTMLImageElement;
    if (heroImage) {
      if (heroImage.complete) {
        setMetrics(prev => ({
          ...prev,
          restaurantMetrics: { ...prev.restaurantMetrics, heroImageLoadTime: performance.now() }
        }));
      } else {
        heroImage.addEventListener('load', () => {
          setMetrics(prev => ({
            ...prev,
            restaurantMetrics: { ...prev.restaurantMetrics, heroImageLoadTime: performance.now() }
          }));
        });
      }
    }

    // Observe menu container when it exists
    setTimeout(() => {
      const menuContainer = document.querySelector('.menu-container');
      if (menuContainer) {
        menuObserver.observe(menuContainer);
      }
    }, 1000);
  };

  // Calculate Performance Score (0-100)
  const calculatePerformanceScore = (): number => {
    const { CLS, INP, FCP, LCP, TTFB } = metrics;
    if (!CLS || !INP || !FCP || !LCP || !TTFB) return 0;

    const scores = {
      CLS: CLS <= 0.1 ? 100 : CLS <= 0.25 ? 75 : 50,
      INP: INP <= 200 ? 100 : INP <= 500 ? 75 : 50,
      FCP: FCP <= 1800 ? 100 : FCP <= 3000 ? 75 : 50,
      LCP: LCP <= 2500 ? 100 : LCP <= 4000 ? 75 : 50,
      TTFB: TTFB <= 800 ? 100 : TTFB <= 1800 ? 75 : 50
    };

    return Math.round(Object.values(scores).reduce((sum, score) => sum + score, 0) / 5);
  };

  // Export metrics to analytics service
  const exportMetrics = useCallback(() => {
    const exportData = {
      ...metrics,
      performanceScore: calculatePerformanceScore(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType || 'unknown'
    };

    // In production, send to your analytics service
    console.log('Performance metrics exported:', exportData);
    
    return exportData;
  }, [metrics]);

  useEffect(() => {
    initializeTracking();
  }, [initializeTracking]);

  return {
    metrics,
    alerts,
    isTracking,
    performanceScore: calculatePerformanceScore(),
    exportMetrics,
    clearAlerts: () => setAlerts([])
  };
};

// Performance Dashboard Component
export const PerformanceDashboard = () => {
  const { metrics, alerts, performanceScore, clearAlerts } = useWebVitalsAnalytics();
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricStatus = (metric: string, value: number | null) => {
    if (!value) return 'text-gray-400';
    
    const threshold = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!threshold) return 'text-gray-600';

    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.needsImprovement) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 left-4 z-40"
      >
        <button
          onClick={() => setIsExpanded(true)}
          className={`
            bg-white rounded-full shadow-lg border-2 p-3 hover:shadow-xl transition-all
            ${performanceScore >= 90 ? 'border-green-500' : performanceScore >= 75 ? 'border-yellow-500' : 'border-red-500'}
          `}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${performanceScore >= 90 ? 'bg-green-500' : performanceScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${getScoreColor(performanceScore)}`}>
              {performanceScore}
            </span>
          </div>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="fixed bottom-4 left-4 z-40 bg-white rounded-xl shadow-2xl border border-gray-200 w-96 max-h-96 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${performanceScore >= 90 ? 'bg-green-500' : performanceScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} />
          <div>
            <h3 className="font-semibold text-gray-900">Performance</h3>
            <p className={`text-sm font-medium ${getScoreColor(performanceScore)}`}>
              Score: {performanceScore}/100
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Core Web Vitals */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Core Web Vitals</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-600">LCP</div>
            <div className={`font-medium ${getMetricStatus('LCP', metrics.LCP)}`}>
              {metrics.LCP ? `${metrics.LCP.toFixed(0)}ms` : '—'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-600">INP</div>
            <div className={`font-medium ${getMetricStatus('INP', metrics.INP)}`}>
              {metrics.INP ? `${metrics.INP.toFixed(0)}ms` : '—'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-600">CLS</div>
            <div className={`font-medium ${getMetricStatus('CLS', metrics.CLS)}`}>
              {metrics.CLS ? metrics.CLS.toFixed(3) : '—'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-600">TTFB</div>
            <div className={`font-medium ${getMetricStatus('TTFB', metrics.TTFB)}`}>
              {metrics.TTFB ? `${metrics.TTFB.toFixed(0)}ms` : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Metrics */}
      {metrics.restaurantMetrics && (
        <div className="p-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Restaurant Metrics</h4>
          <div className="space-y-2 text-xs">
            {metrics.restaurantMetrics.menuLoadTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Menu Load Time</span>
                <span className="font-medium">{metrics.restaurantMetrics.menuLoadTime.toFixed(0)}ms</span>
              </div>
            )}
            {metrics.restaurantMetrics.heroImageLoadTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Hero Image Load</span>
                <span className="font-medium">{metrics.restaurantMetrics.heroImageLoadTime.toFixed(0)}ms</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performance Alerts */}
      {alerts.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-gray-700">Alerts</h4>
            <button
              onClick={clearAlerts}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`p-2 rounded text-xs ${
                  alert.type === 'error' ? 'bg-red-50 text-red-800' :
                  alert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                  'bg-blue-50 text-blue-800'
                }`}
              >
                <div className="font-medium">{alert.message}</div>
                {alert.suggestions.length > 0 && (
                  <div className="mt-1 text-xs opacity-80">
                    • {alert.suggestions[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PerformanceDashboard;
