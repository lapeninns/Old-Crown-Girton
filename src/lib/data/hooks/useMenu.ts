"use client";
import useSWR, { type SWRConfiguration } from 'swr';
import { MenuSchema, type Menu } from '../schemas';
import { fetchWithResilience } from '../fetchWithResilience';
import type { StandardizedApiResponse } from '../api/standardizedResponse';

interface EnhancedMenuHookOptions extends SWRConfiguration<Menu, Error> {
  // Enhanced error handling options
  maxRetries?: number;
  retryDelay?: number;
  enableOfflineSupport?: boolean;
  enableBackgroundRefresh?: boolean;
  
  // Performance options
  enableStaleWhileRevalidate?: boolean;
  cacheTimeout?: number;
  
  // Debugging options
  enableDebugLogs?: boolean;
}

interface UseMenuResult {
  menu: Menu | undefined;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: ReturnType<typeof useSWR>['mutate'];
  
  // Enhanced metadata from standardized API
  meta?: {
    cached: boolean;
    timestamp: string;
    source: 'api' | 'filesystem' | 'cache';
    loadTime?: number;
    requestId?: string;
    version?: string;
  };
  
  // Enhanced status information
  status: {
    isStale: boolean;
    isOffline: boolean;
    lastSuccessfulFetch?: string;
    retryCount: number;
    hasBeenFetched: boolean;
  };
  
  // Helper functions
  refresh: () => Promise<Menu | undefined>;
  invalidate: () => Promise<Menu | undefined>;
}

// Enhanced fetcher with better error handling and retry logic
const createEnhancedFetcher = (options: EnhancedMenuHookOptions = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    enableDebugLogs = false
  } = options;
  
  return async (url: string): Promise<{ data: Menu; meta: any; status: any }> => {
    let lastError: Error;
    let retryCount = 0;
    
    const attemptFetch = async (): Promise<Response> => {
      // Delegate to centralized resilient fetch
      return fetchWithResilience(url, {
        headers: {
          accept: 'application/json',
          'cache-control': options.enableStaleWhileRevalidate ? 'stale-while-revalidate=300' : 'no-cache'
        }
      }, { tries: maxRetries + 1, timeoutMs: 10000, baseBackoffMs: 300 });
    };
    
    // Retry logic with exponential backoff
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (enableDebugLogs && attempt > 0) {
          console.log(`Menu fetch attempt ${attempt + 1}/${maxRetries + 1}`);
        }
        
        const response = await attemptFetch();
        const rawData = await response.json();
        
        // Handle both old format (direct data) and new standardized format
        let menu: Menu;
        let meta: any = {};
        
        if (rawData.status === 'success' && rawData.data) {
          // New standardized format
          menu = MenuSchema.parse(rawData.data);
          meta = rawData.meta || {};
        } else {
          // Legacy format - direct menu data
          menu = MenuSchema.parse(rawData);
          meta = {
            cached: false,
            timestamp: new Date().toISOString(),
            source: 'api',
            version: '1.0.0'
          };
        }
        
        const status = {
          isStale: false,
          isOffline: false,
          lastSuccessfulFetch: new Date().toISOString(),
          retryCount: attempt,
          hasBeenFetched: true
        };
        
        if (enableDebugLogs) {
          console.log(`Menu fetched successfully on attempt ${attempt + 1}:`, {
            itemCount: menu.sections.reduce((total, section) => total + section.items.length, 0),
            cached: meta.cached,
            loadTime: meta.loadTime
          });
        }
        
        return { data: menu, meta, status };
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(`Request failed: ${error}`);
        retryCount = attempt;
        
        if (enableDebugLogs) {
          console.warn(`Menu fetch attempt ${attempt + 1} failed:`, lastError.message);
        }
        
        // Don't retry on the last attempt
        if (attempt < maxRetries) {
          const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // All retries failed
    const finalError = new Error(`Failed to fetch menu after ${maxRetries + 1} attempts: ${lastError!.message}`);
    finalError.cause = lastError!;
    throw finalError;
  };
};

export function useMenu(options: EnhancedMenuHookOptions = {}): UseMenuResult {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    enableOfflineSupport = true,
    enableBackgroundRefresh = true,
    enableStaleWhileRevalidate = true,
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
    enableDebugLogs = process.env.NODE_ENV === 'development',
    ...swrOptions
  } = options;
  
  const fetcher = createEnhancedFetcher({
    maxRetries,
    retryDelay,
    enableDebugLogs
  });
  
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    '/api/menu',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: enableOfflineSupport,
      refreshInterval: enableBackgroundRefresh ? 10 * 60 * 1000 : 0, // 10 minutes
      dedupingInterval: cacheTimeout,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors (client errors)
        if (error.message.includes('HTTP 4')) {
          return false;
        }
        return true;
      },
      errorRetryCount: maxRetries,
      errorRetryInterval: retryDelay,
      keepPreviousData: enableStaleWhileRevalidate,
      ...swrOptions,
    }
  );
  
  // Enhanced helper functions
  const refresh = async (): Promise<Menu | undefined> => {
    if (enableDebugLogs) {
      console.log('Manually refreshing menu data');
    }
    const result = await mutate();
    return result?.data;
  };
  
  const invalidate = async (): Promise<Menu | undefined> => {
    if (enableDebugLogs) {
      console.log('Invalidating menu cache');
    }
    const result = await mutate(undefined, { revalidate: true });
    return result?.data;
  };
  
  // Detect offline status
  const isOffline = typeof navigator !== 'undefined' && 
                   'onLine' in navigator && 
                   !navigator.onLine;
  
  // Enhanced status calculation
  const status = {
    isStale: Boolean(data && !isValidating && Date.now() - new Date(data.meta?.timestamp || 0).getTime() > cacheTimeout),
    isOffline,
    lastSuccessfulFetch: data?.meta?.timestamp,
    retryCount: data?.status?.retryCount || 0,
    hasBeenFetched: Boolean(data || error)
  };
  
  return {
    menu: data?.data,
    error,
    isLoading,
    isValidating,
    mutate,
    meta: data?.meta,
    status,
    refresh,
    invalidate
  };
}
