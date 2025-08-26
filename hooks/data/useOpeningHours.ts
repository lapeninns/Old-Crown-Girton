'use client';

import { useMemo } from 'react';
import { useRestaurant } from './useRestaurant';

/**
 * Opening Hours Types
 */
export interface DayHours {
  day: string;
  hours: string;
  isToday: boolean;
  isOpen?: boolean;
}

export interface ProcessedHours {
  kitchen: DayHours[];
  bar: DayHours[];
  summary: {
    kitchenSummary: string;
    barSummary: string;
  };
  currentStatus: {
    isOpen: boolean;
    currentService: 'kitchen' | 'bar' | 'closed';
    nextChange: string | null;
  };
}

/**
 * Modern Opening Hours Hook
 * 
 * Fetches restaurant hours from the centralized API and provides
 * structured, processed data for display components.
 * 
 * Features:
 * - Centralized data source via restaurant API
 * - Real-time open/closed status
 * - Formatted hours for display
 * - Kitchen vs Bar hours separation
 * - Current day highlighting
 */
export function useOpeningHours() {
  const { data: restaurant, isLoading, error, isOpen } = useRestaurant();

  const processedHours = useMemo((): ProcessedHours | null => {
    if (!restaurant?.hours) return null;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Process raw hours data into structured format
    const processHours = (hoursData: Record<string, string>) => {
      const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const dayLabels = {
        monday: 'Monday',
        tuesday: 'Tuesday', 
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
      };

      return daysOrder.map(day => {
        const hours = hoursData[day] || hoursData[dayLabels[day as keyof typeof dayLabels]] || 'Closed';
        return {
          day: dayLabels[day as keyof typeof dayLabels],
          hours: formatTimeRange(hours),
          isToday: day === today
        };
      });
    };

    // Handle different hour formats from the API
    let kitchenHours: DayHours[] = [];
    let barHours: DayHours[] = [];

    if (typeof restaurant.hours === 'object') {
      // Handle the simple format from restaurant.json
      if (restaurant.hours['Mon-Thu']) {
        // Format: {"Mon-Thu": "12:00-23:00", "Fri-Sat": "12:00-00:00", "Sun": "12:00-22:30"}
        kitchenHours = expandCompactHours(restaurant.hours, 'kitchen');
        // For now, assume bar hours are the same as kitchen + 1 hour
        barHours = kitchenHours.map(day => ({
          ...day,
          hours: extendHours(day.hours, 1)
        }));
      } else if (restaurant.hours.kitchen || restaurant.hours.monday) {
        // Handle detailed format
        const kitchenData = restaurant.hours.kitchen || restaurant.hours;
        if (typeof kitchenData === 'object' && kitchenData !== null) {
          kitchenHours = processHours(kitchenData);
        }
        
        const barData = restaurant.hours.bar || kitchenData;
        if (typeof barData === 'object' && barData !== null) {
          barHours = processHours(barData);
        }
      }
    }

    // Generate summaries
    const kitchenSummary = generateSummary(kitchenHours);
    const barSummary = generateSummary(barHours);

    // Current status
    const currentStatus = {
      isOpen: isOpen || false,
      currentService: getCurrentService(kitchenHours, barHours) as 'kitchen' | 'bar' | 'closed',
      nextChange: getNextChange(kitchenHours, barHours)
    };

    return {
      kitchen: kitchenHours,
      bar: barHours,
      summary: {
        kitchenSummary,
        barSummary
      },
      currentStatus
    };
  }, [restaurant?.hours, isOpen]);

  return {
    hours: processedHours,
    isLoading,
    error,
    restaurant
  };
}

/**
 * Helper Functions
 */

function formatTimeRange(timeRange: string): string {
  if (timeRange === 'Closed' || !timeRange) return 'Closed';
  
  // Handle formats like "12:00-23:00" or "12:00 - 23:00"
  return timeRange
    .replace(/(\d{2}):(\d{2})/g, (match, hours, minutes) => {
      const h = parseInt(hours);
      const m = minutes === '00' ? '' : `:${minutes}`;
      return `${h}${m}`;
    })
    .replace('-', ' - ')
    .replace(/\s+/g, ' ')
    .trim();
}

function expandCompactHours(compactHours: Record<string, string>, service: 'kitchen' | 'bar'): DayHours[] {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const result: DayHours[] = [];
  
  const dayMap = {
    'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday',
    'Fri': 'Friday', 'Sat': 'Saturday', 'Sun': 'Sunday'
  };

  // Expand ranges like "Mon-Thu" to individual days
  Object.entries(compactHours).forEach(([range, hours]) => {
    if (range.includes('-')) {
      const [start, end] = range.split('-');
      const days = getDayRange(start, end);
      days.forEach(day => {
        result.push({
          day,
          hours: formatTimeRange(hours),
          isToday: day.toLowerCase() === today
        });
      });
    } else {
      const day = dayMap[range as keyof typeof dayMap] || range;
      result.push({
        day,
        hours: formatTimeRange(hours),
        isToday: day.toLowerCase() === today
      });
    }
  });

  // Ensure all days are present
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return allDays.map(day => {
    const existing = result.find(r => r.day === day);
    return existing || {
      day,
      hours: 'Closed',
      isToday: day.toLowerCase() === today
    };
  });
}

function getDayRange(start: string, end: string): string[] {
  const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const startIndex = dayOrder.indexOf(start);
  const endIndex = dayOrder.indexOf(end);
  
  if (startIndex === -1 || endIndex === -1) return [];
  
  const result = [];
  for (let i = startIndex; i <= endIndex; i++) {
    result.push(dayNames[i]);
  }
  return result;
}

function extendHours(hours: string, extraHours: number): string {
  if (hours === 'Closed') return 'Closed';
  
  // Simple extension for bar hours (this can be made more sophisticated)
  return hours.replace(/(\d+)$/, (match) => {
    const endHour = parseInt(match);
    const newEndHour = (endHour + extraHours) % 24;
    return newEndHour === 0 ? '00:00' : newEndHour.toString();
  });
}

function generateSummary(hours: DayHours[]): string {
  // Find the most common hours pattern
  const hoursMap = new Map<string, number>();
  hours.forEach(day => {
    const count = hoursMap.get(day.hours) || 0;
    hoursMap.set(day.hours, count + 1);
  });
  
  const mostCommon = Array.from(hoursMap.entries())
    .sort((a, b) => b[1] - a[1])[0];
  
  return mostCommon ? `Daily ${mostCommon[0]}` : 'Hours vary';
}

function getCurrentService(kitchenHours: DayHours[], barHours: DayHours[]): string {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const today = now.toLocaleDateString('en-US', { weekday: 'long' });
  
  const todayKitchen = kitchenHours.find(h => h.day === today);
  const todayBar = barHours.find(h => h.day === today);
  
  // This is a simplified check - could be enhanced with actual time parsing
  if (currentTime >= 12 * 60 && currentTime <= 22 * 60) {
    return 'kitchen';
  } else if (currentTime >= 12 * 60 && currentTime <= 23 * 60) {
    return 'bar';
  }
  
  return 'closed';
}

function getNextChange(kitchenHours: DayHours[], barHours: DayHours[]): string | null {
  // Simplified - could be enhanced with actual next opening/closing time
  return null;
}