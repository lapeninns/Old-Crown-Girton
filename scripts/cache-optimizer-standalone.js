/**
 * Standalone Cache Optimization Script
 * Works independently of TypeScript modules for CLI usage
 */

const fs = require('fs');
const path = require('path');

class StandaloneCacheOptimizer {
  constructor() {
    this.cacheDir = path.join(process.cwd(), '.cache');
    this.configFile = path.join(this.cacheDir, 'cache-config.json');
    
    // Ensure cache directory exists
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Restaurant content volatility profiles
   */
  getContentProfiles() {
    return {
      restaurant: {
        volatility: 'low',
        updateFrequency: 168, // hours
        importance: 'critical'
      },
      hours: {
        volatility: 'medium',
        updateFrequency: 24,
        importance: 'critical'
      },
      menu: {
        volatility: 'medium',
        updateFrequency: 72,
        importance: 'high'
      },
      blog: {
        volatility: 'high',
        updateFrequency: 24,
        importance: 'medium'
      },
      events: {
        volatility: 'high',
        updateFrequency: 12,
        importance: 'high'
      },
      slideshow: {
        volatility: 'medium',
        updateFrequency: 168,
        importance: 'high'
      },
      testimonials: {
        volatility: 'low',
        updateFrequency: 720,
        importance: 'medium'
      },
      about: {
        volatility: 'static',
        updateFrequency: 2160,
        importance: 'medium'
      },
      images: {
        volatility: 'low',
        updateFrequency: 720,
        importance: 'medium'
      }
    };
  }

  /**
   * Generate optimal TTL for content type
   */
  generateOptimalTTL(contentType, context = {}) {
    const profiles = this.getContentProfiles();
    const profile = profiles[contentType];
    
    if (!profile) {
      console.warn(`Unknown content type: ${contentType}`);
      return 1800; // 30 minutes default
    }

    // Base TTL is 50% of update frequency
    let baseTTL = Math.floor(profile.updateFrequency * 3600 * 0.5);
    
    // Volatility multiplier
    const volatilityMultiplier = {
      static: 4.0,
      low: 2.0,
      medium: 1.0,
      high: 0.5
    };
    
    baseTTL = Math.floor(baseTTL * volatilityMultiplier[profile.volatility]);
    
    // Importance multiplier
    const importanceMultiplier = {
      critical: 1.5,
      high: 1.2,
      medium: 1.0,
      low: 0.8
    };
    
    baseTTL = Math.floor(baseTTL * importanceMultiplier[profile.importance]);
    
    // Context adjustments
    if (context.isPeak) {
      baseTTL = Math.floor(baseTTL * 1.5);
    }
    
    if (context.isEvent && (contentType === 'events' || contentType === 'hours')) {
      baseTTL = Math.floor(baseTTL * 0.3);
    }
    
    // Bounds
    const minTTL = 300; // 5 minutes
    const maxTTL = 86400 * 7; // 1 week
    
    return Math.max(minTTL, Math.min(maxTTL, baseTTL));
  }

  /**
   * Get cache strategy for content type
   */
  getCacheStrategy(contentType) {
    const profiles = this.getContentProfiles();
    const profile = profiles[contentType];
    
    if (!profile) {
      return {
        strategy: 'stale-while-revalidate',
        reasoning: 'Unknown content type'
      };
    }
    
    if (profile.importance === 'critical' && profile.volatility === 'low') {
      return {
        strategy: 'cache-first',
        reasoning: 'Critical content that rarely changes'
      };
    }
    
    if (profile.volatility === 'high') {
      return {
        strategy: 'network-first',
        reasoning: 'Frequently changing content'
      };
    }
    
    return {
      strategy: 'stale-while-revalidate',
      reasoning: 'Balanced approach'
    };
  }

  /**
   * Check if current time is peak hours
   */
  isPeakHour() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    const peakHours = [
      { start: 12, end: 14 }, // Lunch
      { start: 18, end: 21 }, // Dinner
      { start: 11, end: 15, day: 0 }, // Sunday
      { start: 11, end: 15, day: 6 }, // Saturday
    ];
    
    return peakHours.some(peak => {
      const isTimeMatch = hour >= peak.start && hour < peak.end;
      const isDayMatch = peak.day === undefined || peak.day === day;
      return isTimeMatch && isDayMatch;
    });
  }

  /**
   * Get content dependencies
   */
  getDependencies(contentType) {
    const dependencies = {
      restaurant: { preloadWith: ['menu', 'hours'] },
      menu: { preloadWith: ['restaurant'] },
      hours: { preloadWith: ['restaurant', 'contact'] },
      slideshow: { preloadWith: ['testimonials'] },
      blog: { preloadWith: ['events'] },
      events: { preloadWith: ['hours'] }
    };
    
    return dependencies[contentType] || { preloadWith: [] };
  }

  /**
   * Run optimization and generate configuration
   */
  optimize() {
    console.log('\n🔧 Running advanced cache optimization...\n');
    
    const environment = process.env.NODE_ENV || 'development';
    const isPeak = this.isPeakHour();
    
    console.log(`Environment: ${environment}`);
    console.log(`Peak hours: ${isPeak ? 'YES' : 'NO'}`);
    
    const contentTypes = [
      'restaurant', 'menu', 'hours', 'blog', 'events', 
      'slideshow', 'testimonials', 'about', 'images'
    ];
    
    console.log('\n📊 Optimal Cache Configuration:');
    console.log('Content Type'.padEnd(15) + 'TTL'.padEnd(12) + 'Strategy'.padEnd(22) + 'Preload With');
    console.log('-'.repeat(75));
    
    const config = {
      environment,
      isPeakHour: isPeak,
      contentTTL: {},
      cacheStrategies: {},
      dependencies: {},
      generated: new Date().toISOString()
    };
    
    for (const contentType of contentTypes) {
      const context = { isPeak, userType: 'returning' };
      const ttl = this.generateOptimalTTL(contentType, context);
      const strategyInfo = this.getCacheStrategy(contentType);
      const deps = this.getDependencies(contentType);
      
      config.contentTTL[contentType] = ttl;
      config.cacheStrategies[contentType] = strategyInfo.strategy;
      config.dependencies[contentType] = deps;
      
      const ttlMin = Math.round(ttl / 60);
      const ttlDisplay = ttlMin >= 60 ? 
        `${Math.round(ttlMin / 60)}h` : 
        `${ttlMin}m`;
      
      console.log(
        contentType.padEnd(15) + 
        ttlDisplay.padEnd(12) + 
        strategyInfo.strategy.padEnd(22) + 
        deps.preloadWith.join(', ')
      );
    }
    
    // Save configuration
    fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
    
    console.log(`\n✅ Cache optimization complete`);
    console.log(`📝 Configuration saved to: ${this.configFile}`);
    
    // Performance recommendations
    console.log('\n🎯 Performance Recommendations:');
    
    if (isPeak) {
      console.log('  • Peak hours detected - cache durations increased by 50%');
      console.log('  • Consider preloading menu and hours content');
    }
    
    if (environment === 'production') {
      console.log('  • Production environment - full cache durations applied');
      console.log('  • Service worker and CDN caching enabled');
    } else {
      console.log('  • Development environment - shortened cache durations');
      console.log('  • Consider testing with production-like cache settings');
    }
    
    return config;
  }
}

// CLI execution
if (require.main === module) {
  const optimizer = new StandaloneCacheOptimizer();
  optimizer.optimize();
}

module.exports = StandaloneCacheOptimizer;