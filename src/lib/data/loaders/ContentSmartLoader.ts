/**
 * Enhanced Content Smart Loader
 * 
 * Extends BaseSmartLoader to provide enhanced content data loading with:
 * - Integration with existing content.json loading logic
 * - API loading with fallback strategies
 * - Performance monitoring and metrics
 * - Backward compatibility with getContentData
 */

import 'server-only';
import fs from "fs/promises";
import path from "path";
import { ContentSchema, type Content } from '../schemas';
import { BaseSmartLoader, type SmartLoadConfig } from './BaseSmartLoader';
import { getConfigData } from '../loader';
import type { AppEnv } from '../env';

class ContentSmartLoaderClass extends BaseSmartLoader<Content> {
  protected schema = ContentSchema;
  protected resourceName = 'content';

  protected getTTL(env: AppEnv): number {
    // Content data changes less frequently, can cache longer
    switch (env) {
      case 'app':
        return process.env.NODE_ENV === 'production' ? 45 * 60 * 1000 : 10 * 60 * 1000; // 45min prod, 10min dev
      default:
        return 10 * 60 * 1000; // 10 minutes default
    }
  }

  protected async loadFromFilesystem(env: AppEnv): Promise<Content> {
    const configPath = this.getConfigPath("content.json");
    const raw = await fs.readFile(configPath, "utf8");
    const parsed = JSON.parse(raw);
    return await this.validateAndParse(parsed);
  }

  protected async tryLoadFromAPI(env: AppEnv, config: SmartLoadConfig): Promise<Content | null> {
    try {
      const cfg = await getConfigData(env);
      const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
      const endpoint = cfg.api?.contentEndpoint;

      if (!cmsOn || !endpoint) {
        return null; // CMS not enabled or no endpoint configured
      }

      const response = await this.fetchWithRetry(endpoint, config);
      const json = await response.json();
      return await this.validateAndParse(json);
    } catch (error) {
      console.warn('Content API loading failed:', error);
      return null; // Will trigger filesystem fallback
    }
  }

  private getConfigPath(file: string): string {
    return path.join(process.cwd(), "config", file);
  }

  /**
   * Preload content data for cache warming
   */
  async preload(env: AppEnv): Promise<void> {
    try {
      await this.loadSmart(env, { enablePerformanceMonitoring: false });
      console.log(`Content data preloaded for environment: ${env}`);
    } catch (error) {
      console.warn(`Content preload failed for environment ${env}:`, error);
    }
  }

  /**
   * Get content health status
   */
  async getHealthStatus(env: AppEnv): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: {
      hasGlobalConfig: boolean;
      hasNavigation: boolean;
      hasUI: boolean;
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
      
      const hasGlobalConfig = !!(result.data.global?.site?.name);
      const hasNavigation = !!(result.data.global?.navigation?.header);
      const hasUI = !!(result.data.global?.ui?.buttons);
      const loadTime = Date.now() - startTime;
      
      const status = (hasGlobalConfig && hasNavigation && hasUI) ? 'healthy' : 'degraded';
      
      return {
        status,
        details: {
          hasGlobalConfig,
          hasNavigation,
          hasUI,
          lastUpdated: result.timestamp,
          cacheStatus,
          loadTime
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          hasGlobalConfig: false,
          hasNavigation: false,
          hasUI: false,
          lastUpdated: '',
          cacheStatus: 'error',
          loadTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Get specific content section
   */
  async getSection<K extends keyof Content>(
    env: AppEnv,
    sectionKey: K
  ): Promise<Content[K]> {
    const content = await this.load(env);
    return content[sectionKey];
  }

  /**
   * Validate content structure completeness
   */
  async validateStructure(env: AppEnv): Promise<{
    valid: boolean;
    missing: string[];
    issues: string[];
  }> {
    try {
      const content = await this.load(env);
      const missing: string[] = [];
      const issues: string[] = [];

      // Check for required top-level sections
      const requiredSections = ['global', 'pages', 'components'];
      for (const section of requiredSections) {
        if (!(section in content)) {
          missing.push(section);
        }
      }

      // Check global section completeness
      if (content.global) {
        if (!content.global.site?.name) {
          issues.push('Missing global site name');
        }
        if (!content.global.site?.title) {
          issues.push('Missing global site title');
        }
        
        // Check navigation section completeness
        if (!content.global.navigation?.header?.links?.length) {
          issues.push('Missing header navigation links');
        }
        if (!content.global.navigation?.footer?.copyright) {
          issues.push('Missing footer copyright');
        }
        
        // Check UI section completeness
        if (!content.global.ui?.buttons || Object.keys(content.global.ui.buttons).length === 0) {
          issues.push('Missing UI button definitions');
        }
      }

      return {
        valid: missing.length === 0 && issues.length === 0,
        missing,
        issues
      };
    } catch (error) {
      return {
        valid: false,
        missing: [],
        issues: [`Failed to load content data: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }
}

// Export singleton instance
export const ContentSmartLoader = new ContentSmartLoaderClass();

// Backward compatibility functions
export async function getContentData(env: AppEnv): Promise<Content> {
  return ContentSmartLoader.load(env);
}

export async function getContentSmart(env: AppEnv): Promise<Content> {
  return ContentSmartLoader.load(env);
}

export async function getContentSmartWithResult(env: AppEnv): Promise<import('./BaseSmartLoader').SmartLoadResult<Content>> {
  return ContentSmartLoader.loadSmart(env);
}

export async function getContentDataOptimized(env: AppEnv): Promise<Content> {
  return ContentSmartLoader.load(env);
}