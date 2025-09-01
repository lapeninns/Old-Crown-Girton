"use client";

import useSWR, { type SWRConfiguration } from 'swr';
import { RestaurantSchema, type Restaurant } from '@/src/lib/data/schemas';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';

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
  const response = await fetchWithResilience(url, {
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
    },
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
  
  // Handle new detailed format with kitchen and bar hours
  if (typeof hours === 'object' && ('kitchen' in hours || 'bar' in hours)) {
    const kitchenHours = hours.kitchen?.[currentDay];
    const barHours = hours.bar?.[currentDay];
    
    return isTimeRangeOpen(kitchenHours, currentTime) || isTimeRangeOpen(barHours, currentTime);
  }
  
  // Handle legacy format
  const todayHours = hours[currentDay];
  if (!todayHours || todayHours.toLowerCase() === 'closed') return false;
  
  return isTimeRangeOpen(todayHours, currentTime);
};

// Helper function to check if a time range is currently open
const isTimeRangeOpen = (hoursString: string | undefined, currentTime: number): boolean => {
  if (!hoursString || hoursString.toLowerCase() === 'closed') return false;
  
  // Handle both 12-hour ("11:30 AM - 10:00 PM") and 24-hour ("12:00-15:00,17:00-22:00") formats
  if (hoursString.includes('AM') || hoursString.includes('PM')) {
    // 12-hour format
    const timeRange = hoursString.split(' - ');
    if (timeRange.length !== 2) return false;
    
    const parseTime12Hour = (timeStr: string): number => {
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
    
    const openTime = parseTime12Hour(timeRange[0]);
    const closeTime = parseTime12Hour(timeRange[1]);
    
    return currentTime >= openTime && currentTime <= closeTime;
  } else {
    // 24-hour format with possible multiple ranges
    const timeRanges = hoursString.split(',').map(range => range.trim());
    
    for (const range of timeRanges) {
      const match = range.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
      if (match) {
        const [, startHour, startMin, endHour, endMin] = match;
        const startMinutes = parseInt(startHour) * 60 + parseInt(startMin);
        let endMinutes = parseInt(endHour) * 60 + parseInt(endMin);
        
        // Handle overnight hours (e.g., 23:00-01:00)
        if (endMinutes <= startMinutes) {
          endMinutes += 24 * 60;
        }
        
        if (currentTime >= startMinutes && currentTime <= endMinutes) {
          return true;
        }
      }
    }
    
    return false;
  }
};

// Helper to get current day's hours
const getCurrentHours = (hours: any): string | null => {
  if (!hours) return null;
  
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Handle new detailed format with kitchen and bar hours
  if (typeof hours === 'object' && ('kitchen' in hours || 'bar' in hours)) {
    const kitchenHours = hours.kitchen?.[currentDay];
    const barHours = hours.bar?.[currentDay];
    
    if (kitchenHours && barHours) {
      return `Kitchen: ${formatHoursDisplay(kitchenHours)} | Bar: ${formatHoursDisplay(barHours)}`;
    } else if (kitchenHours) {
      return `Kitchen: ${formatHoursDisplay(kitchenHours)}`;
    } else if (barHours) {
      return `Bar: ${formatHoursDisplay(barHours)}`;
    }
    
    return 'Closed';
  }
  
  // Handle legacy format
  return hours[currentDay] || null;
};

// Helper to format hours for display
const formatHoursDisplay = (timeRange: string): string => {
  if (!timeRange || timeRange.toLowerCase() === 'closed') return 'Closed';
  
  // Handle multiple ranges separated by comma
  const ranges = timeRange.split(',').map(range => {
    return range.trim()
      .replace(/(\d{2}):(\d{2})/g, (match, hours, minutes) => {
        const h = parseInt(hours);
        const m = minutes === '00' ? '' : `:${minutes}`;
        if (h === 0) return `12${m} AM`;
        if (h < 12) return `${h}${m} AM`;
        if (h === 12) return `${h}${m} PM`;
        return `${h - 12}${m} PM`;
      })
      .replace('-', ' – ');
  });
  
  return ranges.join(', ');
};

// Helper to get next opening time when closed
const getNextOpenTime = (hours: any): string | null => {
  if (!hours) return null;
  
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // Check next 7 days
  for (let i = 0; i < 7; i++) {
    const dayIndex = (currentDay + i) % 7;
    const dayName = days[dayIndex];
    
    let dayHours: string | undefined;
    
    // Handle new detailed format with kitchen and bar hours
    if (typeof hours === 'object' && ('kitchen' in hours || 'bar' in hours)) {
      dayHours = hours.kitchen?.[dayName] || hours.bar?.[dayName];
    } else {
      dayHours = hours[dayName];
    }
    
    if (dayHours && dayHours.toLowerCase() !== 'closed') {
      if (i === 0) {
        // Today - check if we haven't passed opening time yet
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const openingTime = getOpeningTime(dayHours);
        if (openingTime && currentMinutes < openingTime) {
          const openHour = Math.floor(openingTime / 60);
          const openMin = openingTime % 60;
          const displayTime = formatTime(openHour, openMin);
          return `Today at ${displayTime}`;
        }
      } else {
        // Future day
        const openingTime = getOpeningTime(dayHours);
        if (openingTime) {
          const openHour = Math.floor(openingTime / 60);
          const openMin = openingTime % 60;
          const displayTime = formatTime(openHour, openMin);
          const dayLabel = i === 1 ? 'Tomorrow' : dayName.charAt(0).toUpperCase() + dayName.slice(1);
          return `${dayLabel} at ${displayTime}`;
        }
      }
    }
  }
  
  return null;
};

// Helper to get opening time in minutes from time string
const getOpeningTime = (timeRange: string): number | null => {
  if (!timeRange || timeRange.toLowerCase() === 'closed') return null;
  
  // Handle 24-hour format
  const match = timeRange.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    const [, hours, minutes] = match;
    return parseInt(hours) * 60 + parseInt(minutes);
  }
  
  return null;
};

// Helper to format time for display
const formatTime = (hours: number, minutes: number): string => {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
  return `${displayHours}${displayMinutes} ${period}`;
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
  
  // Calculate next opening time when closed
  const nextOpenTime: string | null = data && !isOpen ? getNextOpenTime(data.hours) : null;

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
