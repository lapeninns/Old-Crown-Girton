/**
 * Enhanced Restaurant Smart Loader
 * 
 * Extends BaseSmartLoader to provide enhanced restaurant data loading with:
 * - Integration with existing restaurant.json loading logic
 * - API loading with fallback strategies
 * - Performance monitoring and metrics
 * - Backward compatibility with getRestaurantInfo
 */

import 'server-only';
import fs from "fs/promises";
import path from "path";
import { RestaurantSchema, type Restaurant } from '../schemas';
import { BaseSmartLoader, type SmartLoadConfig } from './BaseSmartLoader';
import { getConfigData } from '../loader';
import type { AppEnv } from '../env';

class RestaurantSmartLoaderClass extends BaseSmartLoader<Restaurant> {
  protected schema = RestaurantSchema;
  protected resourceName = 'restaurant';

  protected getTTL(env: AppEnv): number {
    // Restaurant data changes less frequently, can cache longer
    switch (env) {
      case 'app':
        return process.env.NODE_ENV === 'production' ? 60 * 60 * 1000 : 10 * 60 * 1000; // 60min prod, 10min dev
      default:
        return 10 * 60 * 1000; // 10 minutes default
    }
  }

  protected async loadFromFilesystem(env: AppEnv): Promise<Restaurant> {
    const configPath = this.getConfigPath("restaurant.json");
    const raw = await fs.readFile(configPath, "utf8");
    const parsed = JSON.parse(raw);
    return await this.validateAndParse(parsed);
  }

  protected async tryLoadFromAPI(env: AppEnv, config: SmartLoadConfig): Promise<Restaurant | null> {
    try {
      const cfg = await getConfigData(env);
      const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
      const endpoint = cfg.api?.restaurantEndpoint;

      if (!cmsOn || !endpoint) {
        return null; // CMS not enabled or no endpoint configured
      }

      const response = await this.fetchWithRetry(endpoint, config);
      const json = await response.json();
      return await this.validateAndParse(json);
    } catch (error) {
      console.warn('Restaurant API loading failed:', error);
      return null; // Will trigger filesystem fallback
    }
  }

  private getConfigPath(file: string): string {
    return path.join(process.cwd(), "config", file);
  }

  /**
   * Preload restaurant data for cache warming
   */
  async preload(env: AppEnv): Promise<void> {
    try {
      await this.loadSmart(env, { enablePerformanceMonitoring: false });
      console.log(`Restaurant data preloaded for environment: ${env}`);
    } catch (error) {
      console.warn(`Restaurant preload failed for environment ${env}:`, error);
    }
  }

  /**
   * Get restaurant health status
   */
  async getHealthStatus(env: AppEnv): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: {
      hasRequiredFields: boolean;
      lastUpdated: string;
      cacheStatus: 'hit' | 'miss' | 'error';
      loadTime: number;
    };
  }> {
    const startTime = Date.now();
    let cacheStatus: 'hit' | 'miss' | 'error' = 'miss';
    
    try {
      const result = await this.loadSmart(env, { enablePerformanceMonitoring: false });
      cacheStatus = result.cached ? 'hit' : 'miss';
      
      const hasRequiredFields = !!(
        result.data.name && 
        result.data.phone && 
        result.data.email && 
        result.data.address
      );
      
      const loadTime = Date.now() - startTime;
      const status = hasRequiredFields ? 'healthy' : 'degraded';
      
      return {
        status,
        details: {
          hasRequiredFields,
          lastUpdated: result.timestamp,
          cacheStatus,
          loadTime
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          hasRequiredFields: false,
          lastUpdated: '',
          cacheStatus: 'error',
          loadTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Validate restaurant contact information
   */
  async validateContactInfo(env: AppEnv): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    try {
      const restaurant = await this.load(env);
      const issues: string[] = [];

      // Validate phone number format
      if (!/^[\+]?[0-9\s\-\(\)]+$/.test(restaurant.phone)) {
        issues.push('Invalid phone number format');
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(restaurant.email)) {
        issues.push('Invalid email format');
      }

      // Validate address completeness
      if (!restaurant.address.street || !restaurant.address.city) {
        issues.push('Incomplete address information');
      }

      // Validate opening hours
      if (!restaurant.hours || Object.keys(restaurant.hours).length === 0) {
        issues.push('Missing opening hours');
      }

      return {
        valid: issues.length === 0,
        issues
      };
    } catch (error) {
      return {
        valid: false,
        issues: [`Failed to load restaurant data: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }
}

// Export singleton instance
export const RestaurantSmartLoader = new RestaurantSmartLoaderClass();

// Backward compatibility functions
export async function getRestaurantInfo(env: AppEnv): Promise<Restaurant> {
  return RestaurantSmartLoader.load(env);
}

export async function getRestaurantSmart(env: AppEnv): Promise<Restaurant> {
  return RestaurantSmartLoader.load(env);
}

export async function getRestaurantSmartWithResult(env: AppEnv): Promise<import('./BaseSmartLoader').SmartLoadResult<Restaurant>> {
  return RestaurantSmartLoader.loadSmart(env);
}