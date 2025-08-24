#!/usr/bin/env node

/**
 * Performance Monitoring and Optimization Script
 * 
 * Monitors content loading performance, cache efficiency,
 * and provides optimization recommendations.
 */

const fs = require('fs').promises;
const path = require('path');
const { performance } = require('perf_hooks');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTimes: [],
      cacheMisses: 0,
      cacheHits: 0,
      contentSizes: {},
      compressionRatios: {},
      errors: []
    };
  }

  async measureContentLoad(env = 'dev') {
    const startTime = performance.now();
    
    try {
      const contentPath = path.join(process.cwd(), 'config', 'content.json');
      const envContentPath = path.join(process.cwd(), 'data', env, 'content.json');
      
      let content;
      let source = 'main';
      
      try {
        content = await fs.readFile(envContentPath, 'utf8');
        source = 'environment';
      } catch {
        content = await fs.readFile(contentPath, 'utf8');
      }
      
      const loadTime = performance.now() - startTime;
      this.metrics.loadTimes.push(loadTime);
      
      const size = Buffer.byteLength(content, 'utf8');
      this.metrics.contentSizes[env] = size;
      
      // Simulate compression
      const compressed = require('zlib').gzipSync(content);
      this.metrics.compressionRatios[env] = compressed.length / size;
      
      return {
        loadTime,
        size,
        compressionRatio: this.metrics.compressionRatios[env],
        source
      };
      
    } catch (error) {
      this.metrics.errors.push({
        env,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  getAverageLoadTime() {
    const times = this.metrics.loadTimes;
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  getCacheHitRate() {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? this.metrics.cacheHits / total : 0;
  }

  generateReport() {
    return {
      performance: {
        averageLoadTime: Math.round(this.getAverageLoadTime() * 100) / 100,
        cacheHitRate: Math.round(this.getCacheHitRate() * 100) / 100,
        totalRequests: this.metrics.loadTimes.length
      },
      contentSizes: this.metrics.contentSizes,
      compressionRatios: this.metrics.compressionRatios,
      errors: this.metrics.errors,
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.getAverageLoadTime() > 100) {
      recommendations.push('Consider implementing content caching to reduce load times');
    }
    
    if (this.getCacheHitRate() < 0.8) {
      recommendations.push('Cache hit rate is low - review cache TTL settings');
    }
    
    Object.entries(this.metrics.contentSizes).forEach(([env, size]) => {
      if (size > 100 * 1024) { // 100KB
        recommendations.push(`Content size for ${env} is large (${Math.round(size/1024)}KB) - consider compression`);
      }
    });
    
    Object.entries(this.metrics.compressionRatios).forEach(([env, ratio]) => {
      if (ratio < 0.7) {
        recommendations.push(`Good compression potential for ${env} environment (${Math.round((1-ratio)*100)}% reduction)`);
      }
    });
    
    return recommendations;
  }
}

async function runPerformanceTest() {
  const monitor = new PerformanceMonitor();
  const environments = ['dev', 'staging', 'prod'];
  
  console.log('🚀 Starting Content Performance Test...\n');
  
  for (const env of environments) {
    try {
      console.log(`Testing ${env} environment...`);
      const result = await monitor.measureContentLoad(env);
      
      console.log(`  ✅ Load time: ${result.loadTime.toFixed(2)}ms`);
      console.log(`  📦 Size: ${Math.round(result.size/1024)}KB`);
      console.log(`  🗜️  Compression: ${Math.round((1-result.compressionRatio)*100)}% reduction`);
      console.log(`  📍 Source: ${result.source}\n`);
      
    } catch (error) {
      console.log(`  ❌ Failed to load ${env}: ${error.message}\n`);
    }
  }
  
  const report = monitor.generateReport();
  
  console.log('📊 Performance Report:');
  console.log(`  Average Load Time: ${report.performance.averageLoadTime}ms`);
  console.log(`  Cache Hit Rate: ${report.performance.cacheHitRate * 100}%`);
  console.log(`  Total Requests: ${report.performance.totalRequests}\n`);
  
  if (report.recommendations.length > 0) {
    console.log('💡 Recommendations:');
    report.recommendations.forEach(rec => console.log(`  • ${rec}`));
    console.log('');
  }
  
  if (report.errors.length > 0) {
    console.log('⚠️  Errors:');
    report.errors.forEach(err => console.log(`  • ${err.env}: ${err.error}`));
  }
  
  return report;
}

if (require.main === module) {
  runPerformanceTest().catch(console.error);
}

module.exports = { PerformanceMonitor, runPerformanceTest };