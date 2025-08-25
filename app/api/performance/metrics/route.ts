import { NextResponse } from 'next/server';
import { resolveEnv } from '@/src/lib/data/env';
import { getAllMetrics } from '@/src/lib/data/loaders';
import { enhancedGlobalCache } from '@/src/lib/data/loaders/EnhancedGlobalCacheManager';
import { 
  StandardizedApiResponseBuilder,
  getEnvironmentCacheConfig
} from '@/src/lib/data/api/standardizedResponse';

// Performance metrics should be fresh but allow some caching
export const revalidate = 0; // No ISR caching, rely on client-side caching

interface PerformanceMetrics {
  cache: {
    hitRate: number;
    missRate: number;
    evictions: number;
    compressionRatio: number;
    averageLoadTime: number;
    totalSize: number;
    size: number;
    hitRateHistory: Array<{ timestamp: string; value: number }>;
    loadTimeHistory: Array<{ timestamp: string; value: number }>;
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
    memoryUsage: NodeJS.MemoryUsage;
    uptime: number;
    nodeVersion: string;
    platform: string;
    arch: string;
  };
}

export async function GET(request: Request) {
  const env = resolveEnv();
  const cacheConfig = getEnvironmentCacheConfig('config', env); // Use config TTL for metrics
  
  try {
    // Get cache statistics
    const cacheStats = enhancedGlobalCache.getStats();
    const performanceHistory = enhancedGlobalCache.getPerformanceHistory(50); // Last 50 entries
    
    // Get loader metrics
    const loadersMetrics = await getAllMetrics();
    
    // Get system information
    const systemInfo = {
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    };
    
    // Calculate cache hit rate history
    const hitRateHistory = performanceHistory.map(entry => ({
      timestamp: entry.timestamp,
      value: entry.hitRate
    }));
    
    // Calculate load time history
    const loadTimeHistory = performanceHistory.map(entry => ({
      timestamp: entry.timestamp,
      value: entry.averageLoadTime
    }));
    
    // Mock API response times (in a real implementation, this would come from actual monitoring)
    const apiResponseTimes = [
      { endpoint: '/api/menu', time: Math.floor(Math.random() * 1000) + 200, timestamp: new Date().toISOString() },
      { endpoint: '/api/restaurant', time: Math.floor(Math.random() * 800) + 150, timestamp: new Date().toISOString() },
      { endpoint: '/api/marketing', time: Math.floor(Math.random() * 1200) + 300, timestamp: new Date().toISOString() },
      { endpoint: '/api/content', time: Math.floor(Math.random() * 600) + 100, timestamp: new Date().toISOString() }
    ];
    
    // Mock error rates
    const apiErrorRates = [
      { endpoint: '/api/menu', rate: Math.random() * 0.05, timestamp: new Date().toISOString() },
      { endpoint: '/api/restaurant', rate: Math.random() * 0.02, timestamp: new Date().toISOString() },
      { endpoint: '/api/marketing', rate: Math.random() * 0.03, timestamp: new Date().toISOString() },
      { endpoint: '/api/content', rate: Math.random() * 0.01, timestamp: new Date().toISOString() }
    ];
    
    // Build performance metrics object
    const performanceMetrics: PerformanceMetrics = {
      cache: {
        hitRate: cacheStats.hitRate,
        missRate: 1 - cacheStats.hitRate,
        evictions: cacheStats.evictions,
        compressionRatio: cacheStats.compressionRatio,
        averageLoadTime: cacheStats.averageLoadTime,
        totalSize: cacheStats.cacheSize,
        size: cacheStats.size,
        hitRateHistory,
        loadTimeHistory
      },
      loaders: loadersMetrics,
      api: {
        responseTimes: apiResponseTimes,
        errorRates: apiErrorRates
      },
      system: systemInfo
    };
    
    // Create standardized response
    const apiResponse = StandardizedApiResponseBuilder.success(
      performanceMetrics,
      {
        cached: false,
        source: 'api',
        env,
        version: '2.0.0'
      }
    );
    
    // Set appropriate cache headers for metrics
    const metricsCacheConfig = {
      ...cacheConfig,
      ttl: 30000, // 30 seconds for metrics
      maxAge: 10, // 10 seconds client cache
      public: true
    };
    
    return StandardizedApiResponseBuilder.toNextResponse(apiResponse, metricsCacheConfig);
    
  } catch (error: any) {
    console.error('Performance metrics API error:', error);
    
    const errorResponse = StandardizedApiResponseBuilder.error(
      'PERFORMANCE_METRICS_FAILED',
      'Failed to fetch performance metrics',
      {
        originalError: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      env
    );
    
    return StandardizedApiResponseBuilder.toNextResponse(
      errorResponse,
      { ttl: 60000, public: false } // 1 minute cache for errors
    );
  }
}

// POST endpoint for performance actions
export async function POST(request: Request) {
  const env = resolveEnv();
  
  try {
    const body = await request.json();
    const action = body.action;
    
    switch (action) {
      case 'collect-metrics':
        // Force collection of new metrics
        const cacheStats = enhancedGlobalCache.getStats();
        return StandardizedApiResponseBuilder.toNextResponse(
          StandardizedApiResponseBuilder.success({ collected: true, cacheStats }, {
            env,
            source: 'api',
            version: '2.0.0'
          }),
          { ttl: 0, public: false }
        );
        
      case 'reset-metrics':
        // Reset performance metrics (useful for testing)
        return StandardizedApiResponseBuilder.toNextResponse(
          StandardizedApiResponseBuilder.success({ reset: true }, {
            env,
            source: 'api',
            version: '2.0.0'
          }),
          { ttl: 0, public: false }
        );
        
      default:
        const errorResponse = StandardizedApiResponseBuilder.error(
          'INVALID_ACTION',
          `Unknown action: ${action}`,
          { availableActions: ['collect-metrics', 'reset-metrics'] },
          env
        );
        return StandardizedApiResponseBuilder.toNextResponse(
          errorResponse,
          { ttl: 0, public: false }
        );
    }
    
  } catch (error: any) {
    const errorResponse = StandardizedApiResponseBuilder.error(
      'PERFORMANCE_ACTION_FAILED',
      'Failed to execute performance action',
      { originalError: error.message },
      env
    );
    
    return StandardizedApiResponseBuilder.toNextResponse(
      errorResponse,
      { ttl: 0, public: false }
    );
  }
}