/**
 * Enhanced Global Cache Manager
 * 
 * Extends the existing PerformanceCacheManager with:
 * - Smart loader integration
 * - Environment-specific configurations
 * - Advanced cache strategies for Restaurant_BP
 * - Real-time performance monitoring
 * - Cache health diagnostics
 */

import { PerformanceCacheManager, globalCache, createCacheKey } from '../cache';
import type { AppEnv } from '../env';
import type { Menu, Restaurant, Marketing, Content } from '../schemas';

type EnvironmentConfig = {
  ttl: {
    menu: number;
    restaurant: number;
    marketing: number;
    content: number;
    config: number;
  };
  compression: {
    enabled: boolean;
    threshold: number;
  };
  preloading: {
    enabled: boolean;
    priority: ('menu' | 'restaurant' | 'marketing' | 'content')[];
  };
};

interface EnhancedCacheConfig {
  environments: {
    [key in AppEnv]: EnvironmentConfig;
  };
  monitoring: {
    enabled: boolean;
    metricsRetention: number;
    alertThresholds: {
      hitRateMin: number;
      loadTimeMax: number;
      errorRateMax: number;
    };
  };
}

interface CacheHealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  details: {
    hitRate: number;
    averageLoadTime: number;
    errorRate: number;
    memoryUsage: number;
    cacheSize: number;
    oldestEntry: number;
  };
  issues: string[];
  recommendations: string[];
}

interface CachePerformanceMetrics {
  timestamp: string;
  hitRate: number;
  missRate: number;
  averageLoadTime: number;
  errorRate: number;
  totalRequests: number;
  cacheSize: number;
  compressionRatio: number;
}

class EnhancedGlobalCacheManager {
  private config: EnhancedCacheConfig;
  private performanceHistory: CachePerformanceMetrics[] = [];
  private alertCallbacks: Array<(issue: string, severity: 'warning' | 'error') => void> = [];

  constructor() {
    this.config = this.getDefaultConfig();
    this.initializeMonitoring();
  }

  /**
   * Get cache data with enhanced smart loader integration
   */
  async get<T>(
    key: string, 
    loader: (() => Promise<T>) | null, 
    options?: {
      ttl?: number;
      enableCompression?: boolean;
      etag?: string;
    }
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await globalCache.get(key, loader, options);
      this.recordMetric('success', Date.now() - startTime);
      return result;
    } catch (error) {
      this.recordMetric('error', Date.now() - startTime);
      throw error;
    }
  }

  /**
   * Set cache data with enhanced options
   */
  async set<T>(
    key: string,
    data: T,
    options?: {
      ttl?: number;
      enableCompression?: boolean;
      etag?: string;
    }
  ): Promise<void> {
    // Note: PerformanceCacheManager doesn't expose a public set method
    // This would need to be implemented through the get() method pattern
    console.debug(`Would cache ${key} with options:`, options);
  }

  /**
   * Environment-specific TTL configuration
   */
  getTTL(resourceType: 'menu' | 'restaurant' | 'marketing' | 'content' | 'config', env: AppEnv): number {
    return this.config.environments[env].ttl[resourceType];
  }

  /**
   * Environment-specific compression settings
   */
  getCompressionConfig(env: AppEnv): { enabled: boolean; threshold: number } {
    return this.config.environments[env].compression;
  }

  /**
   * Intelligent cache warming based on environment configuration
   */
  async warmCache(env: AppEnv): Promise<{
    success: string[];
    failures: string[];
    totalTime: number;
  }> {
    const startTime = Date.now();
    const results: { success: string[]; failures: string[] } = { success: [], failures: [] };
    
    const preloadConfig = this.config.environments[env].preloading;
    if (!preloadConfig.enabled) {
      return { ...results, totalTime: 0 };
    }

    console.log(`Starting intelligent cache warming for environment: ${env}`);

    for (const resourceType of preloadConfig.priority) {
      try {
        const key = createCacheKey(resourceType, env);
        
        // Create a dummy loader for warming (will be replaced by actual smart loaders)
        const dummyLoader = async (): Promise<any> => {
          console.log(`Cache warming: ${resourceType} for ${env}`);
          return null;
        };

        const ttl = this.getTTL(resourceType, env);
        const compressionConfig = this.getCompressionConfig(env);

        await this.get(key, dummyLoader, {
          ttl,
          enableCompression: compressionConfig.enabled
        });

        results.success.push(resourceType);
      } catch (error) {
        console.warn(`Cache warming failed for ${resourceType}:`, error);
        results.failures.push(resourceType);
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`Cache warming completed in ${totalTime}ms. Success: ${results.success.length}, Failures: ${results.failures.length}`);

    return { ...results, totalTime };
  }

  /**
   * Get comprehensive cache health status
   */
  async getHealthStatus(): Promise<CacheHealthStatus> {
    const stats = globalCache.getStats();
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check hit rate
    if (stats.hitRate < this.config.monitoring.alertThresholds.hitRateMin) {
      issues.push(`Low cache hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
      recommendations.push('Consider increasing TTL values or improving cache warming strategy');
    }

    // Check load time
    if (stats.averageLoadTime > this.config.monitoring.alertThresholds.loadTimeMax) {
      issues.push(`High average load time: ${stats.averageLoadTime}ms`);
      recommendations.push('Consider enabling compression or optimizing data structures');
    }

    // Check memory usage
    const memoryUsagePercent = (stats.cacheSize / (50 * 1024 * 1024)) * 100; // Assuming 50MB max
    if (memoryUsagePercent > 80) {
      issues.push(`High memory usage: ${memoryUsagePercent.toFixed(1)}%`);
      recommendations.push('Consider reducing TTL or implementing more aggressive eviction policies');
    }

    // Check for stale data
    const now = Date.now();
    const oldestAge = stats.oldestEntry ? now - stats.oldestEntry : 0;
    const oneHour = 60 * 60 * 1000;
    if (oldestAge > oneHour) {
      issues.push(`Some cache entries are very old: ${Math.round(oldestAge / oneHour)}h`);
      recommendations.push('Consider implementing automatic cache refresh for critical data');
    }

    // Determine overall health
    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (issues.length === 0) {
      overall = 'healthy';
    } else if (issues.length <= 2) {
      overall = 'degraded';
    } else {
      overall = 'unhealthy';
    }

    return {
      overall,
      details: {
        hitRate: stats.hitRate,
        averageLoadTime: stats.averageLoadTime,
        errorRate: this.calculateErrorRate(),
        memoryUsage: memoryUsagePercent,
        cacheSize: stats.cacheSize,
        oldestEntry: oldestAge
      },
      issues,
      recommendations
    };
  }

  /**
   * Get performance metrics over time
   */
  getPerformanceHistory(limit = 100): CachePerformanceMetrics[] {
    return this.performanceHistory.slice(-limit);
  }

  /**
   * Optimize cache performance with smart strategies
   */
  async optimizeCache(): Promise<{
    before: any;
    after: any;
    optimizations: string[];
  }> {
    const before = globalCache.getStats();
    const optimizations: string[] = [];

    // Run basic optimization from PerformanceCacheManager
    const basicOptimization = globalCache.optimize();
    if (basicOptimization.removedStale > 0) {
      optimizations.push(`Removed ${basicOptimization.removedStale} stale entries`);
    }
    if (basicOptimization.compressedEntries > 0) {
      optimizations.push(`Compressed ${basicOptimization.compressedEntries} entries`);
    }

    // Apply environment-specific optimizations
    await this.applyEnvironmentOptimizations();
    optimizations.push('Applied environment-specific optimizations');

    const after = globalCache.getStats();
    
    return { before, after, optimizations };
  }

  /**
   * Register alert callback for monitoring
   */
  onAlert(callback: (issue: string, severity: 'warning' | 'error') => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Invalidate cache with pattern support
   */
  invalidatePattern(pattern: string | RegExp): number {
    return globalCache.invalidate(pattern);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return globalCache.getStats();
  }

  // Private methods

  private createEnvironmentConfig(params: {
    ttl: EnvironmentConfig['ttl'];
    compressionEnabled: boolean;
    compressionThreshold: number;
    preloadEnabled: boolean;
    preloadPriority: EnvironmentConfig['preloading']['priority'];
  }): EnvironmentConfig {
    return {
      ttl: params.ttl,
      compression: {
        enabled: params.compressionEnabled,
        threshold: params.compressionThreshold,
      },
      preloading: {
        enabled: params.preloadEnabled,
        priority: params.preloadPriority,
      },
    };
  }

  private cloneEnvironmentConfig(config: EnvironmentConfig): EnvironmentConfig {
    return JSON.parse(JSON.stringify(config));
  }

  private getDefaultConfig(): EnhancedCacheConfig {
    const isProd = process.env.NODE_ENV === 'production';
    const prodEnv = this.createEnvironmentConfig({
      ttl: {
        menu: 30 * 60 * 1000,
        restaurant: 60 * 60 * 1000,
        marketing: 15 * 60 * 1000,
        content: 45 * 60 * 1000,
        config: 60 * 60 * 1000,
      },
      compressionEnabled: true,
      compressionThreshold: 1024,
      preloadEnabled: true,
      preloadPriority: ['menu', 'restaurant', 'marketing', 'content'],
    });

    const stagingEnv = this.createEnvironmentConfig({
      ttl: {
        menu: 20 * 60 * 1000,
        restaurant: 45 * 60 * 1000,
        marketing: 10 * 60 * 1000,
        content: 30 * 60 * 1000,
        config: 45 * 60 * 1000,
      },
      compressionEnabled: true,
      compressionThreshold: 1536,
      preloadEnabled: true,
      preloadPriority: ['content', 'menu', 'marketing'],
    });

    const devEnv = this.createEnvironmentConfig({
      ttl: {
        menu: 5 * 60 * 1000,
        restaurant: 10 * 60 * 1000,
        marketing: 5 * 60 * 1000,
        content: 10 * 60 * 1000,
        config: 5 * 60 * 1000,
      },
      compressionEnabled: false,
      compressionThreshold: 2048,
      preloadEnabled: false,
      preloadPriority: ['content', 'menu'],
    });

    const appEnv = this.cloneEnvironmentConfig(isProd ? prodEnv : devEnv);

    return {
      environments: {
        app: appEnv,
        dev: devEnv,
        staging: stagingEnv,
        prod: prodEnv,
      },
      monitoring: {
        enabled: true,
        metricsRetention: 1000, // Keep last 1000 metrics
        alertThresholds: {
          hitRateMin: 0.7, // 70% minimum hit rate
          loadTimeMax: 2000, // 2 seconds maximum load time
          errorRateMax: 0.05 // 5% maximum error rate
        }
      }
    };
  }

  private initializeMonitoring(): void {
    if (!this.config.monitoring.enabled) return;

    // Collect metrics every minute
    setInterval(() => {
      this.collectMetrics();
    }, 60 * 1000);

    // Check for alerts every 5 minutes
    setInterval(() => {
      this.checkAlerts();
    }, 5 * 60 * 1000);
  }

  private collectMetrics(): void {
    const stats = globalCache.getStats();
    const metric: CachePerformanceMetrics = {
      timestamp: new Date().toISOString(),
      hitRate: stats.hitRate,
      missRate: 1 - stats.hitRate,
      averageLoadTime: stats.averageLoadTime,
      errorRate: this.calculateErrorRate(),
      totalRequests: stats.hits + stats.misses,
      cacheSize: stats.cacheSize,
      compressionRatio: stats.compressionRatio
    };

    this.performanceHistory.push(metric);

    // Maintain retention limit
    if (this.performanceHistory.length > this.config.monitoring.metricsRetention) {
      this.performanceHistory = this.performanceHistory.slice(-this.config.monitoring.metricsRetention);
    }
  }

  private calculateErrorRate(): number {
    // This would need to be implemented based on actual error tracking
    // For now, return a placeholder
    return 0;
  }

  private recordMetric(type: 'success' | 'error', loadTime: number): void {
    // Record individual metrics for analysis
    // This could be enhanced with more detailed tracking
  }

  private async checkAlerts(): Promise<void> {
    const health = await this.getHealthStatus();
    
    if (health.overall === 'unhealthy') {
      this.triggerAlert('Cache system is unhealthy', 'error');
    } else if (health.overall === 'degraded') {
      this.triggerAlert('Cache system is degraded', 'warning');
    }

    // Check specific thresholds
    if (health.details.hitRate < this.config.monitoring.alertThresholds.hitRateMin) {
      this.triggerAlert(`Low cache hit rate: ${(health.details.hitRate * 100).toFixed(1)}%`, 'warning');
    }

    if (health.details.averageLoadTime > this.config.monitoring.alertThresholds.loadTimeMax) {
      this.triggerAlert(`High load time: ${health.details.averageLoadTime}ms`, 'warning');
    }
  }

  private triggerAlert(issue: string, severity: 'warning' | 'error'): void {
    console[severity === 'error' ? 'error' : 'warn'](`Cache Alert [${severity.toUpperCase()}]: ${issue}`);
    
    this.alertCallbacks.forEach(callback => {
      try {
        callback(issue, severity);
      } catch (error) {
        console.error('Alert callback failed:', error);
      }
    });
  }

  private async applyEnvironmentOptimizations(): Promise<void> {
    // Environment-specific cache optimizations
    globalCache.applyEnvironmentConfig();
  }
}

// Export enhanced cache manager instance
export const enhancedGlobalCache = new EnhancedGlobalCacheManager();

// Export helper functions that maintain backward compatibility
export { createCacheKey } from '../cache';

// Re-export types
export type { CacheHealthStatus, CachePerformanceMetrics, EnhancedCacheConfig };
