import { NextResponse } from 'next/server';
import { resolveEnv } from '@/src/lib/data/env';
import { getAllHealthStatus, getAllMetrics } from '@/src/lib/data/loaders';
import { enhancedGlobalCache } from '@/src/lib/data/loaders/EnhancedGlobalCacheManager';
import { 
  StandardizedApiResponseBuilder, 
  withRequestTiming 
} from '@/src/lib/data/api/standardizedResponse';

// Health check should be fresh and not cached
export const revalidate = 0;

interface SystemHealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  environment: string;
  version: string;
  uptime: number;
  checks: {
    dataLoaders: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      details: any;
    };
    cache: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      details: any;
    };
    api: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      details: {
        responseTime: number;
        errors: number;
      };
    };
  };
  metrics: {
    loaders: any;
    cache: any;
    performance: any;
  };
  recommendations: string[];
}

export async function GET() {
  const env = resolveEnv();
  const startTime = Date.now();
  const checks: SystemHealthStatus['checks'] = {
    dataLoaders: { status: 'healthy', details: {} },
    cache: { status: 'healthy', details: {} },
    api: { status: 'healthy', details: { responseTime: 0, errors: 0 } }
  };
  
  const recommendations: string[] = [];
  
  try {
    // Check data loaders health
    const timedHealthCheck = withRequestTiming(
      () => getAllHealthStatus(env),
      'health-check'
    );
    
    const { result: loadersHealth, timing: healthTiming } = await timedHealthCheck();
    checks.dataLoaders.status = loadersHealth.overall;
    checks.dataLoaders.details = loadersHealth;
    
    if (loadersHealth.overall !== 'healthy') {
      recommendations.push('Some data loaders are experiencing issues');
    }
    
    // Check cache health
    const cacheHealth = await enhancedGlobalCache.getHealthStatus();
    checks.cache.status = cacheHealth.overall;
    checks.cache.details = cacheHealth.details;
    
    if (cacheHealth.overall !== 'healthy') {
      recommendations.push(...cacheHealth.recommendations);
    }
    
    // Get performance metrics
    const loadersMetrics = await getAllMetrics();
    const cacheStats = enhancedGlobalCache.getStats();
    const performanceHistory = enhancedGlobalCache.getPerformanceHistory(10);
    
    // API response time check
    const apiResponseTime = Date.now() - startTime;
    checks.api.details.responseTime = apiResponseTime;
    
    if (apiResponseTime > 1000) {
      checks.api.status = 'degraded';
      recommendations.push('API response time is slower than expected');
    } else if (apiResponseTime > 500) {
      checks.api.status = 'degraded';
      recommendations.push('API response time could be improved');
    }
    
    // Determine overall system health
    const overallStatuses = [
      checks.dataLoaders.status,
      checks.cache.status,
      checks.api.status
    ];
    
    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (overallStatuses.every(status => status === 'healthy')) {
      overall = 'healthy';
    } else if (overallStatuses.some(status => status === 'healthy' || status === 'degraded')) {
      overall = 'degraded';
    } else {
      overall = 'unhealthy';
    }
    
    // Build comprehensive health response
    const healthStatus: SystemHealthStatus = {
      overall,
      timestamp: new Date().toISOString(),
      environment: env,
      version: '2.0.0',
      uptime: process.uptime(),
      checks,
      metrics: {
        loaders: loadersMetrics,
        cache: {
          stats: cacheStats,
          performance: performanceHistory
        },
        performance: {
          healthCheckTime: healthTiming,
          apiResponseTime,
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version
        }
      },
      recommendations
    };
    
    // Create standardized response with appropriate caching
    const apiResponse = StandardizedApiResponseBuilder.success(
      healthStatus,
      {
        cached: false,
        source: 'api',
        env,
        loadTime: apiResponseTime,
        version: '2.0.0'
      }
    );
    
    // Health endpoint should not be cached for long
    const cacheConfig = {
      ttl: 30000, // 30 seconds
      maxAge: 0, // No client caching
      public: false,
      enableETag: false,
      enableLastModified: false
    };
    
    return StandardizedApiResponseBuilder.toNextResponse(apiResponse, cacheConfig);
    
  } catch (error: any) {
    console.error('Health check failed:', error);
    
    // Even if health check fails, try to return partial information
    const partialHealth: SystemHealthStatus = {
      overall: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: env,
      version: '2.0.0',
      uptime: process.uptime(),
      checks,
      metrics: {
        loaders: {},
        cache: {},
        performance: {
          apiResponseTime: Date.now() - startTime,
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version,
          error: error.message
        }
      },
      recommendations: ['System health check failed - immediate attention required']
    };
    
    const errorResponse = StandardizedApiResponseBuilder.success(
      partialHealth,
      {
        cached: false,
        source: 'api',
        env,
        loadTime: Date.now() - startTime,
        version: '2.0.0'
      }
    );
    
    return StandardizedApiResponseBuilder.toNextResponse(
      errorResponse,
      { ttl: 10000, public: false, maxAge: 0 } // 10 seconds for error states
    );
  }
}

// Additional endpoints for specific health checks
export async function POST(request: Request) {
  const env = resolveEnv();
  
  try {
    const body = await request.json();
    const action = body.action;
    
    switch (action) {
      case 'cache-optimize':
        const optimizationResult = await enhancedGlobalCache.optimizeCache();
        return StandardizedApiResponseBuilder.toNextResponse(
          StandardizedApiResponseBuilder.success(optimizationResult, {
            env,
            source: 'api',
            version: '2.0.0'
          }),
          { ttl: 0, public: false }
        );
        
      case 'cache-warm':
        const warmupResult = await enhancedGlobalCache.warmCache(env);
        return StandardizedApiResponseBuilder.toNextResponse(
          StandardizedApiResponseBuilder.success(warmupResult, {
            env,
            source: 'api',
            version: '2.0.0'
          }),
          { ttl: 0, public: false }
        );
        
      case 'cache-clear':
        const pattern = body.pattern;
        const cleared = enhancedGlobalCache.invalidatePattern(pattern || '');
        return StandardizedApiResponseBuilder.toNextResponse(
          StandardizedApiResponseBuilder.success({ cleared }, {
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
          { availableActions: ['cache-optimize', 'cache-warm', 'cache-clear'] },
          env
        );
        return StandardizedApiResponseBuilder.toNextResponse(
          errorResponse,
          { ttl: 0, public: false }
        );
    }
    
  } catch (error: any) {
    const errorResponse = StandardizedApiResponseBuilder.error(
      'HEALTH_ACTION_FAILED',
      'Failed to execute health action',
      { originalError: error.message },
      env
    );
    
    return StandardizedApiResponseBuilder.toNextResponse(
      errorResponse,
      { ttl: 0, public: false }
    );
  }
}