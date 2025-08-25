/**
 * Enhanced Marketing Smart Loader
 * 
 * Extends BaseSmartLoader to provide enhanced marketing data loading with:
 * - Integration with existing marketing.json loading logic
 * - API loading with fallback strategies
 * - Performance monitoring and metrics
 * - Backward compatibility with getMarketingContent
 */

import 'server-only';
import fs from "fs/promises";
import path from "path";
import { MarketingSchema, type Marketing } from '../schemas';
import { BaseSmartLoader, type SmartLoadConfig } from './BaseSmartLoader';
import { getConfigData } from '../loader';
import type { AppEnv } from '../env';

class MarketingSmartLoaderClass extends BaseSmartLoader<Marketing> {
  protected schema = MarketingSchema;
  protected resourceName = 'marketing';

  protected getTTL(env: AppEnv): number {
    // Marketing data can change frequently for promotions
    switch (env) {
      case 'app':
        return process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 5 * 60 * 1000; // 15min prod, 5min dev
      default:
        return 5 * 60 * 1000; // 5 minutes default
    }
  }

  protected async loadFromFilesystem(env: AppEnv): Promise<Marketing> {
    const configPath = this.getConfigPath("marketing.json");
    const raw = await fs.readFile(configPath, "utf8");
    const parsed = JSON.parse(raw);
    return await this.validateAndParse(parsed);
  }

  protected async tryLoadFromAPI(env: AppEnv, config: SmartLoadConfig): Promise<Marketing | null> {
    try {
      const cfg = await getConfigData(env);
      const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
      const endpoint = cfg.api?.marketingEndpoint;

      if (!cmsOn || !endpoint) {
        return null; // CMS not enabled or no endpoint configured
      }

      const response = await this.fetchWithRetry(endpoint, config);
      const json = await response.json();
      return await this.validateAndParse(json);
    } catch (error) {
      console.warn('Marketing API loading failed:', error);
      return null; // Will trigger filesystem fallback
    }
  }

  private getConfigPath(file: string): string {
    return path.join(process.cwd(), "config", file);
  }

  /**
   * Preload marketing data for cache warming
   */
  async preload(env: AppEnv): Promise<void> {
    try {
      await this.loadSmart(env, { enablePerformanceMonitoring: false });
      console.log(`Marketing data preloaded for environment: ${env}`);
    } catch (error) {
      console.warn(`Marketing preload failed for environment ${env}:`, error);
    }
  }

  /**
   * Get marketing health status
   */
  async getHealthStatus(env: AppEnv): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: {
      hasHeroContent: boolean;
      promoCount: number;
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
      
      const hasHeroContent = !!(result.data.hero?.title);
      const promoCount = result.data.promos?.length || 0;
      const loadTime = Date.now() - startTime;
      
      const status = hasHeroContent ? 'healthy' : 'degraded';
      
      return {
        status,
        details: {
          hasHeroContent,
          promoCount,
          lastUpdated: result.timestamp,
          cacheStatus,
          loadTime
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          hasHeroContent: false,
          promoCount: 0,
          lastUpdated: '',
          cacheStatus: 'error',
          loadTime: Date.now() - startTime
        }
      };
    }
  }
}

// Export singleton instance
export const MarketingSmartLoader = new MarketingSmartLoaderClass();

// Backward compatibility functions
export async function getMarketingContent(env: AppEnv): Promise<Marketing> {
  return MarketingSmartLoader.load(env);
}

export async function getMarketingSmart(env: AppEnv): Promise<Marketing> {
  return MarketingSmartLoader.load(env);
}

export async function getMarketingSmartWithResult(env: AppEnv): Promise<import('./BaseSmartLoader').SmartLoadResult<Marketing>> {
  return MarketingSmartLoader.loadSmart(env);
}