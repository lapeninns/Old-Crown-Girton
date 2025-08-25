"use client";

import useSWR, { type SWRConfiguration } from 'swr';
import { RestaurantSchema, type Restaurant } from '@/src/lib/data/schemas';

// Standardized hook result interface
export interface UseRestaurantResult {
  data: Restaurant | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  refetch: () => Promise<void>;
  mutate: (data?: Restaurant | Promise<Restaurant>, shouldRevalidate?: boolean) => Promise<Restaurant | undefined>;
  // Restaurant-specific helpers
  isOpen: boolean;
  currentHours: string | null;
  nextOpenTime: string | null;
}

// Hook options interface
export interface UseRestaurantOptions extends SWRConfiguration<Restaurant, Error> {
  enabled?: boolean;
  refreshInterval?: number;
  cacheTimeout?: number;
}

// Standardized fetcher
const restaurantFetcher = async (url: string): Promise<Restaurant> => {
  const response = await fetch(url, { 
    headers: { 
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    } 
  });
  
  if (!response.ok) {
    throw new Error(`Restaurant fetch failed: ${response.status} ${response.statusText}`);
  }
  
  const json = await response.json();
  
  // Handle both standardized API response and direct data
  const data = json.status === 'success' ? json.data : json;
  
  // Validate with schema
  const result = RestaurantSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Restaurant validation failed: ${JSON.stringify(result.error.flatten())}`);
  }
  
  return result.data;
};

// Helper function to check if restaurant is currently open
const checkIsOpen = (hours: any): boolean => {
  if (!hours) return false;
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
  
  const todayHours = hours[currentDay];
  if (!todayHours || todayHours.toLowerCase() === 'closed') return false;
  
  // Parse hours like "11:30 AM - 10:00 PM"
  const timeRange = todayHours.split(' - ');
  if (timeRange.length !== 2) return false;
  
  const parseTime = (timeStr: string): number => {
    const [time, period] = timeStr.trim().split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = hours * 60 + (minutes || 0);
    
    if (period?.toUpperCase() === 'PM' && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (period?.toUpperCase() === 'AM' && hours === 12) {
      totalMinutes = minutes || 0;
    }
    
    return totalMinutes;
  };
  
  const openTime = parseTime(timeRange[0]);
  const closeTime = parseTime(timeRange[1]);
  
  return currentTime >= openTime && currentTime <= closeTime;
};

// Helper to get current day's hours
const getCurrentHours = (hours: any): string | null => {
  if (!hours) return null;
  
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  return hours[currentDay] || null;
};

/**
 * Hook for fetching and managing restaurant data
 * 
 * @param options - Configuration options for the hook
 * @returns Restaurant data, loading state, error state, and restaurant-specific helpers
 * 
 * @example
 * ```tsx
 * const { data: restaurant, isLoading, isOpen, currentHours } = useRestaurant({
 *   enabled: true,
 *   refreshInterval: 1800000 // 30 minutes
 * });
 * ```
 */
export function useRestaurant(options: UseRestaurantOptions = {}): UseRestaurantResult {
  const {
    enabled = true,
    refreshInterval = 1800000, // 30 minutes default (restaurant info changes rarely)
    cacheTimeout = 3600000,   // 1 hour cache
    ...swrOptions
  } = options;

  const { data, error, isLoading, isValidating, mutate } = useSWR<Restaurant, Error>(
    enabled ? '/api/restaurant' : null,
    restaurantFetcher,
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

  // Restaurant-specific computed values
  const isOpen = data ? checkIsOpen(data.hours) : false;
  const currentHours = data ? getCurrentHours(data.hours) : null;
  
  // TODO: Implement nextOpenTime logic
  const nextOpenTime: string | null = null;

  return {
    data: data || null,
    error,
    isLoading,
    isValidating,
    refetch,
    mutate,
    isOpen,
    currentHours,
    nextOpenTime,
  };
}

// Specialized hook for contact information
export function useRestaurantContact(): UseRestaurantResult & { contactInfo: any } {
  const result = useRestaurant();
  
  const contactInfo = result.data ? {
    phone: result.data.phone,
    email: result.data.email,
    address: result.data.address,
  } : null;
  
  return {
    ...result,
    contactInfo,
  };
}

// Hook for operating hours
export function useRestaurantHours(): UseRestaurantResult & { hoursInfo: any } {
  const result = useRestaurant();
  
  const hoursInfo = result.data ? {
    hours: result.data.hours,
    isOpen: result.isOpen,
    currentHours: result.currentHours,
    nextOpenTime: result.nextOpenTime,
  } : null;
  
  return {
    ...result,
    hoursInfo,
  };
}