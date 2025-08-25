/**
 * Advanced Cache Warming and Preloading System
 * 
 * Provides intelligent cache warming strategies for Restaurant_BP with:
 * - Environment-specific warming priorities
 * - Background preloading for critical data
 * - Scheduled cache refresh mechanisms
 * - Performance-aware warming strategies
 * - Integration with enhanced smart loaders
 */

import { resolveEnv, type AppEnv } from '../env';
import { SmartLoaders, warmAllCaches } from '../loaders';
import { enhancedGlobalCache } from '../loaders/EnhancedGlobalCacheManager';

interface WarmingStrategy {
  priority: 'critical' | 'high' | 'normal' | 'low';
  maxConcurrency: number;
  retryAttempts: number;
  retryDelay: number;
  resources: Array<{
    type: 'menu' | 'restaurant' | 'marketing' | 'content';
    weight: number;
    dependencies?: string[];
  }>;
}

interface WarmingResult {
  success: boolean;
  totalTime: number;
  results: {
    [key: string]: {
      success: boolean;
      loadTime: number;
      cached: boolean;
      error?: string;
    };
  };
  recommendations: string[];
}

interface ScheduledWarmingConfig {
  enabled: boolean;
  intervals: {
    critical: number; // minutes
    high: number;
    normal: number;
    low: number;
  };
  maxDuration: number; // maximum warming duration in ms
  quietHours?: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}

class AdvancedCacheWarmingSystem {
  private warmingStrategies: Map<AppEnv, WarmingStrategy> = new Map();
  private scheduledConfig: ScheduledWarmingConfig;
  private activeWarmingTasks: Set<string> = new Set();
  private lastWarmingResults: Map<string, WarmingResult> = new Map();
  private scheduledIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeStrategies();
    this.scheduledConfig = this.getDefaultScheduledConfig();
    // Note: Don't auto-start scheduled warming in constructor
    // Call startScheduledWarming() explicitly when needed
  }

  /**
   * Perform intelligent cache warming based on environment strategy
   */
  async warmCache(
    env: AppEnv = resolveEnv(),
    options: {
      strategy?: 'critical' | 'full' | 'minimal';
      force?: boolean;
      maxConcurrency?: number;
      backgroundMode?: boolean;
    } = {}
  ): Promise<WarmingResult> {
    const taskId = `${env}-${options.strategy || 'default'}-${Date.now()}`;
    
    if (!options.force && this.activeWarmingTasks.has(env)) {
      console.warn(`Cache warming already in progress for environment: ${env}`);
      return this.getLastResult(env) || this.createEmptyResult();
    }

    this.activeWarmingTasks.add(env);
    const startTime = Date.now();

    try {
      const strategy = this.getWarmingStrategy(env, options.strategy);
      console.log(`Starting cache warming for ${env} with ${options.strategy || 'default'} strategy`);

      const results: WarmingResult['results'] = {};
      const recommendations: string[] = [];
      let totalSuccesses = 0;

      // Sort resources by priority and weight
      const sortedResources = [...strategy.resources].sort((a, b) => {
        return b.weight - a.weight;
      });

      // Warm cache in batches based on concurrency limit
      const concurrency = options.maxConcurrency || strategy.maxConcurrency;
      const batches = this.createBatches(sortedResources, concurrency);

      for (const batch of batches) {
        const batchPromises = batch.map(async (resource) => {
          const resourceStartTime = Date.now();
          
          try {
            const loader = SmartLoaders[resource.type];
            const result = await loader.loadSmart(env, {
              enableCache: true,
              enablePerformanceMonitoring: !options.backgroundMode
            });

            const loadTime = Date.now() - resourceStartTime;
            results[resource.type] = {
              success: true,
              loadTime,
              cached: result.cached
            };

            totalSuccesses++;

            // Performance recommendations
            if (loadTime > 2000) {
              recommendations.push(`${resource.type} loading is slow (${loadTime}ms) - consider optimization`);
            }

          } catch (error) {
            const loadTime = Date.now() - resourceStartTime;
            results[resource.type] = {
              success: false,
              loadTime,
              cached: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            };

            console.warn(`Cache warming failed for ${resource.type}:`, error);
            recommendations.push(`${resource.type} failed to warm - check data source`);
          }
        });

        // Wait for current batch to complete before starting next
        await Promise.all(batchPromises);
      }

      const totalTime = Date.now() - startTime;
      const successRate = totalSuccesses / sortedResources.length;

      // Add general recommendations
      if (successRate < 0.8) {
        recommendations.push('Cache warming success rate is below 80% - investigate data sources');
      }

      if (totalTime > 10000) {
        recommendations.push('Cache warming took longer than 10 seconds - consider reducing data size or increasing concurrency');
      }

      const result: WarmingResult = {
        success: successRate >= 0.5, // At least 50% success rate
        totalTime,
        results,
        recommendations
      };

      this.lastWarmingResults.set(env, result);
      
      if (!options.backgroundMode) {
        console.log(`Cache warming completed for ${env}: ${totalSuccesses}/${sortedResources.length} successful in ${totalTime}ms`);
      }

      return result;

    } finally {
      this.activeWarmingTasks.delete(env);
    }
  }

  /**
   * Start scheduled cache warming
   */
  startScheduledWarming(): void {
    if (!this.scheduledConfig.enabled) {
      console.log('Scheduled cache warming is disabled');
      return;
    }

    console.log('Starting scheduled cache warming system');

    // Schedule critical data warming (most frequent)
    this.scheduleWarming('critical', this.scheduledConfig.intervals.critical);
    
    // Schedule high priority data warming
    this.scheduleWarming('high', this.scheduledConfig.intervals.high);
    
    // Schedule normal priority data warming
    this.scheduleWarming('normal', this.scheduledConfig.intervals.normal);
    
    // Schedule low priority data warming
    this.scheduleWarming('low', this.scheduledConfig.intervals.low);
  }

  /**
   * Stop scheduled cache warming
   */
  stopScheduledWarming(): void {
    console.log('Stopping scheduled cache warming system');
    
    this.scheduledIntervals.forEach((interval, key) => {
      clearInterval(interval);
      console.log(`Cleared scheduled warming: ${key}`);
    });
    
    this.scheduledIntervals.clear();
  }

  /**
   * Preload critical data for immediate use
   */
  async preloadCriticalData(env: AppEnv = resolveEnv()): Promise<void> {
    console.log(`Preloading critical data for environment: ${env}`);
    
    const criticalResources = ['menu', 'restaurant'] as const;
    
    const preloadPromises = criticalResources.map(async (resourceType) => {
      try {
        const loader = SmartLoaders[resourceType];
        await loader.preload(env);
        console.log(`✓ Preloaded ${resourceType} for ${env}`);
      } catch (error) {
        console.warn(`✗ Failed to preload ${resourceType} for ${env}:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
  }

  /**
   * Get warming statistics and health
   */
  getWarmingStats(): {
    activeTasksCount: number;
    lastResults: Record<string, WarmingResult>;
    scheduledTasksCount: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    
    // Check for frequent failures
    this.lastWarmingResults.forEach((result, env) => {
      if (!result.success) {
        recommendations.push(`Cache warming consistently failing for ${env}`);
      }
      
      if (result.totalTime > 15000) {
        recommendations.push(`Cache warming for ${env} is taking too long (${result.totalTime}ms)`);
      }
    });

    return {
      activeTasksCount: this.activeWarmingTasks.size,
      lastResults: Object.fromEntries(this.lastWarmingResults),
      scheduledTasksCount: this.scheduledIntervals.size,
      recommendations
    };
  }

  /**
   * Optimize warming strategies based on performance data
   */
  async optimizeWarmingStrategies(): Promise<{
    optimizations: string[];
    newStrategies: Map<AppEnv, WarmingStrategy>;
  }> {
    const optimizations: string[] = [];
    const newStrategies = new Map<AppEnv, WarmingStrategy>();

    this.warmingStrategies.forEach((strategy, env) => {
      const lastResult = this.lastWarmingResults.get(env);
      if (!lastResult) return;

      const optimizedStrategy = { ...strategy };
      let modified = false;

      // Adjust concurrency based on performance
      if (lastResult.totalTime > 10000 && strategy.maxConcurrency < 4) {
        optimizedStrategy.maxConcurrency = Math.min(strategy.maxConcurrency + 1, 4);
        optimizations.push(`Increased concurrency for ${env} to ${optimizedStrategy.maxConcurrency}`);
        modified = true;
      } else if (lastResult.totalTime < 2000 && strategy.maxConcurrency > 1) {
        optimizedStrategy.maxConcurrency = Math.max(strategy.maxConcurrency - 1, 1);
        optimizations.push(`Reduced concurrency for ${env} to ${optimizedStrategy.maxConcurrency}`);
        modified = true;
      }

      // Adjust resource weights based on load times
      for (const resource of optimizedStrategy.resources) {
        const resourceResult = lastResult.results[resource.type];
        if (resourceResult && resourceResult.success) {
          if (resourceResult.loadTime > 3000 && resource.weight > 1) {
            resource.weight = Math.max(resource.weight - 1, 1);
            optimizations.push(`Reduced weight for ${resource.type} in ${env} due to slow loading`);
            modified = true;
          }
        }
      }

      if (modified) {
        newStrategies.set(env, optimizedStrategy);
      }
    });

    // Apply optimizations
    newStrategies.forEach((strategy, env) => {
      this.warmingStrategies.set(env, strategy);
    });

    return { optimizations, newStrategies };
  }

  // Private helper methods

  private initializeStrategies(): void {
    const isProd = process.env.NODE_ENV === 'production';
    
    this.warmingStrategies.set('app', {
      priority: 'critical',
      maxConcurrency: isProd ? 3 : 2,
      retryAttempts: 3,
      retryDelay: 1000,
      resources: [
        { type: 'menu', weight: 10 }, // Highest priority
        { type: 'restaurant', weight: 8 },
        { type: 'marketing', weight: 6 },
        { type: 'content', weight: 4 }
      ]
    });
  }

  private getWarmingStrategy(env: AppEnv, strategyType?: string): WarmingStrategy {
    const baseStrategy = this.warmingStrategies.get(env) || this.warmingStrategies.get('app')!;
    
    if (strategyType === 'critical') {
      return {
        ...baseStrategy,
        resources: baseStrategy.resources.filter(r => r.weight >= 8)
      };
    } else if (strategyType === 'minimal') {
      return {
        ...baseStrategy,
        maxConcurrency: 1,
        resources: baseStrategy.resources.slice(0, 1) // Only highest priority
      };
    }
    
    return baseStrategy;
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private scheduleWarming(strategy: string, intervalMinutes: number): void {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    const interval = setInterval(async () => {
      if (this.isQuietHours()) {
        console.log(`Skipping scheduled warming during quiet hours: ${strategy}`);
        return;
      }

      try {
        const env = resolveEnv();
        await this.warmCache(env, { 
          strategy: strategy as any, 
          backgroundMode: true 
        });
      } catch (error) {
        console.error(`Scheduled warming failed for ${strategy}:`, error);
      }
    }, intervalMs);

    this.scheduledIntervals.set(strategy, interval);
    console.log(`Scheduled ${strategy} warming every ${intervalMinutes} minutes`);
  }

  private isQuietHours(): boolean {
    if (!this.scheduledConfig.quietHours) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return currentTime >= this.scheduledConfig.quietHours.start && 
           currentTime <= this.scheduledConfig.quietHours.end;
  }

  private getDefaultScheduledConfig(): ScheduledWarmingConfig {
    const isProd = process.env.NODE_ENV === 'production';
    
    return {
      enabled: isProd, // Only enable in production by default
      intervals: {
        critical: 15, // Every 15 minutes
        high: 30,     // Every 30 minutes
        normal: 60,   // Every hour
        low: 240      // Every 4 hours
      },
      maxDuration: 30000, // 30 seconds max
      quietHours: isProd ? {
        start: '02:00',
        end: '05:00'
      } : undefined
    };
  }

  private getLastResult(env: AppEnv): WarmingResult | undefined {
    return this.lastWarmingResults.get(env);
  }

  private createEmptyResult(): WarmingResult {
    return {
      success: false,
      totalTime: 0,
      results: {},
      recommendations: ['No warming operation performed']
    };
  }
}

// Export singleton instance
export const advancedCacheWarming = new AdvancedCacheWarmingSystem();

// Convenience functions
export async function warmCacheIntelligent(env?: AppEnv, strategy?: 'critical' | 'full' | 'minimal'): Promise<WarmingResult> {
  return advancedCacheWarming.warmCache(env, { strategy });
}

export async function preloadCriticalData(env?: AppEnv): Promise<void> {
  return advancedCacheWarming.preloadCriticalData(env);
}

export function startScheduledWarming(): void {
  advancedCacheWarming.startScheduledWarming();
}

export function stopScheduledWarming(): void {
  advancedCacheWarming.stopScheduledWarming();
}

// Types for external use
export type { WarmingResult, WarmingStrategy, ScheduledWarmingConfig };