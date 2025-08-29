/**
 * Environment Override System
 * 
 * Manages environment-specific content overrides, inheritance, and configuration
 * for different deployment environments (dev, staging, prod).
 */

import { composeContent, type CompositionConfig, type CompositionResult } from './composition';

export interface EnvironmentConfig {
  id: string;
  name: string;
  inherits?: string;
  overrides: string[];
  variables: Record<string, any>;
  features: EnvironmentFeatures;
  content: EnvironmentContentConfig;
  debug: boolean;
}

export interface EnvironmentFeatures {
  enableDebugMode: boolean;
  enablePerformanceTracking: boolean;
  enableCacheOptimization: boolean;
  enableContentValidation: boolean;
  enableErrorReporting: boolean;
  allowDynamicContent: boolean;
  enableAnalytics: boolean;
}

export interface EnvironmentContentConfig {
  additionalModules: string[];
  excludeModules: string[];
  overridePaths: string[];
  fallbackBehavior: 'graceful' | 'strict' | 'silent';
  cacheStrategy: 'aggressive' | 'moderate' | 'minimal' | 'disabled';
  compressionLevel: 'none' | 'basic' | 'optimal' | 'maximum';
}

export interface EnvironmentOverride {
  path: string;
  value: any;
  condition?: string;
  priority: number;
  description?: string;
}

export interface EnvironmentContext {
  environment: string;
  version: string;
  buildId?: string;
  deploymentTime: number;
  features: EnvironmentFeatures;
  variables: Record<string, any>;
}

/**
 * Environment Manager Class
 */
export class EnvironmentManager {
  private environments = new Map<string, EnvironmentConfig>();
  private currentEnvironment: string;
  private overrideCache = new Map<string, any>();
  
  constructor(currentEnvironment: string = 'dev') {
    this.currentEnvironment = currentEnvironment;
    this.initializeDefaultEnvironments();
  }
  
  /**
   * Initialize default environment configurations
   */
  private initializeDefaultEnvironments(): void {
    // Development environment
    this.environments.set('dev', {
      id: 'dev',
      name: 'Development',
      overrides: ['environments/dev/overrides/'],
      variables: {
        API_BASE_URL: 'http://localhost:3000/api',
        ENABLE_LOGGING: true,
        CACHE_TTL: 60000, // 1 minute
        DEBUG_PANELS: true,
      },
      features: {
        enableDebugMode: true,
        enablePerformanceTracking: true,
        enableCacheOptimization: false,
        enableContentValidation: true,
        enableErrorReporting: true,
        allowDynamicContent: true,
        enableAnalytics: false,
      },
      content: {
        additionalModules: ['dev/debug'],
        excludeModules: ['analytics/*', 'prod/*'],
        overridePaths: ['environments/dev/'],
        fallbackBehavior: 'graceful',
        cacheStrategy: 'minimal',
        compressionLevel: 'none',
      },
      debug: true,
    });
    
    // Staging environment
    this.environments.set('staging', {
      id: 'staging',
      name: 'Staging',
      inherits: 'dev',
      overrides: ['environments/staging/overrides/'],
      variables: {
        API_BASE_URL: 'https://staging-api.restaurant.com',
        ENABLE_LOGGING: true,
        CACHE_TTL: 300000, // 5 minutes
        DEBUG_PANELS: false,
      },
      features: {
        enableDebugMode: false,
        enablePerformanceTracking: true,
        enableCacheOptimization: true,
        enableContentValidation: true,
        enableErrorReporting: true,
        allowDynamicContent: true,
        enableAnalytics: true,
      },
      content: {
        additionalModules: ['staging/test'],
        excludeModules: ['dev/*'],
        overridePaths: ['environments/staging/'],
        fallbackBehavior: 'graceful',
        cacheStrategy: 'moderate',
        compressionLevel: 'basic',
      },
      debug: false,
    });
    
    // Production environment
    this.environments.set('prod', {
      id: 'prod',
      name: 'Production',
      inherits: 'staging',
      overrides: ['environments/prod/overrides/'],
      variables: {
        API_BASE_URL: 'https://api.restaurant.com',
        ENABLE_LOGGING: false,
        CACHE_TTL: 3600000, // 1 hour
        DEBUG_PANELS: false,
      },
      features: {
        enableDebugMode: false,
        enablePerformanceTracking: false,
        enableCacheOptimization: true,
        enableContentValidation: false,
        enableErrorReporting: true,
        allowDynamicContent: false,
        enableAnalytics: true,
      },
      content: {
        additionalModules: ['analytics/prod'],
        excludeModules: ['dev/*', 'staging/*', 'debug/*'],
        overridePaths: ['environments/prod/'],
        fallbackBehavior: 'strict',
        cacheStrategy: 'aggressive',
        compressionLevel: 'maximum',
      },
      debug: false,
    });
  }
  
  /**
   * Get current environment configuration
   */
  getCurrentEnvironment(): EnvironmentConfig {
    const config = this.environments.get(this.currentEnvironment);
    if (!config) {
      throw new Error(`Environment ${this.currentEnvironment} not found`);
    }
    return this.resolveInheritance(config);
  }
  
  /**
   * Get environment context for content composition
   */
  getEnvironmentContext(): EnvironmentContext {
    const config = this.getCurrentEnvironment();
    return {
      environment: this.currentEnvironment,
      version: '1.0.0',
      buildId: process.env.BUILD_ID,
      deploymentTime: Date.now(),
      features: config.features,
      variables: config.variables,
    };
  }
  
  /**
   * Apply environment overrides to content
   */
  async applyEnvironmentOverrides(
    baseContent: any,
    contentPath?: string
  ): Promise<CompositionResult> {
    const config = this.getCurrentEnvironment();
    const overrides = await this.loadEnvironmentOverrides(config.overrides, contentPath);
    
    const modules: Array<{ data: any; context: import('./composition').CompositionContext }> = [
      {
        data: baseContent,
        context: {
          environment: 'base',
          timestamp: Date.now() - 1000,
          moduleId: 'base-content',
          priority: 1,
          source: 'base' as const,
        },
      },
    ];
    
    // Add environment overrides with higher priority
    overrides.forEach((override, index) => {
      const envContext: import('./composition').CompositionContext = {
        environment: this.currentEnvironment,
        timestamp: Date.now() + index,
        moduleId: `env-override-${index}`,
        priority: override.priority,
        source: 'environment',
      };
      
      modules.push({
        data: override.value,
        context: envContext,
      });
    });
    
    // Apply variable substitution
    const result = composeContent(modules, {
      strategy: 'deep-merge',
      conflictResolution: 'environment-wins',
      fallbackStrategy: config.content.fallbackBehavior === 'graceful' ? 'base-module' : 'error',
      mergeArrays: 'concat',
      preserveRootKeys: true,
      enableValidation: config.features.enableContentValidation,
      debugMode: config.debug,
    });
    
    // Apply variable substitution to the final result
    result.data = this.substituteVariables(result.data, config.variables);
    
    return result;
  }
  
  /**
   * Load environment-specific overrides
   */
  private async loadEnvironmentOverrides(
    overridePaths: string[],
    contentPath?: string
  ): Promise<EnvironmentOverride[]> {
    const cacheKey = `${this.currentEnvironment}-${overridePaths.join(',')}-${contentPath || 'all'}`;
    
    if (this.overrideCache.has(cacheKey)) {
      return this.overrideCache.get(cacheKey);
    }
    
    const overrides: EnvironmentOverride[] = [];
    
    for (const overridePath of overridePaths) {
      try {
        // In a real implementation, this would load from the file system or API
        const environmentOverrides = await this.loadOverrideFiles(overridePath, contentPath);
        overrides.push(...environmentOverrides);
      } catch (error) {
        console.warn(`Failed to load overrides from ${overridePath}:`, error);
      }
    }
    
    // Sort by priority (higher number = higher priority)
    overrides.sort((a, b) => b.priority - a.priority);
    
    this.overrideCache.set(cacheKey, overrides);
    return overrides;
  }
  
  /**
   * Load override files from a specific path
   */
  private async loadOverrideFiles(
    basePath: string,
    contentPath?: string
  ): Promise<EnvironmentOverride[]> {
    // This is a simplified implementation
    // In a real scenario, this would load actual files from the filesystem or API
    
    const mockOverrides: Record<string, EnvironmentOverride[]> = {
      'environments/dev/overrides/': [
        {
          path: 'global.site.name',
          value: 'The Old Crown Girton [DEV]',
          priority: 10,
          description: 'Development site name indicator',
        },
        {
          path: 'ui.messages.warning',
          value: '[DEV] This is a development environment',
          priority: 5,
          description: 'Development warning message',
        },
      ],
      'environments/staging/overrides/': [
        {
          path: 'global.site.name',
          value: 'The Old Crown Girton [STAGING]',
          priority: 10,
          description: 'Staging site name indicator',
        },
        {
          path: 'ui.messages.warning',
          value: '[STAGING] This is a test environment',
          priority: 5,
          description: 'Staging warning message',
        },
      ],
      'environments/prod/overrides/': [
        {
          path: 'global.site.description',
          value: 'Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics. Book online or call 01223277217',
          priority: 10,
          description: 'Production optimized description',
        },
      ],
    };
    
    return mockOverrides[basePath] || [];
  }
  
  /**
   * Substitute environment variables in content
   */
  private substituteVariables(content: any, variables: Record<string, any>): any {
    if (typeof content === 'string') {
      return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key] !== undefined ? variables[key] : match;
      });
    }
    
    if (Array.isArray(content)) {
      return content.map(item => this.substituteVariables(item, variables));
    }
    
    if (content && typeof content === 'object') {
      const result: any = {};
      for (const key in content) {
        if (content.hasOwnProperty(key)) {
          result[key] = this.substituteVariables(content[key], variables);
        }
      }
      return result;
    }
    
    return content;
  }
  
  /**
   * Resolve environment inheritance
   */
  private resolveInheritance(config: EnvironmentConfig): EnvironmentConfig {
    if (!config.inherits) {
      return config;
    }
    
    const parentConfig = this.environments.get(config.inherits);
    if (!parentConfig) {
      console.warn(`Parent environment ${config.inherits} not found`);
      return config;
    }
    
    const resolvedParent = this.resolveInheritance(parentConfig);
    
    return {
      ...resolvedParent,
      ...config,
      variables: { ...resolvedParent.variables, ...config.variables },
      features: { ...resolvedParent.features, ...config.features },
      content: { ...resolvedParent.content, ...config.content },
      overrides: [...resolvedParent.overrides, ...config.overrides],
    };
  }
  
  /**
   * Set current environment
   */
  setEnvironment(environment: string): void {
    if (!this.environments.has(environment)) {
      throw new Error(`Environment ${environment} not found`);
    }
    this.currentEnvironment = environment;
    this.overrideCache.clear();
  }
  
  /**
   * Register a new environment
   */
  registerEnvironment(config: EnvironmentConfig): void {
    this.environments.set(config.id, config);
  }
  
  /**
   * Get all available environments
   */
  getAvailableEnvironments(): EnvironmentConfig[] {
    return Array.from(this.environments.values());
  }
  
  /**
   * Check if a feature is enabled in current environment
   */
  isFeatureEnabled(feature: keyof EnvironmentFeatures): boolean {
    const config = this.getCurrentEnvironment();
    return config.features[feature];
  }
  
  /**
   * Get environment variable
   */
  getVariable(key: string, defaultValue?: any): any {
    const config = this.getCurrentEnvironment();
    return config.variables[key] !== undefined ? config.variables[key] : defaultValue;
  }
  
  /**
   * Clear override cache
   */
  clearCache(): void {
    this.overrideCache.clear();
  }
}

// Singleton instance
let environmentManager: EnvironmentManager | null = null;

/**
 * Get the global environment manager instance
 */
export function getEnvironmentManager(): EnvironmentManager {
  if (!environmentManager) {
    const nodeEnv = process.env.NODE_ENV;
    const customEnv = process.env.ENVIRONMENT || process.env.ENV;
    
    let currentEnv: string;
    if (nodeEnv === 'production' || customEnv === 'prod') {
      currentEnv = 'prod';
    } else if (customEnv === 'staging') {
      currentEnv = 'staging';
    } else {
      currentEnv = 'dev';
    }
    
    environmentManager = new EnvironmentManager(currentEnv);
  }
  return environmentManager;
}

/**
 * Helper function to apply environment overrides to content
 */
export async function applyEnvironmentOverrides(
  content: any,
  environment?: string,
  contentPath?: string
): Promise<CompositionResult> {
  const manager = getEnvironmentManager();
  
  if (environment && environment !== manager.getCurrentEnvironment().id) {
    manager.setEnvironment(environment);
  }
  
  return manager.applyEnvironmentOverrides(content, contentPath);
}

/**
 * Helper function to check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof EnvironmentFeatures): boolean {
  const manager = getEnvironmentManager();
  return manager.isFeatureEnabled(feature);
}

/**
 * Helper function to get environment variable
 */
export function getEnvironmentVariable(key: string, defaultValue?: any): any {
  const manager = getEnvironmentManager();
  return manager.getVariable(key, defaultValue);
}