"use client";

import useSWR, { type SWRConfiguration } from 'swr';
import { MenuSchema, type Menu } from '@/src/lib/data/schemas';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';

// Standardized hook result interface
export interface UseMenuResult {
  data: Menu | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  refetch: () => Promise<void>;
  mutate: (data?: Menu | Promise<Menu>, shouldRevalidate?: boolean) => Promise<Menu | undefined>;
  // Menu-specific helpers
  sections: Menu['sections'];
  findSection: (id: string) => any;
  findItem: (itemId: string) => any;
}

// Hook options interface
export interface UseMenuOptions extends SWRConfiguration<Menu, Error> {
  enabled?: boolean;
  refreshInterval?: number;
  cacheTimeout?: number;
  enableOfflineSupport?: boolean;
}

// Standardized fetcher with enhanced error handling
const menuFetcher = async (url: string): Promise<Menu> => {
  const response = await fetchWithResilience(url, {
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Menu fetch failed: ${response.status} ${response.statusText}`);
  }
  
  const json = await response.json();
  
  // Handle both standardized API response and direct data
  const data = json.status === 'success' ? json.data : json;
  
  // Validate with schema
  const result = MenuSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Menu validation failed: ${JSON.stringify(result.error.flatten())}`);
  }
  
  return result.data;
};

/**
 * Hook for fetching and managing menu data
 * 
 * @param options - Configuration options for the hook
 * @returns Menu data, loading state, error state, and menu-specific helpers
 * 
 * @example
 * ```tsx
 * const { data: menu, isLoading, error, findSection } = useMenu({
 *   enabled: true,
 *   refreshInterval: 600000 // 10 minutes
 * });
 * 
 * const startersSection = findSection('starters');
 * ```
 */
export function useMenu(options: UseMenuOptions = {}): UseMenuResult {
  const {
    enabled = true,
    refreshInterval = 600000, // 10 minutes default (menu changes less frequently)
    cacheTimeout = 1800000,  // 30 minutes cache
    enableOfflineSupport = true,
    ...swrOptions
  } = options;

  const { data, error, isLoading, isValidating, mutate } = useSWR<Menu, Error>(
    enabled ? '/api/menu' : null,
    menuFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: enableOfflineSupport,
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

  // Menu-specific helper functions
  const sections = data?.sections || [];
  
  const findSection = (id: string) => {
    return sections.find(section => 
      section.id === id || 
      section.name?.toLowerCase().includes(id.toLowerCase())
    );
  };

  const findItem = (itemId: string) => {
    for (const section of sections) {
      const item = section.items?.find(item => 
        item.id === itemId || 
        item.name?.toLowerCase().includes(itemId.toLowerCase())
      );
      if (item) return item;
    }
    return null;
  };

  return {
    data: data || null,
    error,
    isLoading,
    isValidating,
    refetch,
    mutate,
    sections,
    findSection,
    findItem,
  };
}

// Specialized hooks for menu sections
export function useMenuSection(sectionId: string): UseMenuResult & { sectionData: any } {
  const result = useMenu();
  
  return {
    ...result,
    sectionData: result.findSection(sectionId),
  };
}

// Hook for featured/highlighted menu items
export function useFeaturedMenuItems(): UseMenuResult & { featuredItems: any[] } {
  const result = useMenu();
  
  const featuredItems = result.sections.flatMap(section => 
    section.items?.filter(item => (item as any).featured || (item as any).highlighted) || []
  );
  
  return {
    ...result,
    featuredItems,
  };
}