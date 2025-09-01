/**
 * Enhanced Smart Hooks for Restaurant_BP
 * 
 * Provides comprehensive data loading hooks with:
 * - Standardized response handling
 * - Advanced error recovery
 * - Offline support
 * - Real-time performance monitoring
 * - Type-safe data loading
 * - Backward compatibility
 */

"use client";
import useSWR, { type SWRConfiguration } from 'swr';
import { 
  MenuSchema, 
  RestaurantSchema, 
  MarketingSchema, 
  ContentSchema,
  type Menu, 
  type Restaurant, 
  type Marketing, 
  type Content 
} from '../schemas';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';

// Common hook configuration
export interface SmartHookOptions<T> extends SWRConfiguration<T, Error> {
  // Enhanced error handling
  maxRetries?: number;
  retryDelay?: number;
  enableOfflineSupport?: boolean;
  
  // Performance options
  enableBackgroundRefresh?: boolean;
  enableStaleWhileRevalidate?: boolean;
  cacheTimeout?: number;
  
  // Monitoring options
  enablePerformanceMonitoring?: boolean;
  enableDebugLogs?: boolean;
  
  // Advanced options
  enablePreemptiveLoading?: boolean;
  enableDataOptimization?: boolean;
}

// Common hook result interface
export interface SmartHookResult<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: ReturnType<typeof useSWR>['mutate'];
  
  // Enhanced metadata
  meta?: {
    cached: boolean;
    timestamp: string;
    source: 'api' | 'filesystem' | 'cache';
    loadTime?: number;
    requestId?: string;
    version?: string;
  };
  
  // Status information
  status: {
    isStale: boolean;
    isOffline: boolean;
    lastSuccessfulFetch?: string;
    retryCount: number;
    hasBeenFetched: boolean;
    healthStatus?: 'healthy' | 'degraded' | 'unhealthy';
  };
  
  // Helper functions
  refresh: () => Promise<T | undefined>;
  invalidate: () => Promise<T | undefined>;
  warmCache: () => Promise<void>;
}

// Generic enhanced fetcher factory
export function createSmartFetcher<T>(
  schema: any,
  resourceName: string,
  options: SmartHookOptions<T> = {}
) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    enableDebugLogs = process.env.NODE_ENV === 'development',
    enablePerformanceMonitoring = true
  } = options;
  
  return async (url: string): Promise<{ data: T; meta: any; status: any }> => {
    const startTime = Date.now();
    let lastError: Error;
    let retryCount = 0;
    
    const attemptFetch = async (): Promise<Response> => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        const response = await fetchWithResilience(url, {
          headers: { 
            accept: 'application/json',
            'x-resource-type': resourceName,
            'x-enable-monitoring': enablePerformanceMonitoring.toString()
          },
          signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
      } catch (error) {
        clearTimeout(timeout);
        throw error;
      }
    };
    
    // Retry logic with exponential backoff
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (enableDebugLogs && attempt > 0) {
          console.log(`${resourceName} fetch attempt ${attempt + 1}/${maxRetries + 1}`);
        }
        
        const response = await attemptFetch();
        const rawData = await response.json();
        
        // Handle both old format and new standardized format
        let data: T;
        let meta: any = {};
        
        if (rawData.status === 'success' && rawData.data !== undefined) {
          // New standardized format
          data = schema.parse(rawData.data);
          meta = rawData.meta || {};
        } else {
          // Legacy format - direct data
          data = schema.parse(rawData);
          meta = {
            cached: false,
            timestamp: new Date().toISOString(),
            source: 'api',
            version: '1.0.0'
          };
        }
        
        const loadTime = Date.now() - startTime;
        const status = {
          isStale: false,
          isOffline: false,
          lastSuccessfulFetch: new Date().toISOString(),
          retryCount: attempt,
          hasBeenFetched: true,
          healthStatus: loadTime < 1000 ? 'healthy' as const : 
                       loadTime < 3000 ? 'degraded' as const : 'unhealthy' as const
        };
        
        // Update meta with actual load time
        meta.loadTime = meta.loadTime || loadTime;
        
        if (enableDebugLogs) {
          console.log(`${resourceName} fetched successfully:`, {
            cached: meta.cached,
            loadTime: meta.loadTime,
            source: meta.source,
            healthStatus: status.healthStatus
          });
        }
        
        return { data, meta, status };
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(`Request failed: ${error}`);
        retryCount = attempt;
        
        if (enableDebugLogs) {
          console.warn(`${resourceName} fetch attempt ${attempt + 1} failed:`, lastError.message);
        }
        
        // Don't retry on the last attempt
        if (attempt < maxRetries) {
          const delay = retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw new Error(`Failed to fetch ${resourceName} after ${maxRetries + 1} attempts: ${lastError!.message}`);
  };
}

// Generic smart hook factory
export function createSmartHook<T>(
  endpoint: string,
  schema: any,
  resourceName: string,
  defaultOptions: Partial<SmartHookOptions<T>> = {}
) {
  return function(options: SmartHookOptions<T> = {}): SmartHookResult<T> {
    const mergedOptions = { ...defaultOptions, ...options };
    const {
      enableOfflineSupport = true,
      enableBackgroundRefresh = true,
      enableStaleWhileRevalidate = true,
      cacheTimeout = 5 * 60 * 1000, // 5 minutes default
      enableDebugLogs = process.env.NODE_ENV === 'development',
      ...swrOptions
    } = mergedOptions;
    
    const fetcher = createSmartFetcher<T>(schema, resourceName, mergedOptions);
    
    const { data, error, isLoading, isValidating, mutate } = useSWR(
      endpoint,
      fetcher,
      {
        revalidateOnFocus: true,
        revalidateOnReconnect: enableOfflineSupport,
        refreshInterval: enableBackgroundRefresh ? 10 * 60 * 1000 : 0, // 10 minutes
        dedupingInterval: cacheTimeout / 2, // Half of cache timeout for deduping
        shouldRetryOnError: (error) => {
          // Don't retry on 4xx errors
          if (error.message.includes('HTTP 4')) {
            return false;
          }
          return true;
        },
        keepPreviousData: enableStaleWhileRevalidate,
        ...swrOptions,
      }
    );
    
    // Helper functions
    const refresh = async (): Promise<T | undefined> => {
      if (enableDebugLogs) {
        console.log(`Manually refreshing ${resourceName} data`);
      }
      const result = await mutate();
      return result?.data;
    };
    
    const invalidate = async (): Promise<T | undefined> => {
      if (enableDebugLogs) {
        console.log(`Invalidating ${resourceName} cache`);
      }
      const result = await mutate(undefined, { revalidate: true });
      return result?.data;
    };
    
    const warmCache = async (): Promise<void> => {
      if (enableDebugLogs) {
        console.log(`Warming cache for ${resourceName}`);
      }
      try {
        await mutate();
      } catch (error) {
        console.warn(`Cache warming failed for ${resourceName}:`, error);
      }
    };
    
    // Detect offline status
    const isOffline = typeof navigator !== 'undefined' && 
                     'onLine' in navigator && 
                     !navigator.onLine;
    
    // Enhanced status
    const status = {
      isStale: Boolean(data && !isValidating && Date.now() - new Date(data.meta?.timestamp || 0).getTime() > cacheTimeout),
      isOffline,
      lastSuccessfulFetch: data?.meta?.timestamp,
      retryCount: data?.status?.retryCount || 0,
      hasBeenFetched: Boolean(data || error),
      healthStatus: data?.status?.healthStatus
    };
    
    return {
      data: data?.data,
      error,
      isLoading,
      isValidating,
      mutate,
      meta: data?.meta,
      status,
      refresh,
      invalidate,
      warmCache
    };
  };
}

// Specific smart hooks with optimized defaults

/**
 * Enhanced Menu Hook with smart loading capabilities
 */
export const useMenuSmart = createSmartHook<Menu>(
  '/api/menu',
  MenuSchema,
  'menu',
  {
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    enableBackgroundRefresh: true,
    maxRetries: 3
  }
);

/**
 * Enhanced Restaurant Hook with extended caching
 */
export const useRestaurantSmart = createSmartHook<Restaurant>(
  '/api/restaurant',
  RestaurantSchema,
  'restaurant',
  {
    cacheTimeout: 15 * 60 * 1000, // 15 minutes (changes less frequently)
    enableBackgroundRefresh: false,
    maxRetries: 2
  }
);

/**
 * Enhanced Marketing Hook with frequent updates
 */
export const useMarketingSmart = createSmartHook<Marketing>(
  '/api/marketing',
  MarketingSchema,
  'marketing',
  {
    cacheTimeout: 3 * 60 * 1000, // 3 minutes (may change frequently for promotions)
    enableBackgroundRefresh: true,
    maxRetries: 3
  }
);

/**
 * Enhanced Content Hook with extended caching
 */
export const useContentSmart = createSmartHook<Content>(
  '/api/content',
  ContentSchema,
  'content',
  {
    cacheTimeout: 30 * 60 * 1000, // 30 minutes (static content)
    enableBackgroundRefresh: false,
    maxRetries: 2
  }
);

/**
 * Enhanced Parsed Data Hook - Generic version with Zod validation
 */
export function useParsedDataSmart<T>(
  endpoint: string,
  schema: any,
  resourceName: string,
  options: SmartHookOptions<T> = {}
): SmartHookResult<T> {
  const smartHook = createSmartHook<T>(endpoint, schema, resourceName, options);
  return smartHook(options);
}

// Combined hooks for multiple resources
export function useAllRestaurantData(options: SmartHookOptions<any> = {}) {
  const menu = useMenuSmart(options);
  const restaurant = useRestaurantSmart(options);
  const marketing = useMarketingSmart(options);
  const content = useContentSmart(options);
  
  const isLoading = menu.isLoading || restaurant.isLoading || marketing.isLoading || content.isLoading;
  const hasError = !!(menu.error || restaurant.error || marketing.error || content.error);
  const isStale = menu.status.isStale || restaurant.status.isStale || marketing.status.isStale || content.status.isStale;
  
  return {
    menu,
    restaurant,
    marketing,
    content,
    loading: isLoading,
    error: hasError,
    stale: isStale,
    refresh: async () => {
      await Promise.all([
        menu.refresh(),
        restaurant.refresh(),
        marketing.refresh(),
        content.refresh()
      ]);
    },
    warmAll: async () => {
      await Promise.all([
        menu.warmCache(),
        restaurant.warmCache(),
        marketing.warmCache(),
        content.warmCache()
      ]);
    }
  };
}

// Health monitoring hook
export function useSystemHealth() {
    return useSWR('/api/health', async (url) => {
    const response = await fetchWithResilience(url);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  }, {
    refreshInterval: 30000, // Check every 30 seconds
    revalidateOnFocus: false,
    dedupingInterval: 15000
  });
}