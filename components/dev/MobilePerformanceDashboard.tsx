"use client";

import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  LCP: number;
  FID: number;
  CLS: number;
  FCP: number;
  TTFB: number;
  networkType: string;
  isSlowNetwork: boolean;
  bundleSize: number;
  cacheHitRate: number;
}

interface ServiceWorkerStats {
  isRegistered: boolean;
  isActivated: boolean;
  cacheStats: Record<string, number>;
}

/**
 * Mobile Performance Dashboard for Development
 * Shows real-time performance metrics and optimization insights
 * 
 * To use: Add to your app only in development mode
 * <MobilePerformanceDashboard />
 */
export default function MobilePerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [swStats, setSwStats] = useState<ServiceWorkerStats | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<string>('unknown');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    collectPerformanceMetrics();
    checkServiceWorkerStatus();
    measureNetworkSpeed();

    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      collectPerformanceMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const collectPerformanceMetrics = () => {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const ttfb = navigation.responseStart - navigation.requestStart;

      // Web Vitals (simplified - real implementation would use web-vitals library)
      const lcp = getLCP();
      const fid = getFID();
      const cls = getCLS();

      // Network info
      const connection = (navigator as any)?.connection;
      const networkType = connection?.effectiveType || 'unknown';
      const isSlowNetwork = ['slow-2g', '2g', '3g'].includes(networkType);

      setMetrics({
        LCP: lcp,
        FID: fid,
        CLS: cls,
        FCP: fcp,
        TTFB: ttfb,
        networkType,
        isSlowNetwork,
        bundleSize: getBundleSize(),
        cacheHitRate: getCacheHitRate()
      });
    } catch (error) {
      console.warn('Failed to collect performance metrics:', error);
    }
  };

  const getLCP = (): number => {
    // Simplified LCP calculation
    const largestPaint = performance.getEntriesByType('largest-contentful-paint').pop() as any;
    return largestPaint?.startTime || 0;
  };

  const getFID = (): number => {
    // Simplified FID calculation (would need proper event listener)
    return 0; // Placeholder
  };

  const getCLS = (): number => {
    // Simplified CLS calculation (would need layout shift observer)
    return 0; // Placeholder
  };

  const getBundleSize = (): number => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(r => r.name.includes('.js'));
    return jsResources.reduce((total, resource) => total + (resource.transferSize || 0), 0);
  };

  const getCacheHitRate = (): number => {
    // Calculate cache hit rate based on resource loading
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const cachedResources = resources.filter(r => r.transferSize === 0).length;
    return resources.length > 0 ? (cachedResources / resources.length) * 100 : 0;
  };

  const checkServiceWorkerStatus = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        const isRegistered = !!registration;
        const isActivated = registration?.active?.state === 'activated';

        let cacheStats = {};
        if (registration?.active) {
          // Request cache stats from service worker
          const messageChannel = new MessageChannel();
          registration.active.postMessage({ type: 'CACHE_STATS' }, [messageChannel.port2]);
          
          messageChannel.port1.onmessage = (event) => {
            cacheStats = event.data;
            setSwStats({ isRegistered, isActivated, cacheStats });
          };
        } else {
          setSwStats({ isRegistered, isActivated, cacheStats });
        }
      } catch (error) {
        console.warn('Failed to check service worker status:', error);
      }
    }
  };

  const measureNetworkSpeed = () => {
    const start = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const duration = performance.now() - start;
      const size = 50 * 1024; // Assume 50KB test image
      const speed = (size / duration) * 1000; // bytes per second
      
      if (speed > 1000000) setNetworkSpeed('fast (>1MB/s)');
      else if (speed > 500000) setNetworkSpeed('medium (500KB-1MB/s)');
      else setNetworkSpeed('slow (<500KB/s)');
    };
    
    img.onerror = () => setNetworkSpeed('failed');
    img.src = '/images/logo.png?' + Date.now();
  };

  const getMetricColor = (metric: string, value: number): string => {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 600, poor: 1500 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'text-gray-600';

    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white shadow-2xl rounded-lg border border-gray-200 font-mono text-xs">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer bg-gray-50 rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold text-gray-700">📱 Mobile Perf</span>
        <span className="text-gray-500">{isExpanded ? '−' : '+'}</span>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 max-w-sm">
          {/* Core Web Vitals */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Core Web Vitals</h3>
            {metrics && (
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 bg-gray-50 rounded ${getMetricColor('LCP', metrics.LCP)}`}>
                  <div className="font-medium">LCP</div>
                  <div>{Math.round(metrics.LCP)}ms</div>
                </div>
                <div className={`p-2 bg-gray-50 rounded ${getMetricColor('FCP', metrics.FCP)}`}>
                  <div className="font-medium">FCP</div>
                  <div>{Math.round(metrics.FCP)}ms</div>
                </div>
                <div className={`p-2 bg-gray-50 rounded ${getMetricColor('TTFB', metrics.TTFB)}`}>
                  <div className="font-medium">TTFB</div>
                  <div>{Math.round(metrics.TTFB)}ms</div>
                </div>
                <div className="p-2 bg-gray-50 rounded text-gray-600">
                  <div className="font-medium">Cache Hit</div>
                  <div>{Math.round(metrics.cacheHitRate)}%</div>
                </div>
              </div>
            )}
          </div>

          {/* Network Info */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Network</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className={metrics?.isSlowNetwork ? 'text-red-600' : 'text-green-600'}>
                  {metrics?.networkType || 'unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Speed:</span>
                <span>{networkSpeed}</span>
              </div>
              <div className="flex justify-between">
                <span>Bundle:</span>
                <span>{metrics ? formatBytes(metrics.bundleSize) : '...'}</span>
              </div>
            </div>
          </div>

          {/* Service Worker Status */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Service Worker</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={swStats?.isActivated ? 'text-green-600' : 'text-red-600'}>
                  {swStats?.isActivated ? 'Active' : 'Inactive'}
                </span>
              </div>
              {swStats?.cacheStats && Object.keys(swStats.cacheStats).length > 0 && (
                <div>
                  <div className="text-gray-600 mb-1">Caches:</div>
                  {Object.entries(swStats.cacheStats).map(([name, count]) => (
                    <div key={name} className="flex justify-between text-xs">
                      <span className="truncate">{name.split('-')[0]}:</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Optimization Tips */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Tips</h3>
            <div className="text-xs text-gray-600 space-y-1">
              {metrics?.isSlowNetwork && (
                <div className="text-orange-600">• Slow network detected</div>
              )}
              {metrics && metrics.LCP > 2500 && (
                <div className="text-red-600">• LCP needs improvement</div>
              )}
              {metrics && metrics.cacheHitRate < 50 && (
                <div className="text-yellow-600">• Low cache hit rate</div>
              )}
              <div>• Test on real devices</div>
              <div>• Use Chrome DevTools mobile</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={measureNetworkSpeed}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
            >
              Test Speed
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
            >
              Reload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}