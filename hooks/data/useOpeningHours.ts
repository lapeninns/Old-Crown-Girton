'use client';

import { useMemo } from 'react';
import { useRestaurant } from './useRestaurant';

/**
 * Opening Hours Types
 */
export interface DayHours {
  day: string;
  hours: string;
  rawHours?: string; // Keep raw 24-hour format for calculations
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
 * - Real-time open/closed status with proper logic
 * - Formatted hours for display (all 7 days)
 * - Kitchen vs Bar hours separation
 * - Current day highlighting
 * - Support for multiple time ranges per day
 */
export function useOpeningHours() {
  const { data: restaurant, isLoading, error } = useRestaurant();

  const processedHours = useMemo((): ProcessedHours | null => {
    // More robust checking
    if (!restaurant || !restaurant.hours) {
      return null;
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Handle different hour formats from the API
    let kitchenHours: DayHours[] = [];
    let barHours: DayHours[] = [];

    try {
      if (typeof restaurant.hours === 'object') {
        // Type guard to determine the hours format
        const hasKitchenBar = 'kitchen' in restaurant.hours && 'bar' in restaurant.hours;
        const hasLegacyFormat = 'Mon-Thu' in restaurant.hours || 'Mon' in restaurant.hours;
        
        if (hasKitchenBar) {
          // Handle the detailed format with separate kitchen and bar hours
          const kitchenData = typeof restaurant.hours.kitchen === 'object' ? restaurant.hours.kitchen : {};
          const barData = typeof restaurant.hours.bar === 'object' ? restaurant.hours.bar : {};
          kitchenHours = processDetailedHours(kitchenData, today);
          barHours = processDetailedHours(barData, today);
        } else if (hasLegacyFormat) {
          // Handle legacy compact format
          kitchenHours = expandCompactHours(restaurant.hours as Record<string, string>, today);
          barHours = kitchenHours.map(day => ({
            ...day,
            hours: extendHours(day.hours, 1)
          }));
        } else {
          // Handle simple daily format
          kitchenHours = processDetailedHours(restaurant.hours as Record<string, string>, today);
          barHours = processDetailedHours(restaurant.hours as Record<string, string>, today);
        }
      }

      // Add current open status to each day
      kitchenHours = kitchenHours.map(day => ({
        ...day,
        isOpen: day.isToday ? isCurrentlyOpen(day.rawHours || day.hours) : false
      }));
      
      barHours = barHours.map(day => ({
        ...day,
        isOpen: day.isToday ? isCurrentlyOpen(day.rawHours || day.hours) : false
      }));

      // Generate summaries
      const kitchenSummary = generateSummary(kitchenHours);
      const barSummary = generateSummary(barHours);

      // Determine current status
      const currentStatus = {
        isOpen: getCurrentOpenStatus(kitchenHours, barHours),
        currentService: getCurrentService(kitchenHours, barHours),
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
    } catch (error) {
      console.error('useOpeningHours: Error processing hours:', error);
      return null;
    }
  }, [restaurant?.hours]);

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

/**
 * Process detailed hours data into structured format
 */
function processDetailedHours(hoursData: Record<string, string>, today: string): DayHours[] {
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
    const rawHours = hoursData[day] || hoursData[dayLabels[day as keyof typeof dayLabels]] || 'Closed';
    return {
      day: dayLabels[day as keyof typeof dayLabels],
      hours: formatTimeRange(rawHours),
      rawHours: rawHours, // Keep raw format for open status checking
      isToday: day === today
    };
  });
}

/**
 * Check if currently open based on time ranges
 */
function isCurrentlyOpen(hoursString: string): boolean {
  if (hoursString === 'Closed' || !hoursString) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Handle multiple time ranges (e.g., "12:00-15:00,17:00-22:00")
  const timeRanges = hoursString.split(',').map(range => range.trim());
  
  for (const range of timeRanges) {
    // Match both 24-hour format and formatted time
    const match = range.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/) ||
                  range.match(/(\d{1,2})\s*([AP]M)?\s*[–-]\s*(\d{1,2})\s*([AP]M)?/);
    if (match) {
      let [, startHour, startMin, endHour, endMin] = match;
      
      // Handle raw 24-hour format
      if (startMin && endMin) {
        const startMinutes = parseInt(startHour) * 60 + parseInt(startMin);
        let endMinutes = parseInt(endHour) * 60 + parseInt(endMin);
        
        // Handle overnight hours (e.g., 23:00-01:00)
        if (endMinutes <= startMinutes) {
          endMinutes += 24 * 60;
          // For overnight hours, check if current time is after start OR before end
          if ((currentMinutes >= startMinutes) || (currentMinutes <= endMinutes - 24 * 60)) {
            return true;
          }
        } else {
          // Normal hours
          if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
            return true;
          }
        }
      }
    }
  }
  
  return false;
}

/**
 * Get current overall open status
 */
function getCurrentOpenStatus(kitchenHours: DayHours[], barHours: DayHours[]): boolean {
  const todayKitchen = kitchenHours.find(h => h.isToday);
  const todayBar = barHours.find(h => h.isToday);
  
  return (todayKitchen?.isOpen || false) || (todayBar?.isOpen || false);
}

/**
 * Format time range for display
 */
function formatTimeRange(timeRange: string): string {
  if (timeRange === 'Closed' || !timeRange) return 'Closed';
  
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
}

/**
 * Expand compact hours format like "Mon-Thu": "12:00-23:00"
 */
function expandCompactHours(compactHours: Record<string, string>, today: string): DayHours[] {
  const result: DayHours[] = [];
  
  const dayMap = {
    'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday',
    'Fri': 'Friday', 'Sat': 'Saturday', 'Sun': 'Sunday'
  };

  Object.entries(compactHours).forEach(([range, rawHours]) => {
    if (range.includes('-')) {
      const [start, end] = range.split('-');
      const days = getDayRange(start, end);
      days.forEach(day => {
        result.push({
          day,
          hours: formatTimeRange(rawHours),
          rawHours: rawHours,
          isToday: day.toLowerCase() === today
        });
      });
    } else {
      const day = dayMap[range as keyof typeof dayMap] || range;
      result.push({
        day,
        hours: formatTimeRange(rawHours),
        rawHours: rawHours,
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
      rawHours: 'Closed',
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
  
  // Simple extension for bar hours
  return hours.replace(/(\d+)\s*(PM|AM)$/, (match, hour, period) => {
    const h = parseInt(hour);
    const newHour = (h + extraHours) % 12 || 12;
    return `${newHour} ${period}`;
  });
}

function generateSummary(hours: DayHours[]): string {
  const openDays = hours.filter(day => day.hours !== 'Closed');
  if (openDays.length === 0) return 'Closed all week';
  
  // Find today's hours first
  const today = hours.find(day => day.isToday);
  if (today && today.hours !== 'Closed') {
    return `Today: ${today.hours}`;
  }
  
  // If today is closed, find the most common pattern
  if (openDays.length === 7) return 'Open daily';
  
  // Find the most common hours pattern
  const hoursMap = new Map<string, string[]>();
  hours.forEach(day => {
    if (day.hours !== 'Closed') {
      const days = hoursMap.get(day.hours) || [];
      days.push(day.day);
      hoursMap.set(day.hours, days);
    }
  });
  
  const patterns = Array.from(hoursMap.entries())
    .sort((a, b) => b[1].length - a[1].length);
  
  if (patterns.length > 0) {
    const [hoursStr, days] = patterns[0];
    if (days.length >= 5) {
      return `${hoursStr} (most days)`;
    } else if (days.length === 1) {
      return `${days[0]}: ${hoursStr}`;
    } else {
      return `${days[0]} ${hoursStr}`;
    }
  }
  
  return 'Hours vary';
}

function getCurrentService(kitchenHours: DayHours[], barHours: DayHours[]): 'kitchen' | 'bar' | 'closed' {
  const todayKitchen = kitchenHours.find(h => h.isToday);
  const todayBar = barHours.find(h => h.isToday);
  
  if (todayKitchen?.isOpen) return 'kitchen';
  if (todayBar?.isOpen) return 'bar';
  return 'closed';
}

function getNextChange(kitchenHours: DayHours[], barHours: DayHours[]): string | null {
  // Simplified implementation - could be enhanced with actual next opening/closing time
  return null;
}