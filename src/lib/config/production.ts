/**
 * Production Configuration Management
 * 
 * Centralized configuration for production deployment of the modular content system.
 * Handles environment variables, feature flags, and deployment-specific settings.
 */

export interface ProductionConfig {
  // Content system
  contentVersion: string;
  environment: 'dev' | 'staging' | 'prod';
  useModularContent: boolean;
  
  // API configuration
  apiBaseUrl: string;
  cdnUrl?: string;
  
  // Security
  allowedOrigins: string[];
  rateLimiting: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
  };
  
  // Performance
  caching: {
    enabled: boolean;
    compression: boolean;
    cdn: boolean;
    durations: {
      core: number;
      pages: number;
      components: number;
    };
  };
  
  // Monitoring
  monitoring: {
    errorTracking: boolean;
    performance: boolean;
    analytics: boolean;
  };
  
  // Feature flags
  features: {
    lazyLoading: boolean;
    environmentOverrides: boolean;
    conditionalLoading: boolean;
    performanceOptimization: boolean;
    backwardCompatibility: boolean;
    contentValidation: boolean;
  };
  
  // Build info
  buildId: string;
  nodeEnv: string;
}

/**
 * Get production configuration from environment variables
 */
export function getProductionConfig(): ProductionConfig {
  const env = process.env;
  
  return {
    // Content system
    contentVersion: env.NEXT_PUBLIC_CONTENT_VERSION || '1.0.0',
    environment: (env.NEXT_PUBLIC_ENVIRONMENT as any) || 'dev',
    useModularContent: env.NEXT_PUBLIC_USE_MODULAR_CONTENT === 'true',
    
    // API configuration
    apiBaseUrl: env.NEXT_PUBLIC_CONTENT_API_BASE || '/api/content',
    cdnUrl: env.CONTENT_CDN_URL,
    
    // Security
    allowedOrigins: env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',') : ['*'],
    rateLimiting: {
      enabled: env.RATE_LIMIT_ENABLED === 'true',
      maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS || '100'),
      windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS || '60000'),
    },
    
    // Performance
    caching: {
      enabled: env.ENABLE_CACHE_OPTIMIZATION === 'true',
      compression: env.ENABLE_CONTENT_COMPRESSION === 'true',
      cdn: env.ENABLE_CONTENT_CDN === 'true',
      durations: {
        core: parseInt(env.CACHE_DURATION_CORE || '1800000'),
        pages: parseInt(env.CACHE_DURATION_PAGES || '600000'),
        components: parseInt(env.CACHE_DURATION_COMPONENTS || '300000'),
      },
    },
    
    // Monitoring
    monitoring: {
      errorTracking: env.ENABLE_ERROR_TRACKING === 'true',
      performance: env.ENABLE_PERFORMANCE_MONITORING === 'true',
      analytics: env.ENABLE_CONTENT_ANALYTICS === 'true',
    },
    
    // Feature flags
    features: {
      lazyLoading: env.FEATURE_FLAG_LAZY_LOADING !== 'false',
      environmentOverrides: env.FEATURE_FLAG_ENVIRONMENT_OVERRIDES !== 'false',
      conditionalLoading: env.FEATURE_FLAG_CONDITIONAL_LOADING !== 'false',
      performanceOptimization: env.FEATURE_FLAG_PERFORMANCE_OPTIMIZATION !== 'false',
      backwardCompatibility: env.FEATURE_FLAG_BACKWARD_COMPATIBILITY !== 'false',
      contentValidation: env.FEATURE_FLAG_CONTENT_VALIDATION === 'true',
    },
    
    // Build info
    buildId: env.BUILD_ID || `build-${Date.now()}`,
    nodeEnv: env.NODE_ENV || 'development',
  };
}

/**
 * Validate production configuration
 */
export function validateProductionConfig(config: ProductionConfig): { 
  valid: boolean; 
  errors: string[]; 
  warnings: string[]; 
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields validation
  if (!config.contentVersion) {
    errors.push('Content version is required');
  }
  
  if (!config.apiBaseUrl) {
    errors.push('API base URL is required');
  }
  
  if (!config.buildId) {
    warnings.push('Build ID should be set for production deployment');
  }
  
  // Environment-specific validation
  if (config.environment === 'prod') {
    if (config.allowedOrigins.includes('*')) {
      warnings.push('Wildcard CORS origins not recommended for production');
    }
    
    if (!config.rateLimiting.enabled) {
      warnings.push('Rate limiting should be enabled in production');
    }
    
    if (!config.caching.enabled) {
      warnings.push('Caching should be enabled in production');
    }
    
    if (!config.monitoring.errorTracking) {
      warnings.push('Error tracking should be enabled in production');
    }
    
    if (config.features.contentValidation) {
      warnings.push('Content validation may impact performance in production');
    }
  }
  
  // Performance validation
  if (config.caching.enabled) {
    if (config.caching.durations.core < 60000) {
      warnings.push('Core content cache duration seems too short for production');
    }
  }
  
  // Security validation
  if (config.environment === 'prod' && config.nodeEnv !== 'production') {
    errors.push('NODE_ENV should be "production" for production environment');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get cache configuration for specific content type
 */
export function getCacheConfig(contentType: 'core' | 'pages' | 'components'): {
  maxAge: number;
  sMaxAge: number;
  staleWhileRevalidate: number;
} {
  const config = getProductionConfig();
  const duration = config.caching.durations[contentType];
  const maxAge = Math.floor(duration / 1000);
  
  if (config.environment === 'prod') {
    return {
      maxAge,
      sMaxAge: Math.floor(maxAge * 1.5),
      staleWhileRevalidate: 86400, // 24 hours
    };
  } else if (config.environment === 'staging') {
    return {
      maxAge: Math.floor(maxAge / 2),
      sMaxAge: maxAge,
      staleWhileRevalidate: 3600, // 1 hour
    };
  } else {
    return {
      maxAge: 0,
      sMaxAge: 0,
      staleWhileRevalidate: 0,
    };
  }
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof ProductionConfig['features']): boolean {
  const config = getProductionConfig();
  return config.features[feature];
}

/**
 * Get monitoring configuration
 */
export function getMonitoringConfig(): {
  errorTrackingEndpoint?: string;
  performanceEndpoint?: string;
  analyticsEndpoint?: string;
} {
  const env = process.env;
  
  return {
    errorTrackingEndpoint: env.ERROR_TRACKING_ENDPOINT,
    performanceEndpoint: env.PERFORMANCE_TRACKING_ENDPOINT,
    analyticsEndpoint: env.ANALYTICS_ENDPOINT,
  };
}

/**
 * Create production-ready headers for content responses
 */
export function createProductionHeaders(
  contentType: 'core' | 'pages' | 'components',
  additionalHeaders: Record<string, string> = {}
): Record<string, string> {
  const config = getProductionConfig();
  const cacheConfig = getCacheConfig(contentType);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Content-Version': config.contentVersion,
    'X-Environment': config.environment,
    'X-Build-ID': config.buildId,
    ...additionalHeaders,
  };
  
  // Cache headers
  if (config.caching.enabled && config.environment === 'prod') {
    headers['Cache-Control'] = [
      'public',
      `max-age=${cacheConfig.maxAge}`,
      `s-maxage=${cacheConfig.sMaxAge}`,
      `stale-while-revalidate=${cacheConfig.staleWhileRevalidate}`,
    ].join(', ');
    
    if (config.caching.cdn) {
      headers['CDN-Cache-Control'] = `public, max-age=${cacheConfig.sMaxAge}`;
    }
  } else {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  }
  
  // Security headers
  if (config.environment === 'prod') {
    headers['X-Content-Type-Options'] = 'nosniff';
    headers['X-Frame-Options'] = 'DENY';
    headers['X-XSS-Protection'] = '1; mode=block';
    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
  }
  
  // CORS headers
  if (config.allowedOrigins.length > 0 && !config.allowedOrigins.includes('*')) {
    headers['Access-Control-Allow-Origin'] = config.allowedOrigins[0]; // Use first origin
    headers['Vary'] = 'Origin';
  } else if (config.allowedOrigins.includes('*')) {
    headers['Access-Control-Allow-Origin'] = '*';
  }
  
  return headers;
}

/**
 * Log configuration for debugging
 */
export function logProductionConfig(): void {
  const config = getProductionConfig();
  const validation = validateProductionConfig(config);
  
  console.log('🚀 Production Configuration:', {
    environment: config.environment,
    version: config.contentVersion,
    buildId: config.buildId,
    modularContent: config.useModularContent,
    caching: config.caching.enabled,
    monitoring: config.monitoring,
    validation: {
      valid: validation.valid,
      errors: validation.errors.length,
      warnings: validation.warnings.length,
    },
  });
  
  if (validation.errors.length > 0) {
    console.error('❌ Configuration Errors:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Configuration Warnings:', validation.warnings);
  }
}

// Initialize configuration validation on module load
if (typeof window === 'undefined') { // Server-side only
  const config = getProductionConfig();
  const validation = validateProductionConfig(config);
  
  if (validation.errors.length > 0) {
    console.error('❌ Invalid production configuration:', validation.errors);
  }
}