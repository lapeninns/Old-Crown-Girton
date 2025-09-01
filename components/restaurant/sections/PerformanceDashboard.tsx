/**
 * Performance Monitoring Dashboard
 * 
 * A comprehensive dashboard for monitoring Restaurant_BP performance metrics with:
 * - Real-time cache performance visualization
 * - System health status indicators
 * - API response time tracking
 * - Resource loading metrics
 * - Performance recommendations
 */

"use client";
import React, { useState, useEffect } from 'react';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useContent } from '@/hooks/data';

interface PerformanceMetrics {
  cache: {
    hitRate: number;
    missRate: number;
    evictions: number;
    compressionRatio: number;
    averageLoadTime: number;
    totalSize: number;
    size: number;
  };
  loaders: {
    menu: any;
    restaurant: any;
    marketing: any;
    content: any;
  };
  api: {
    responseTimes: Array<{ endpoint: string; time: number; timestamp: string }>;
    errorRates: Array<{ endpoint: string; rate: number; timestamp: string }>;
  };
  system: {
    memoryUsage: number;
    uptime: number;
    nodeVersion: string;
  };
}

interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    dataLoaders: { status: 'healthy' | 'degraded' | 'unhealthy'; details: any };
    cache: { status: 'healthy' | 'degraded' | 'unhealthy'; details: any };
    api: { status: 'healthy' | 'degraded' | 'unhealthy'; details: any };
  };
  recommendations: string[];
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const { data: content } = useContent();

  // Get content strings or fallbacks
  const uiLabels = content?.global?.ui?.labels;
  const uiMessages = content?.global?.ui?.messages;
  const uiButtons = content?.global?.ui?.buttons;

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const [metricsResponse, healthResponse] = await Promise.all([
          fetchWithResilience('/api/performance/metrics'),
          fetchWithResilience('/api/health')
        ]);

        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setMetrics(metricsData.data);
        }

        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          setHealth(healthData.data);
        }
      } catch (err) {
        setError(uiMessages?.fetchFailed || 'Failed to fetch performance data');
        console.error('Performance dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleRefresh = () => {
    // Trigger manual refresh
    window.location.reload();
  };

  const handleOptimizeCache = async () => {
    try {
      const response = await fetchWithResilience('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cache-optimize' })
      });

      if (response.ok) {
        alert(uiMessages?.cacheOptimizationSuccess || 'Cache optimization completed successfully');
      } else {
        alert(uiMessages?.cacheOptimizationFailed || 'Cache optimization failed');
      }
    } catch (err) {
      alert(uiMessages?.cacheOptimizationFailed || 'Failed to optimize cache');
    }
  };

  const handleWarmCache = async () => {
    try {
      const response = await fetchWithResilience('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cache-warm' })
      });

      if (response.ok) {
        alert(uiMessages?.cacheWarmingSuccess || 'Cache warming initiated successfully');
      } else {
        alert(uiMessages?.cacheWarmingFailed || 'Cache warming failed');
      }
    } catch (err) {
      alert(uiMessages?.cacheWarmingFailed || 'Failed to warm cache');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-red-600">Error Loading Performance Data</h3>
          </div>
          <div>
            <p className="text-red-500">{error}</p>
            <Button onClick={handleRefresh} className="mt-4">{uiButtons?.retry || 'Retry'}</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Performance Monitoring Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={handleRefresh}>{uiButtons?.refresh || 'Refresh'}</Button>
          <Button onClick={handleOptimizeCache} variant="outline">{uiButtons?.optimizeCache || 'Optimize Cache'}</Button>
          <Button onClick={handleWarmCache} variant="outline">{uiButtons?.warmCache || 'Warm Cache'}</Button>
        </div>
      </div>

      {/* Health Status */}
      {health && (
        <Card className="p-6">
          <div className="mb-4">
            <h3 className={`text-lg font-semibold flex items-center ${
              health.overall === 'healthy' ? 'text-green-600' :
              health.overall === 'degraded' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              System Health: {health.overall.toUpperCase()}
            </h3>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded ${
                health.checks.dataLoaders.status === 'healthy' ? 'bg-green-100' :
                health.checks.dataLoaders.status === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <h3 className="font-semibold">Data Loaders</h3>
                <p>Status: {health.checks.dataLoaders.status}</p>
              </div>
              <div className={`p-4 rounded ${
                health.checks.cache.status === 'healthy' ? 'bg-green-100' :
                health.checks.cache.status === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <h3 className="font-semibold">Cache</h3>
                <p>Status: {health.checks.cache.status}</p>
              </div>
              <div className={`p-4 rounded ${
                health.checks.api.status === 'healthy' ? 'bg-green-100' :
                health.checks.api.status === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <h3 className="font-semibold">API</h3>
                <p>Status: {health.checks.api.status}</p>
              </div>
            </div>

            {health.recommendations.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded">
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {health.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Cache Performance Metrics */}
      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="mb-2">
                <h3 className="text-sm font-medium">Cache Hit Rate</h3>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {(metrics.cache.hitRate * 100).toFixed(1)}%
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${metrics.cache.hitRate * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-2">
                <h3 className="text-sm font-medium">Average Load Time</h3>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {metrics.cache.averageLoadTime.toFixed(0)}ms
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  Target: &lt;2000ms
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-2">
                <h3 className="text-sm font-medium">Compression Ratio</h3>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {(metrics.cache.compressionRatio * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  Space saved
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-2">
                <h3 className="text-sm font-medium">Cache Size</h3>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {(metrics.cache.totalSize / (1024 * 1024)).toFixed(1)}MB
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  {metrics.cache.size} entries
                </p>
              </div>
            </Card>
          </div>

          {/* API Response Times */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">API Response Times</h3>
            </div>
            <div>
              <div className="h-64">
                {metrics.api.responseTimes.length > 0 ? (
                  <div className="space-y-2">
                    {metrics.api.responseTimes.slice(-10).map((entry, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-32 text-sm truncate">{entry.endpoint}</div>
                        <div className="flex-1 ml-2">
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(entry.time / 50, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 text-right text-sm">
                          {entry.time}ms
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500">No recent API data available</p>
                )}
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Loader Metrics */}
      {metrics && (
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Data Loader Performance</h3>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(metrics.loaders).map(([loaderName, loaderMetrics]) => (
                <div key={loaderName} className="border rounded p-4">
                  <h3 className="font-semibold capitalize">{loaderName}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div>Total Requests: {loaderMetrics.totalRequests}</div>
                    <div>Cache Hits: {loaderMetrics.cacheHits}</div>
                    <div>API Successes: {loaderMetrics.apiSuccesses}</div>
                    <div>Errors: {loaderMetrics.errors}</div>
                    <div>Avg Load Time: {loaderMetrics.averageLoadTime.toFixed(0)}ms</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PerformanceDashboard;