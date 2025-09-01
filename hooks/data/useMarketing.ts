"use client";

import useSWR, { type SWRConfiguration } from 'swr';
import { MarketingSchema, type Marketing } from '@/src/lib/data/schemas';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';

// Standardized hook result interface
export interface UseMarketingResult {
  data: Marketing | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  refetch: () => Promise<void>;
  mutate: (data?: Marketing | Promise<Marketing>, shouldRevalidate?: boolean) => Promise<Marketing | undefined>;
  // Marketing-specific helpers
  activePromotions: any[];
  heroContent: any;
  featuredContent: any[];
}

// Hook options interface
export interface UseMarketingOptions extends SWRConfiguration<Marketing, Error> {
  enabled?: boolean;
  refreshInterval?: number;
  cacheTimeout?: number;
}

// Standardized fetcher
const marketingFetcher = async (url: string): Promise<Marketing> => {
  const response = await fetchWithResilience(url, {
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Marketing fetch failed: ${response.status} ${response.statusText}`);
  }
  
  const json = await response.json();
  
  // Handle both standardized API response and direct data
  const data = json.status === 'success' ? json.data : json;
  
  // Validate with schema
  const result = MarketingSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Marketing validation failed: ${JSON.stringify(result.error.flatten())}`);
  }
  
  return result.data;
};

// Helper to filter active promotions
const getActivePromotions = (marketing: Marketing): any[] => {
  const promotions = (marketing as any).promotions || (marketing as any).promos || [];
  if (!promotions.length) return [];
  
  const now = new Date();
  return promotions.filter((promo: any) => {
    if (!promo.startDate && !promo.endDate) return promo.active !== false;
    
    const startDate = promo.startDate ? new Date(promo.startDate) : null;
    const endDate = promo.endDate ? new Date(promo.endDate) : null;
    
    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    
    return promo.active !== false;
  });
};

/**
 * Hook for fetching and managing marketing data
 * 
 * @param options - Configuration options for the hook
 * @returns Marketing data, loading state, error state, and marketing-specific helpers
 * 
 * @example
 * ```tsx
 * const { data: marketing, isLoading, activePromotions, heroContent } = useMarketing({
 *   enabled: true,
 *   refreshInterval: 300000 // 5 minutes
 * });
 * ```
 */
export function useMarketing(options: UseMarketingOptions = {}): UseMarketingResult {
  const {
    enabled = true,
    refreshInterval = 300000, // 5 minutes default (marketing content changes frequently)
    cacheTimeout = 600000,   // 10 minutes cache
    ...swrOptions
  } = options;

  const { data, error, isLoading, isValidating, mutate } = useSWR<Marketing, Error>(
    enabled ? '/api/marketing' : null,
    marketingFetcher,
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

  // Marketing-specific computed values
  const activePromotions = data ? getActivePromotions(data) : [];
  const heroContent = data?.hero || null;
  const featuredContent = (data as any)?.featured || [];

  return {
    data: data || null,
    error,
    isLoading,
    isValidating,
    refetch,
    mutate,
    activePromotions,
    heroContent,
    featuredContent,
  };
}

// Specialized hook for promotions only
export function usePromotions(): UseMarketingResult & { promotions: any[] } {
  const result = useMarketing();
  
  return {
    ...result,
    promotions: result.activePromotions,
  };
}

// Hook for hero/banner content
export function useHeroContent(): UseMarketingResult & { hero: any } {
  const result = useMarketing();
  
  return {
    ...result,
    hero: result.heroContent,
  };
}

// Hook for featured content
export function useFeaturedContent(): UseMarketingResult & { featured: any[] } {
  const result = useMarketing();
  
  return {
    ...result,
    featured: result.featuredContent,
  };
}
