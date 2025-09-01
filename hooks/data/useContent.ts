"use client";

import useSWR, { type SWRConfiguration } from 'swr';
import { ContentSchema, type Content } from '@/src/lib/data/schemas';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';
import { useModularContent } from './useModularContent';

// Feature flag to enable modular content system
const USE_MODULAR_CONTENT = process.env.NEXT_PUBLIC_USE_MODULAR_CONTENT === 'true';

// Standardized hook result interface
export interface UseContentResult {
  data: Content | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  refetch: () => Promise<void>;
  mutate: (data?: Content | Promise<Content>, shouldRevalidate?: boolean) => Promise<Content | undefined>;
}

// Hook options interface
export interface UseContentOptions extends SWRConfiguration<Content, Error> {
  enabled?: boolean;
  refreshInterval?: number;
  cacheTimeout?: number;
}

// Standardized fetcher
const contentFetcher = async (url: string): Promise<Content> => {
  const response = await fetchWithResilience(url, {
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Content fetch failed: ${response.status} ${response.statusText}`);
  }
  
  const json = await response.json();
  
  // Handle both standardized API response and direct data
  const data = json.status === 'success' ? json.data : json;
  
  // Validate with schema
  const result = ContentSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Content validation failed: ${JSON.stringify(result.error.flatten())}`);
  }
  
  return result.data;
};

/**
 * Hook for fetching and managing content data from the CMS
 * 
 * @param options - Configuration options for the hook
 * @returns Content data, loading state, error state, and refetch function
 * 
 * @example
 * ```tsx
 * const { data: content, isLoading, error, refetch } = useContent({
 *   enabled: true,
 *   refreshInterval: 300000 // 5 minutes
 * });
 * ```
 */
export function useContent(options: UseContentOptions = {}): UseContentResult {
  // Use modular content system if enabled
  if (USE_MODULAR_CONTENT) {
    const modularResult = useModularContent({
      modules: ['core', 'pages', 'components'],
      environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
      enablePerformanceTracking: true,
      ...options
    });
    
    // Transform modular result to match legacy interface
    return {
      data: modularResult.data as Content | null,
      error: modularResult.error,
      isLoading: modularResult.isLoading,
      isValidating: modularResult.isValidating,
      refetch: modularResult.refetch,
      mutate: async () => {
        await modularResult.refetch();
        return modularResult.data as Content;
      },
    };
  }
  
  // Legacy implementation
  const {
    enabled = true,
    refreshInterval = 300000, // 5 minutes default
    cacheTimeout = 600000,   // 10 minutes cache
    ...swrOptions
  } = options;

  const { data, error, isLoading, isValidating, mutate } = useSWR<Content, Error>(
    enabled ? '/api/content' : null,
    contentFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval,
      dedupingInterval: cacheTimeout / 2,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors (client errors)
        if (error.message.includes('4')) {
          return false;
        }
        return true;
      },
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      keepPreviousData: true,
      ...swrOptions,
    }
  );

  const refetch = async (): Promise<void> => {
    await mutate();
  };

  return {
    data: data || null,
    error,
    isLoading,
    isValidating,
    refetch,
    mutate,
  };
}

// Specialized hooks for specific content sections
export function usePageContent(pageName: keyof Content['pages']): UseContentResult & { pageData: any } {
  const result = useContent();
  
  return {
    ...result,
    pageData: result.data?.pages?.[pageName] || null,
  };
}

export function useGlobalContent(): UseContentResult & { globalData: any } {
  const result = useContent();
  
  return {
    ...result,
    globalData: result.data?.global || null,
  };
}

export function useComponentContent(componentName: keyof Content['components']): UseContentResult & { componentData: any } {
  const result = useContent();
  
  return {
    ...result,
    componentData: result.data?.components?.[componentName] || null,
  };
}

// Utility hook for getting content with fallbacks
export function useContentWithFallback<T>(
  path: string, 
  fallback: T
): UseContentResult & { contentValue: T } {
  const result = useContent();
  
  // Navigate to nested content using dot notation
  const getValue = (obj: any, path: string): T => {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? fallback;
  };
  
  const contentValue = result.data ? getValue(result.data, path) : fallback;
  
  return {
    ...result,
    contentValue,
  };
}