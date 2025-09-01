/**
 * Content Volatility Analysis and Cache TTL Optimization
 * Analyzes content update patterns and sets optimal cache durations
 */

interface ContentType {
  type: string;
  volatility: 'high' | 'medium' | 'low' | 'static';
  updateFrequency: number; // hours
  importance: 'critical' | 'high' | 'medium' | 'low';
  dependencies: string[];
}

interface CacheTTLConfig {
  browser: number; // seconds
  cdn: number; // seconds
  server: number; // seconds
  staleWhileRevalidate: number; // seconds
}

/**
 * Restaurant content volatility profiles
 */
const CONTENT_PROFILES: Record<string, ContentType> = {
  // Critical business information
  restaurant: {
    type: 'restaurant',
    volatility: 'low',
    updateFrequency: 168, // weekly
    importance: 'critical',
    dependencies: ['hours', 'contact']
  },

  hours: {
    type: 'hours',
    volatility: 'medium',
    updateFrequency: 24, // daily changes possible
    importance: 'critical',
    dependencies: []
  },

  contact: {
    type: 'contact',
    volatility: 'low',
    updateFrequency: 720, // monthly
    importance: 'critical',
    dependencies: []
  },

  // Menu content
  menu: {
    type: 'menu',
    volatility: 'medium',
    updateFrequency: 72, // 3 days (seasonal changes)
    importance: 'high',
    dependencies: ['restaurant']
  },

  menuCategories: {
    type: 'menuCategories',
    volatility: 'low',
    updateFrequency: 168, // weekly
    importance: 'high',
    dependencies: ['menu']
  },

  // Marketing content
  slideshow: {
    type: 'slideshow',
    volatility: 'medium',
    updateFrequency: 168, // weekly
    importance: 'high',
    dependencies: []
  },

  testimonials: {
    type: 'testimonials',
    volatility: 'low',
    updateFrequency: 720, // monthly
    importance: 'medium',
    dependencies: []
  },

  // Blog and events
  blog: {
    type: 'blog',
    volatility: 'high',
    updateFrequency: 24, // daily posts possible
    importance: 'medium',
    dependencies: []
  },

  events: {
    type: 'events',
    volatility: 'high',
    updateFrequency: 12, // twice daily during event periods
    importance: 'high',
    dependencies: []
  },

  // Static content
  about: {
    type: 'about',
    volatility: 'static',
    updateFrequency: 2160, // quarterly
    importance: 'medium',
    dependencies: []
  },

  policies: {
    type: 'policies',
    volatility: 'static',
    updateFrequency: 4320, // biannual
    importance: 'low',
    dependencies: []
  },

  // Images
  images: {
    type: 'images',
    volatility: 'low',
    updateFrequency: 720, // monthly
    importance: 'medium',
    dependencies: []
  }
};

/**
 * Generate optimal cache TTL based on content type and context
 */
export function generateOptimalTTL(contentType: string, context: {
  isPeak?: boolean;
  isEvent?: boolean;
  userType?: 'new' | 'returning';
  device?: 'mobile' | 'desktop';
}): CacheTTLConfig {
  const profile = CONTENT_PROFILES[contentType];
  
  if (!profile) {
    console.warn(`Unknown content type: ${contentType}, using default TTL`);
    return getDefaultTTL();
  }

  let baseTTL = Math.floor(profile.updateFrequency * 3600 * 0.5); // 50% of update frequency
  
  // Adjust based on volatility
  const volatilityMultiplier = {
    static: 4.0,   // 4x longer cache
    low: 2.0,      // 2x longer cache
    medium: 1.0,   // baseline
    high: 0.5      // 50% shorter cache
  };
  
  baseTTL = Math.floor(baseTTL * volatilityMultiplier[profile.volatility]);
  
  // Adjust based on importance (critical content cached longer for reliability)
  const importanceMultiplier = {
    critical: 1.5,
    high: 1.2,
    medium: 1.0,
    low: 0.8
  };
  
  baseTTL = Math.floor(baseTTL * importanceMultiplier[profile.importance]);
  
  // Context-based adjustments
  if (context.isPeak) {
    baseTTL = Math.floor(baseTTL * 1.5); // Cache longer during peak hours
  }
  
  if (context.isEvent && (contentType === 'events' || contentType === 'hours')) {
    baseTTL = Math.floor(baseTTL * 0.3); // Much shorter cache during events
  }
  
  if (context.userType === 'new') {
    baseTTL = Math.floor(baseTTL * 1.2); // New users get slightly longer cache
  }
  
  if (context.device === 'mobile') {
    baseTTL = Math.floor(baseTTL * 1.1); // Mobile gets slightly longer cache
  }
  
  // Ensure minimum and maximum bounds
  const minTTL = 300; // 5 minutes
  const maxTTL = 86400 * 7; // 1 week
  
  baseTTL = Math.max(minTTL, Math.min(maxTTL, baseTTL));
  
  return {
    browser: baseTTL,
    cdn: Math.floor(baseTTL * 2), // CDN caches longer
    server: Math.floor(baseTTL * 0.5), // Server cache shorter for freshness
    staleWhileRevalidate: Math.floor(baseTTL * 0.3) // SWR allows stale content
  };
}

/**
 * Get default TTL configuration
 */
function getDefaultTTL(): CacheTTLConfig {
  return {
    browser: 3600, // 1 hour
    cdn: 7200, // 2 hours
    server: 1800, // 30 minutes
    staleWhileRevalidate: 900 // 15 minutes
  };
}

/**
 * Analyze content dependencies and create cache invalidation strategy
 */
export function analyzeDependencies(contentType: string): {
  invalidateWhen: string[];
  preloadWith: string[];
} {
  const profile = CONTENT_PROFILES[contentType];
  
  if (!profile) {
    return { invalidateWhen: [], preloadWith: [] };
  }
  
  // Find content that should be invalidated when this content changes
  const dependents = Object.entries(CONTENT_PROFILES)
    .filter(([, p]) => p.dependencies.includes(contentType))
    .map(([type]) => type);
  
  // Content that should be preloaded together
  const preloadWith = profile.dependencies.slice();
  
  // Add related content for better UX
  const relatedContent: Record<string, string[]> = {
    restaurant: ['menu', 'hours'],
    menu: ['restaurant', 'menuCategories'],
    hours: ['restaurant', 'contact'],
    slideshow: ['testimonials'],
    blog: ['events'],
    events: ['hours', 'contact']
  };
  
  if (relatedContent[contentType]) {
    preloadWith.push(...relatedContent[contentType]);
  }
  
  return {
    invalidateWhen: dependents,
    preloadWith: [...new Set(preloadWith)] // Remove duplicates
  };
}

/**
 * Get cache strategy based on time and context
 */
export function getCacheStrategy(contentType: string): {
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  reasoning: string;
} {
  const profile = CONTENT_PROFILES[contentType];
  
  if (!profile) {
    return {
      strategy: 'stale-while-revalidate',
      reasoning: 'Unknown content type, using balanced strategy'
    };
  }
  
  // Critical + Low volatility = cache-first
  if (profile.importance === 'critical' && profile.volatility === 'low') {
    return {
      strategy: 'cache-first',
      reasoning: 'Critical content that rarely changes'
    };
  }
  
  // High volatility = network-first
  if (profile.volatility === 'high') {
    return {
      strategy: 'network-first',
      reasoning: 'Frequently changing content needs fresh data'
    };
  }
  
  // Everything else = stale-while-revalidate (best balance)
  return {
    strategy: 'stale-while-revalidate',
    reasoning: 'Balanced approach for good performance and freshness'
  };
}

/**
 * Get peak hours cache configuration
 */
export function getPeakHoursConfig(): {
  peakHours: Array<{ start: number; end: number; day?: number }>;
  adjustments: Record<string, number>;
} {
  return {
    peakHours: [
      // Lunch times
      { start: 12, end: 14 }, // 12 PM - 2 PM
      // Dinner times
      { start: 18, end: 21 }, // 6 PM - 9 PM
      // Weekend peak times
      { start: 11, end: 15, day: 0 }, // Sunday 11 AM - 3 PM
      { start: 11, end: 15, day: 6 }, // Saturday 11 AM - 3 PM
    ],
    adjustments: {
      menu: 1.8, // Menu cached longer during meal times
      hours: 2.0, // Hours very important during peak
      restaurant: 1.5, // Restaurant info cached longer
      events: 0.5, // Events need fresh info during peak
      blog: 0.8 // Blog less important during peak
    }
  };
}

/**
 * Create environment-specific cache configuration
 */
export function getEnvironmentCacheConfig(env: 'development' | 'staging' | 'production') {
  const baseMultipliers = {
    development: 0.1, // Very short caches for development
    staging: 0.3, // Short caches for testing
    production: 1.0 // Full cache duration
  };
  
  const multiplier = baseMultipliers[env];
  
  return {
    multiplier,
    enableServiceWorker: env === 'production',
    enableCDN: env === 'production',
    debugCaching: env !== 'production',
    aggressivePurging: env !== 'production'
  };
}

/**
 * Restaurant-specific cache warming strategy
 */
export function getWarmupStrategy(): {
  immediate: string[]; // Load immediately on app start
  onIdle: string[]; // Load when browser is idle
  onInteraction: string[]; // Load on user interaction
  onTimeOfDay: Array<{ time: string; content: string[] }>; // Load at specific times
} {
  return {
    immediate: ['restaurant', 'hours', 'menu'], // Core business info
    onIdle: ['slideshow', 'testimonials', 'about'], // Marketing content
    onInteraction: ['blog', 'events', 'policies'], // User-requested content
    onTimeOfDay: [
      { time: '10:00', content: ['menu', 'hours'] }, // Pre-lunch prep
      { time: '16:00', content: ['menu', 'events'] }, // Pre-dinner prep
      { time: '21:00', content: ['blog', 'testimonials'] } // Evening reading
    ]
  };
}

export default {
  generateOptimalTTL,
  analyzeDependencies,
  getCacheStrategy,
  getPeakHoursConfig,
  getEnvironmentCacheConfig,
  getWarmupStrategy,
  CONTENT_PROFILES
};