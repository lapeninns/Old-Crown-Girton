# Performance Optimization & Caching Strategy

This document outlines the comprehensive performance optimization and caching strategy implemented for the Old Crown Restaurant content management system.

## Overview

The performance optimization strategy focuses on:
- **Intelligent Caching**: Multi-layer caching with environment-specific TTL
- **Content Compression**: Automatic gzip compression for large payloads
- **Smart Loading**: Fallback mechanisms with background preloading
- **Performance Monitoring**: Real-time metrics and optimization recommendations

## Caching Architecture

### 1. Performance Cache Manager (`src/lib/data/cache.ts`)

**Features:**
- LRU cache with size and TTL management
- Automatic compression for large content
- Performance metrics tracking
- Environment-specific configuration
- Cache warming and preloading strategies

**Cache Configuration by Environment:**

```typescript
const envConfigs = {
  dev: {
    ttl: 60 * 1000,        // 1 minute
    enableCompression: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  staging: {
    ttl: 5 * 60 * 1000,    // 5 minutes
    enableCompression: true,
    maxSize: 25 * 1024 * 1024 // 25MB
  },
  prod: {
    ttl: 60 * 60 * 1000,   // 1 hour
    enableCompression: true,
    maxSize: 100 * 1024 * 1024 // 100MB
  }
};
```

### 2. Content-Specific Caching

**Content TTL Strategy:**
- **Development**: 1 minute for rapid iteration
- **Staging**: 5 minutes for testing stability
- **Production**: 1 hour for optimal performance

**Menu TTL Strategy:**
- **Development**: 30 seconds
- **Staging**: 10 minutes
- **Production**: 2 hours

**Config TTL Strategy:**
- **Development**: 30 seconds
- **Staging**: 5 minutes
- **Production**: 30 minutes

## API Performance Optimizations

### Enhanced Content API (`app/api/content/route.ts`)

**Features:**
- ETag-based cache validation
- Automatic gzip compression for large responses
- Performance monitoring headers
- Environment-specific cache control
- Graceful error handling with detailed metrics

**Cache Control Headers:**
```http
# Development
Cache-Control: public, max-age=60, s-maxage=60

# Staging  
Cache-Control: public, max-age=300, s-maxage=300, stale-while-revalidate=60

# Production
Cache-Control: public, max-age=3600, s-maxage=3600, stale-while-revalidate=300
```

### Performance Headers

The API includes performance monitoring headers:
```http
X-Cache-Performance: {"hitRate": 0.85, "averageLoadTime": 45, "cacheSize": 12}
X-Content-Source: smart-loader
X-Environment: prod
X-Compression-Ratio: 0.341
```

## Content Loading Optimizations

### Smart Loading Strategy

1. **Primary**: Load from API with caching
2. **Secondary**: Load from environment-specific files
3. **Fallback**: Load from main config files
4. **Emergency**: Use hardcoded defaults

### Preloading Strategy

Critical content is preloaded in background:
```typescript
export async function preloadCriticalContent(env: AppEnv): Promise<void> {
  const preloadPromises = [
    globalCache.preload('content', () => getContentDataOptimized(env), { priority: 'high' }),
    globalCache.preload('config', () => getConfigData(env), { priority: 'high' }),
    globalCache.preload('menu', () => getMenuData(env), { priority: 'normal' })
  ];
  
  await Promise.allSettled(preloadPromises);
}
```

## Compression Strategy

### Automatic Compression

- **Threshold**: 1KB minimum size
- **Algorithm**: Gzip compression
- **Environments**: Enabled for staging and production
- **API Responses**: Automatic compression based on Accept-Encoding header

### Compression Benefits

Typical compression ratios:
- **Content JSON**: 65-75% size reduction
- **Menu Data**: 60-70% size reduction
- **Config Data**: 50-60% size reduction

## Performance Monitoring

### Monitoring Script (`scripts/performance-monitor.js`)

**Metrics Tracked:**
- Content load times across environments
- Cache hit/miss ratios
- Content sizes and compression ratios
- Error rates and types
- Performance trend analysis

**Usage:**
```bash
npm run performance:monitor
```

### Real-time Metrics

Access cache performance via API:
```bash
# Get cache statistics
curl -I http://localhost:3000/api/content

# Headers returned:
# X-Cache-Hits: 145
# X-Cache-Misses: 23  
# X-Cache-Hit-Rate: 86.31
# X-Cache-Size: 12
```

### Performance Dashboard

Cache statistics available programmatically:
```typescript
import { getCacheStats, optimizeCache } from '@/src/lib/data/loader';

const stats = getCacheStats();
console.log(`Hit Rate: ${stats.hitRate * 100}%`);
console.log(`Average Load Time: ${stats.averageLoadTime}ms`);

// Optimize cache performance
const optimizationResult = optimizeCache();
console.log(`Freed ${optimizationResult.freedSpace} bytes`);
```

## Optimization Strategies

### 1. Cache Optimization

**Automatic Optimization:**
- Remove stale entries older than 30 minutes with low access count
- Compress frequently accessed large entries
- Free up space for new content

**Manual Optimization:**
```typescript
// Optimize cache performance
const result = optimizeCache();
console.log(`Removed ${result.removedStale} stale entries`);
console.log(`Compressed ${result.compressedEntries} entries`);
console.log(`Freed ${result.freedSpace} bytes`);
```

### 2. Cache Invalidation

**Pattern-based Invalidation:**
```typescript
// Invalidate all content cache
invalidateCache(/content/);

// Invalidate specific environment
invalidateCache(`content:${env}`);

// Clear all cache
invalidateCache();
```

### 3. Environment-Specific Optimizations

**Development:**
- Short cache TTL for fast iteration
- No compression for faster debugging
- Detailed error messages

**Staging:**
- Moderate caching for realistic testing
- Compression enabled for testing
- Performance monitoring

**Production:**
- Aggressive caching for best performance
- Full compression enabled
- Optimized error handling

## Best Practices

### Content Development

1. **Keep content files under 100KB per environment**
2. **Use environment-specific content for better caching**
3. **Implement graceful fallbacks for all content**
4. **Monitor content growth and performance impact**

### Cache Management

1. **Use appropriate TTL for each environment**
2. **Monitor cache hit rates regularly**
3. **Optimize cache size vs. hit rate balance**
4. **Implement cache warming for critical content**

### Performance Monitoring

1. **Track load times across environments**
2. **Monitor compression ratios**
3. **Set up alerts for performance degradation**
4. **Regular performance audits**

## Troubleshooting

### Common Performance Issues

1. **Low Cache Hit Rate**
   - Check TTL settings
   - Verify cache key consistency
   - Monitor cache eviction patterns

2. **High Load Times**
   - Enable compression
   - Implement preloading
   - Optimize content size

3. **Memory Usage**
   - Adjust cache size limits
   - Enable automatic optimization
   - Monitor cache growth

### Performance Commands

```bash
# Run performance monitoring
npm run performance:monitor

# Check cache statistics
npm run test:performance

# Validate content performance
npm run validate-content -- --performance

# Monitor cache health
npm run cache:stats
```

## Integration with CI/CD

### Automated Performance Testing

The CI/CD pipeline includes performance validation:
- Content size monitoring
- Load time benchmarks  
- Cache efficiency validation
- Compression ratio analysis

### Performance Gates

Deployment gates based on performance metrics:
- Content load time < 100ms
- Cache hit rate > 80%
- Compression ratio > 30%
- Content size < 2MB per environment

This comprehensive performance optimization strategy ensures fast, reliable content delivery across all environments while maintaining development velocity and operational excellence.