/**
 * Enhanced Menu Smart Loader
 * 
 * Extends BaseSmartLoader to provide enhanced menu loading with:
 * - Integration with existing loadMenuFromFileSystem logic
 * - API loading with fallback strategies
 * - Performance monitoring and metrics
 * - Backward compatibility with getMenuData/getMenuSmart
 */

import 'server-only';
import fs from "fs/promises";
import path from "path";
import { MenuSchema, type Menu } from '../schemas';
import { BaseSmartLoader, type SmartLoadConfig } from './BaseSmartLoader';
import { getConfigData } from '../loader';
import type { AppEnv } from '../env';

class MenuSmartLoaderClass extends BaseSmartLoader<Menu> {
  protected schema = MenuSchema;
  protected resourceName = 'menu';

  protected getTTL(env: AppEnv): number {
    // Environment-specific TTL for menu data
    switch (env) {
      case 'app':
        return process.env.NODE_ENV === 'production' ? 30 * 60 * 1000 : 5 * 60 * 1000; // 30min prod, 5min dev
      default:
        return 5 * 60 * 1000; // 5 minutes default
    }
  }

  protected async loadFromFilesystem(env: AppEnv): Promise<Menu> {
    return this.loadMenuFromFileSystem();
  }

  protected async tryLoadFromAPI(env: AppEnv, config: SmartLoadConfig): Promise<Menu | null> {
    try {
      const cfg = await getConfigData(env);
      const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
      const endpoint = cfg.api?.menuEndpoint;

      if (!cmsOn || !endpoint) {
        return null; // CMS not enabled or no endpoint configured
      }

      const response = await this.fetchWithRetry(endpoint, config);
      const json = await response.json();
      return await this.validateAndParse(json);
    } catch (error) {
      console.warn('Menu API loading failed:', error);
      return null; // Will trigger filesystem fallback
    }
  }

  /**
   * Enhanced version of existing loadMenuFromFileSystem with better error handling
   */
  private async loadMenuFromFileSystem(): Promise<Menu> {
    const modularMenuDir = path.join(process.cwd(), "menu");
    
    const categories = [
      { id: "starters", name: "Starters" },
      { id: "mixed_grills", name: "Mixed Grills" },
      { id: "speciality", name: "Speciality Dishes" },
      { id: "authentic_dishes", name: "Authentic Dishes" },
      { id: "naans", name: "Naans" },
      { id: "fries", name: "Fries" },
      { id: "pub_grub", name: "Pub Grub" },
      { id: "rice", name: "Rice" },
      { id: "pub_classics", name: "Pub Classic" },
      { id: "salads", name: "Salads" },
      { id: "sides", name: "Sides" },
      { id: "kids_menu", name: "Kids" },
      { id: "desserts", name: "Desserts" }
    ];
    
    const sections = [];
    const errors = [];
    
    for (const cat of categories) {
      try {
        const section = await this.loadMenuCategory(modularMenuDir, cat);
        if (section) {
          sections.push(section);
        }
      } catch (error) {
        errors.push({ category: cat.id, error: error instanceof Error ? error.message : 'Unknown error' });
        console.warn(`Warning: Could not load menu category file ${cat.id}.json:`, error);
      }
    }
    
    if (sections.length === 0) {
      throw new Error(`No menu data could be loaded from /menu directory. Errors: ${JSON.stringify(errors)}`);
    }
    
    // Log partial failures for monitoring
    if (errors.length > 0) {
      console.warn(`Menu loading completed with ${errors.length} category failures:`, errors);
    }
    
    const menu = {
      updatedAt: new Date().toISOString(),
      sections
    };

    // Validate the complete menu against schema
    return await this.validateAndParse(menu);
  }

  private async loadMenuCategory(
    modularMenuDir: string, 
    cat: { id: string; name: string }
  ): Promise<{ id: string; name: string; items: any[] } | null> {
    const filePath = path.join(modularMenuDir, `${cat.id}.json`);
    
    try {
      // Check if file exists first
      await fs.access(filePath);
      
      const raw = await fs.readFile(filePath, "utf8");
      const items = JSON.parse(raw);
      
      if (!Array.isArray(items)) {
        throw new Error(`Invalid menu category format: expected array, got ${typeof items}`);
      }
      
      // Transform items to match expected schema structure
      const transformedItems = items.map((item: any, index: number) => {
        if (!item || typeof item !== 'object') {
          throw new Error(`Invalid menu item at index ${index}: expected object, got ${typeof item}`);
        }
        
        return {
          id: item.id || `${cat.id}-${index + 1}`,
          name: item.name || `Item ${index + 1}`,
          description: item.description || "",
          price: this.parsePrice(item.price),
          available: item.available !== false,
          dietary: {
            vegetarian: item.labels?.includes("veg") || false,
            glutenFree: item.labels?.includes("GF") || false,
            vegan: item.labels?.includes("vegan") || false,
            spicy: item.labels?.includes("spicy") || false
          },
          tags: item.labels?.filter((label: string) => !['veg', 'GF', 'vegan', 'spicy'].includes(label)) || []
        };
      });
      
      return { 
        id: cat.id, 
        name: cat.name, 
        items: transformedItems 
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        console.warn(`Menu category file ${cat.id}.json not found, skipping`);
        return null;
      }
      throw error;
    }
  }

  private parsePrice(price: any): { amount: number; currency: string } {
    if (typeof price === 'number') {
      return { amount: price, currency: 'GBP' };
    }
    
    if (typeof price === 'object' && price !== null) {
      return {
        amount: Number(price.amount) || 0,
        currency: price.currency || 'GBP'
      };
    }
    
    if (typeof price === 'string') {
      // Try to extract number from string like "£12.99" or "12.99"
      const match = price.match(/[\d.]+/);
      const amount = match ? parseFloat(match[0]) : 0;
      return { amount, currency: 'GBP' };
    }
    
    return { amount: 0, currency: 'GBP' };
  }

  /**
   * Preload menu data for cache warming
   */
  async preload(env: AppEnv): Promise<void> {
    try {
      await this.loadSmart(env, { enablePerformanceMonitoring: false });
      console.log(`Menu data preloaded for environment: ${env}`);
    } catch (error) {
      console.warn(`Menu preload failed for environment ${env}:`, error);
    }
  }

  /**
   * Get menu health status
   */
  async getHealthStatus(env: AppEnv): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: {
      totalSections: number;
      totalItems: number;
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
      
      const totalItems = result.data.sections.reduce((total, section) => total + section.items.length, 0);
      const loadTime = Date.now() - startTime;
      
      const status = totalItems > 0 ? 'healthy' : 'degraded';
      
      return {
        status,
        details: {
          totalSections: result.data.sections.length,
          totalItems,
          lastUpdated: result.data.updatedAt,
          cacheStatus,
          loadTime
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          totalSections: 0,
          totalItems: 0,
          lastUpdated: '',
          cacheStatus: 'error',
          loadTime: Date.now() - startTime
        }
      };
    }
  }
}

// Export singleton instance
export const MenuSmartLoader = new MenuSmartLoaderClass();

// Backward compatibility functions
export async function getMenuData(env: AppEnv): Promise<Menu> {
  return MenuSmartLoader.load(env);
}

export async function getMenuSmart(env: AppEnv): Promise<Menu> {
  return MenuSmartLoader.load(env);
}

export async function getMenuSmartWithResult(env: AppEnv): Promise<import('./BaseSmartLoader').SmartLoadResult<Menu>> {
  return MenuSmartLoader.loadSmart(env);
}