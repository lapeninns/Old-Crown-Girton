/**
 * Enhanced Smart Loaders - Barrel Export
 * 
 * Centralized export of all smart loaders for Restaurant_BP data architecture.
 * Provides both new enhanced interfaces and backward compatibility.
 */

// Base Smart Loader
export { BaseSmartLoader, type SmartLoadResult, type SmartLoadConfig, type LoaderMetrics } from './BaseSmartLoader';

// Specific Smart Loaders - Instances
import { MenuSmartLoader } from './MenuSmartLoader';
import { RestaurantSmartLoader } from './RestaurantSmartLoader';
import { MarketingSmartLoader } from './MarketingSmartLoader';
import { ContentSmartLoader } from './ContentSmartLoader';

// Re-export the loader instances
export { MenuSmartLoader, RestaurantSmartLoader, MarketingSmartLoader, ContentSmartLoader };

// Backward Compatibility Functions - Menu
export { 
  getMenuData, 
  getMenuSmart, 
  getMenuSmartWithResult 
} from './MenuSmartLoader';

// Backward Compatibility Functions - Restaurant
export { 
  getRestaurantInfo, 
  getRestaurantSmart, 
  getRestaurantSmartWithResult 
} from './RestaurantSmartLoader';

// Backward Compatibility Functions - Marketing
export { 
  getMarketingContent, 
  getMarketingSmart, 
  getMarketingSmartWithResult 
} from './MarketingSmartLoader';

// Backward Compatibility Functions - Content
export { 
  getContentData, 
  getContentSmart, 
  getContentSmartWithResult,
  getContentDataOptimized 
} from './ContentSmartLoader';

// Enhanced Smart Loader Collection
export const SmartLoaders = {
  menu: MenuSmartLoader,
  restaurant: RestaurantSmartLoader,
  marketing: MarketingSmartLoader,
  content: ContentSmartLoader
} as const;

// Type definitions for enhanced results
export type MenuResult = import('./BaseSmartLoader').SmartLoadResult<import('../schemas').Menu>;
export type RestaurantResult = import('./BaseSmartLoader').SmartLoadResult<import('../schemas').Restaurant>;
export type MarketingResult = import('./BaseSmartLoader').SmartLoadResult<import('../schemas').Marketing>;
export type ContentResult = import('./BaseSmartLoader').SmartLoadResult<import('../schemas').Content>;

// Combined health check function
export async function getAllHealthStatus(env: import('../env').AppEnv) {
  const [menuHealth, restaurantHealth, marketingHealth, contentHealth] = await Promise.allSettled([
    MenuSmartLoader.getHealthStatus(env),
    RestaurantSmartLoader.getHealthStatus(env),
    MarketingSmartLoader.getHealthStatus(env),
    ContentSmartLoader.getHealthStatus(env)
  ]);

  return {
    overall: determineOverallHealth([menuHealth, restaurantHealth, marketingHealth, contentHealth]),
    menu: menuHealth.status === 'fulfilled' ? menuHealth.value : { status: 'unhealthy' as const, details: {} as any },
    restaurant: restaurantHealth.status === 'fulfilled' ? restaurantHealth.value : { status: 'unhealthy' as const, details: {} as any },
    marketing: marketingHealth.status === 'fulfilled' ? marketingHealth.value : { status: 'unhealthy' as const, details: {} as any },
    content: contentHealth.status === 'fulfilled' ? contentHealth.value : { status: 'unhealthy' as const, details: {} as any }
  };
}

function determineOverallHealth(results: PromiseSettledResult<any>[]): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = results
    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
    .map(result => result.value.status);

  if (statuses.every(status => status === 'healthy')) return 'healthy';
  if (statuses.some(status => status === 'healthy' || status === 'degraded')) return 'degraded';
  return 'unhealthy';
}

// Combined metrics function
export async function getAllMetrics() {
  return {
    menu: MenuSmartLoader.getMetrics(),
    restaurant: RestaurantSmartLoader.getMetrics(),
    marketing: MarketingSmartLoader.getMetrics(),
    content: ContentSmartLoader.getMetrics()
  };
}

// Cache warming function
export async function warmAllCaches(env: import('../env').AppEnv): Promise<void> {
  console.log(`Starting cache warming for environment: ${env}`);
  
  const warmupPromises = [
    MenuSmartLoader.preload(env),
    RestaurantSmartLoader.preload(env),
    MarketingSmartLoader.preload(env),
    ContentSmartLoader.preload(env)
  ];

  await Promise.allSettled(warmupPromises);
  console.log(`Cache warming completed for environment: ${env}`);
}