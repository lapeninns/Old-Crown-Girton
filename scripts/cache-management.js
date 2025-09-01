#!/usr/bin/env node

/**
 * Comprehensive Cache Management System
 * Handles cache operations, optimization, and health monitoring
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// Import cache optimization if available
let cacheOptimization;
try {
  cacheOptimization = require('../src/lib/cacheOptimization.ts');
} catch (error) {
  console.warn('Cache optimization module not available:', error.message);
}

class CacheManager {
  constructor() {
    this.cacheDir = path.join(process.cwd(), '.cache');
    this.metricsFile = path.join(this.cacheDir, 'metrics.json');
    this.configFile = path.join(this.cacheDir, 'config.json');
    
    // Ensure cache directory exists
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
    
    // Default configuration
    this.defaultConfig = {
      maxCacheSize: 100 * 1024 * 1024, // 100MB
      maxCacheAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      optimizationEnabled: true,
      compressionEnabled: true,
      environment: process.env.NODE_ENV || 'development'
    };
  }

  /**
   * Get cache configuration with optimizations
   */
  getConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        return { ...this.defaultConfig, ...config };
      }
    } catch (error) {
      console.warn('Failed to load cache config:', error.message);
    }
    return this.defaultConfig;
  }

  /**
   * Save cache configuration
   */
  saveConfig(config) {
    try {
      fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
      console.log('✅ Cache configuration saved');
    } catch (error) {
      console.error('❌ Failed to save cache config:', error.message);
    }
  }

  /**
   * Get optimal TTL for content type using volatility analysis
   */
  getOptimalTTL(contentType, context = {}) {
    if (!cacheOptimization) {
      // Fallback TTL values
      const fallbackTTLs = {
        restaurant: 3600, // 1 hour
        menu: 1800, // 30 minutes
        hours: 1800, // 30 minutes
        blog: 900, // 15 minutes
        events: 600, // 10 minutes
        images: 7200, // 2 hours
        static: 14400 // 4 hours
      };
      return fallbackTTLs[contentType] || 1800;
    }
    
    try {
      const config = cacheOptimization.generateOptimalTTL(contentType, context);
      return config.browser;
    } catch (error) {
      console.warn(`Failed to get optimal TTL for ${contentType}:`, error.message);
      return 1800; // 30 minutes fallback
    }
  }

  /**
   * Analyze peak hours and adjust cache strategy
   */
  isPeakHour() {
    if (!cacheOptimization) return false;
    
    try {
      const { peakHours } = cacheOptimization.getPeakHoursConfig();
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      return peakHours.some(peak => {
        const isTimeMatch = hour >= peak.start && hour < peak.end;
        const isDayMatch = peak.day === undefined || peak.day === day;
        return isTimeMatch && isDayMatch;
      });
    } catch (error) {
      console.warn('Failed to check peak hours:', error.message);
      return false;
    }
  }

  /**
   * Get cache dependencies for a content type
   */
  getDependencies(contentType) {
    if (!cacheOptimization) return { invalidateWhen: [], preloadWith: [] };
    
    try {
      return cacheOptimization.analyzeDependencies(contentType);
    } catch (error) {
      console.warn(`Failed to analyze dependencies for ${contentType}:`, error.message);
      return { invalidateWhen: [], preloadWith: [] };
    }
  }

  /**
   * Get environment-specific configuration
   */
  getEnvironmentConfig() {
    const config = this.getConfig();
    
    if (!cacheOptimization) return config;
    
    try {
      const envConfig = cacheOptimization.getEnvironmentCacheConfig(config.environment);
      return { ...config, ...envConfig };
    } catch (error) {
      console.warn('Failed to get environment config:', error.message);
      return config;
    }
  }
}

const { globalCache } = require('../src/lib/data/cache.ts');

// Create cache manager instance
const cacheManager = new CacheManager();

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

async function showCacheStats() {
  try {
    const stats = globalCache.getStats();
    
    console.log('📊 Cache Performance Statistics');
    console.log('================================');
    console.log(`Cache Size: ${stats.size} entries`);
    console.log(`Memory Usage: ${formatBytes(stats.cacheSize)}`);
    console.log(`Hit Rate: ${(stats.hitRate * 100).toFixed(1)}%`);
    console.log(`Cache Hits: ${stats.hits}`);
    console.log(`Cache Misses: ${stats.misses}`);
    console.log(`Evictions: ${stats.evictions}`);
    console.log(`Avg Load Time: ${formatDuration(stats.averageLoadTime)}`);
    console.log(`Compression Ratio: ${(stats.compressionRatio * 100).toFixed(1)}%`);
    
    if (stats.oldestEntry) {
      const oldestAge = Date.now() - stats.oldestEntry;
      console.log(`Oldest Entry: ${formatDuration(oldestAge)} ago`);
    }
    
    if (stats.newestEntry) {
      const newestAge = Date.now() - stats.newestEntry;
      console.log(`Newest Entry: ${formatDuration(newestAge)} ago`);
    }
    
    // Health assessment
    console.log('\n🏥 Health Assessment');
    console.log('===================');
    
    if (stats.hitRate > 0.8) {
      console.log('✅ Excellent hit rate - cache is performing well');
    } else if (stats.hitRate > 0.6) {
      console.log('⚠️ Good hit rate - room for improvement');
    } else {
      console.log('❌ Low hit rate - consider cache optimization');
    }
    
    if (stats.cacheSize > 80 * 1024 * 1024) {
      console.log('⚠️ High memory usage - consider running optimization');
    } else {
      console.log('✅ Memory usage is healthy');
    }
    
  } catch (error) {
    console.error('❌ Error getting cache stats:', error.message);
    process.exit(1);
  }
}

/**
 * Advanced cache optimization with volatility analysis
 */
async function optimizeCacheAdvanced() {
  console.log('\n🔧 Running advanced cache optimization...\n');
  
  const config = cacheManager.getConfig();
  const envConfig = cacheManager.getEnvironmentConfig();
  const isPeak = cacheManager.isPeakHour();
  
  console.log(`Environment: ${config.environment}`);
  console.log(`Peak hours: ${isPeak ? 'YES' : 'NO'}`);
  
  // Content types to optimize
  const contentTypes = [
    'restaurant', 'menu', 'hours', 'blog', 'events', 
    'slideshow', 'testimonials', 'about', 'images'
  ];
  
  console.log('\n📊 Optimal TTL Configuration:');
  console.log('Content Type'.padEnd(15) + 'TTL'.padEnd(10) + 'Strategy'.padEnd(20) + 'Dependencies');
  console.log('-'.repeat(70));
  
  const optimizedConfig = { ...config };
  optimizedConfig.contentTTL = {};
  optimizedConfig.cacheStrategies = {};
  optimizedConfig.dependencies = {};
  
  for (const contentType of contentTypes) {
    const context = {
      isPeak,
      device: 'desktop', // Default context
      userType: 'returning'
    };
    
    const ttl = cacheManager.getOptimalTTL(contentType, context);
    const strategy = cacheOptimization ? 
      cacheOptimization.getCacheStrategy(contentType).strategy : 
      'stale-while-revalidate';
    const deps = cacheManager.getDependencies(contentType);
    
    optimizedConfig.contentTTL[contentType] = ttl;
    optimizedConfig.cacheStrategies[contentType] = strategy;
    optimizedConfig.dependencies[contentType] = deps;
    
    console.log(
      contentType.padEnd(15) + 
      `${Math.round(ttl/60)}m`.padEnd(10) + 
      strategy.padEnd(20) + 
      deps.preloadWith.join(', ')
    );
  }
  
  // Save optimized configuration
  cacheManager.saveConfig(optimizedConfig);
  
  console.log(`\n✅ Advanced cache optimization complete`);
  console.log(`📝 Configuration saved to ${cacheManager.configFile}`);
  
  return optimizedConfig;
}

async function optimizeCache() {
  try {
    console.log('🔧 Optimizing cache...');
    const result = globalCache.optimize();
    
    console.log('\n📈 Optimization Results');
    console.log('======================');
    console.log(`Removed stale entries: ${result.removedStale}`);
    console.log(`Compressed entries: ${result.compressedEntries}`);
    console.log(`Space freed: ${formatBytes(result.freedSpace)}`);
    
    if (result.removedStale > 0 || result.compressedEntries > 0) {
      console.log('✅ Cache optimization completed successfully');
    } else {
      console.log('ℹ️ Cache is already optimized');
    }
    
  } catch (error) {
    console.error('❌ Error optimizing cache:', error.message);
    process.exit(1);
  }
}

async function clearCache(pattern) {
  try {
    let cleared;
    
    if (pattern) {
      console.log(`🧹 Clearing cache entries matching: ${pattern}`);
      const regex = new RegExp(pattern, 'i');
      cleared = globalCache.invalidate(regex);
    } else {
      console.log('🧹 Clearing entire cache...');
      cleared = globalCache.invalidate();
    }
    
    console.log(`✅ Cleared ${cleared} cache entries`);
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error.message);
    process.exit(1);
  }
}

async function preloadCriticalContent() {
  try {
    console.log('⚡ Preloading critical content...');
    
    const { preloadCriticalContent } = require('../src/lib/data/loader.ts');
    const { resolveEnv } = require('../src/lib/data/env.ts');
    
    const env = resolveEnv();
    await preloadCriticalContent(env);
    
    console.log('✅ Critical content preloaded successfully');
    
    // Show updated stats
    await showCacheStats();
    
  } catch (error) {
    console.error('❌ Error preloading content:', error.message);
    process.exit(1);
  }
}

async function healthCheck() {
  try {
    console.log('🏥 Running cache health check...');
    
    const { checkContentSystemHealth } = require('../src/lib/data/loader.ts');
    const { resolveEnv } = require('../src/lib/data/env.ts');
    
    const env = resolveEnv();
    const health = await checkContentSystemHealth(env);
    
    console.log('\n📋 Content System Health Report');
    console.log('===============================');
    
    const statusIcon = {
      healthy: '✅',
      degraded: '⚠️',
      error: '❌'
    };
    
    console.log(`Overall Status: ${statusIcon[health.status]} ${health.status.toUpperCase()}`);
    
    for (const [component, details] of Object.entries(health.details)) {
      console.log(`\n${component.toUpperCase()}:`);
      console.log(`  Status: ${statusIcon[details.status] || '❓'} ${details.status}`);
      
      if (details.error) {
        console.log(`  Error: ${details.error}`);
      }
      
      if (details.loadTime) {
        console.log(`  Load Time: ${formatDuration(details.loadTime)}`);
      }
      
      if (details.hitRate !== undefined) {
        console.log(`  Hit Rate: ${(details.hitRate * 100).toFixed(1)}%`);
      }
      
      if (details.hasPages !== undefined) {
        console.log(`  Has Pages: ${details.hasPages ? 'Yes' : 'No'}`);
      }
      
      if (details.cmsEnabled !== undefined) {
        console.log(`  CMS Enabled: ${details.cmsEnabled ? 'Yes' : 'No'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error running health check:', error.message);
    process.exit(1);
  }
}

// Command line interface
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'stats':
    showCacheStats();
    break;
    
  case 'optimize':
    optimizeCache();
    break;
    
  case 'clear':
    clearCache(arg);
    break;
    
  case 'preload':
    preloadCriticalContent();
    break;
    
  case 'health':
    healthCheck();
    break;
    
  case 'optimize-advanced':
    optimizeCacheAdvanced();
    break;
    
  default:
    console.log('Cache Management Utility');
    console.log('=======================');
    console.log('');
    console.log('Usage: node scripts/cache-management.js <command> [args]');
    console.log('');
    console.log('Commands:');
    console.log('  stats              Show cache statistics and health');
    console.log('  optimize           Optimize cache performance');
    console.log('  optimize-advanced  Advanced optimization with volatility analysis');
    console.log('  clear [pattern]    Clear cache (all or matching pattern)');
    console.log('  preload            Preload critical content');
    console.log('  health             Run content system health check');
    console.log('');
    console.log('Examples:');
    console.log('  npm run cache:stats');
    console.log('  npm run cache:optimize');
    console.log('  node scripts/cache-management.js optimize-advanced');
    console.log('  npm run cache:clear content');
    console.log('  npm run cache:preload');
    console.log('  npm run cache:health');
}