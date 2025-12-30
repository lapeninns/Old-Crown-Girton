/**
 * Restaurant Status Utilities
 * 
 * Extracted from hooks/data/useRestaurant.ts to follow SRP.
 * These utilities determine the open/closed status of a restaurant.
 * 
 * @module lib/utils/restaurant/status
 */

import {
    parseTime12Hour,
    parseOpeningTime,
    getCurrentTimeMinutes,
    getCurrentDayName,
    getDayIndex,
    DAY_NAMES,
    type DayName,
} from '../time/parsing';
import {
    formatMinutesToTime,
    formatDayLabel,
} from '../time/formatting';

/**
 * Detailed hours format - separate kitchen and bar hours.
 * Example: { kitchen: { monday: "12:00-15:00,17:00-22:00" }, bar: { monday: "12:00-22:00" } }
 */
export interface DetailedHoursFormat {
    kitchen?: Record<string, string>;
    bar?: Record<string, string>;
}

/**
 * Restaurant hours data structure - supports any record type.
 * The actual runtime value could be:
 * - Legacy format: { monday: "11:30 AM - 10:00 PM", ... }
 * - Detailed format: { kitchen: {...}, bar: {...} }
 */
export type RestaurantHours = Record<string, string> | DetailedHoursFormat;

/**
 * Type guard to check if hours object is in detailed format.
 */
export function isDetailedHoursFormat(hours: RestaurantHours): hours is DetailedHoursFormat {
    return (
        typeof hours === 'object' &&
        hours !== null &&
        ('kitchen' in hours || 'bar' in hours)
    );
}

/**
 * Result of checking restaurant open status.
 */
export interface OpenStatusResult {
    isOpen: boolean;
    currentHours: string | null;
    nextOpenTime: string | null;
}

/**
 * Checks if a time range covers the current time.
 * Supports both 12-hour and 24-hour formats.
 * 
 * @param hoursString - Time range string (e.g., "11:30 AM - 10:00 PM" or "12:00-15:00")
 * @param currentMinutes - Current time in minutes since midnight
 * @returns True if currently within the time range
 */
export function isTimeRangeOpen(
    hoursString: string | undefined,
    currentMinutes: number
): boolean {
    if (!hoursString || hoursString.toLowerCase() === 'closed') return false;

    // Handle 12-hour format (contains AM/PM)
    if (hoursString.includes('AM') || hoursString.includes('PM')) {
        const timeRange = hoursString.split(' - ');
        if (timeRange.length !== 2) return false;

        const openTime = parseTime12Hour(timeRange[0]);
        const closeTime = parseTime12Hour(timeRange[1]);

        return currentMinutes >= openTime && currentMinutes <= closeTime;
    }

    // Handle 24-hour format with possible multiple ranges
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

            if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Gets hours for a specific day from detailed format.
 */
function getDetailedDayHours(hours: DetailedHoursFormat, day: string): string | undefined {
    return hours.kitchen?.[day] || hours.bar?.[day];
}

/**
 * Gets hours for a specific day from legacy format.
 */
function getLegacyDayHours(hours: Record<string, string>, day: string): string | undefined {
    return hours[day];
}

/**
 * Gets hours for a specific day, handling both formats.
 */
function getDayHours(hours: RestaurantHours, day: string): string | undefined {
    if (isDetailedHoursFormat(hours)) {
        return getDetailedDayHours(hours, day);
    }
    return getLegacyDayHours(hours, day);
}

/**
 * Checks if the restaurant is currently open.
 * Supports both legacy and detailed hour formats.
 * 
 * @param hours - Restaurant hours object
 * @param currentDate - Optional date to check (defaults to now)
 * @returns True if the restaurant is currently open
 */
export function checkIsOpen(
    hours: RestaurantHours | null | undefined,
    currentDate: Date = new Date()
): boolean {
    if (!hours) return false;

    const currentDay = getCurrentDayName(currentDate);
    const currentMinutes = getCurrentTimeMinutes(currentDate);

    // Handle detailed format with kitchen and bar hours
    if (isDetailedHoursFormat(hours)) {
        const kitchenHours = hours.kitchen?.[currentDay];
        const barHours = hours.bar?.[currentDay];

        return (
            isTimeRangeOpen(kitchenHours, currentMinutes) ||
            isTimeRangeOpen(barHours, currentMinutes)
        );
    }

    // Handle legacy format
    const todayHours = hours[currentDay];
    if (!todayHours || todayHours.toLowerCase() === 'closed') return false;

    return isTimeRangeOpen(todayHours, currentMinutes);
}

/**
 * Gets the current day's hours as a display string.
 * 
 * @param hours - Restaurant hours object
 * @param currentDate - Optional date to check (defaults to now)
 * @returns Formatted hours string for today
 */
export function getCurrentDayHours(
    hours: RestaurantHours | null | undefined,
    currentDate: Date = new Date()
): string | null {
    if (!hours) return null;

    const currentDay = getCurrentDayName(currentDate);

    // Handle detailed format
    if (isDetailedHoursFormat(hours)) {
        const kitchenHours = hours.kitchen?.[currentDay];
        const barHours = hours.bar?.[currentDay];

        if (kitchenHours && barHours) {
            return `Kitchen: ${formatHoursForDisplay(kitchenHours)} | Bar: ${formatHoursForDisplay(barHours)}`;
        } else if (kitchenHours) {
            return `Kitchen: ${formatHoursForDisplay(kitchenHours)}`;
        } else if (barHours) {
            return `Bar: ${formatHoursForDisplay(barHours)}`;
        }

        return 'Closed';
    }

    // Handle legacy format
    return hours[currentDay] || null;
}

/**
 * Formats hours for display (internal helper).
 */
function formatHoursForDisplay(timeRange: string): string {
    if (!timeRange || timeRange.toLowerCase() === 'closed') return 'Closed';

    const ranges = timeRange.split(',').map(range => {
        return range.trim()
            .replace(/(\d{2}):(\d{2})/g, (_, hours, minutes) => {
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
 * Gets the next opening time when the restaurant is currently closed.
 * 
 * @param hours - Restaurant hours object
 * @param currentDate - Optional date to check (defaults to now)
 * @returns Message like "Today at 11 AM" or "Tomorrow at 12 PM", or null
 */
export function getNextOpenTime(
    hours: RestaurantHours | null | undefined,
    currentDate: Date = new Date()
): string | null {
    if (!hours) return null;

    const currentDayIndex = getDayIndex(currentDate);
    const currentMinutes = getCurrentTimeMinutes(currentDate);

    // Check next 7 days
    for (let i = 0; i < 7; i++) {
        const dayIndex = (currentDayIndex + i) % 7;
        const dayName = DAY_NAMES[dayIndex] as DayName;

        const dayHours = getDayHours(hours, dayName);

        if (dayHours && dayHours.toLowerCase() !== 'closed') {
            const openingTime = parseOpeningTime(dayHours);

            if (openingTime === null) continue;

            if (i === 0) {
                // Today - check if we haven't passed opening time yet
                if (currentMinutes < openingTime) {
                    const displayTime = formatMinutesToTime(openingTime);
                    return `Today at ${displayTime}`;
                }
            } else {
                // Future day
                const displayTime = formatMinutesToTime(openingTime);
                const dayLabel = formatDayLabel(i, dayName);
                return `${dayLabel} at ${displayTime}`;
            }
        }
    }

    return null;
}

/**
 * Gets comprehensive restaurant status information.
 * This is a convenience function that combines all status checks.
 * 
 * @param hours - Restaurant hours object
 * @param currentDate - Optional date to check (defaults to now)
 * @returns Complete status result with isOpen, currentHours, and nextOpenTime
 */
export function getRestaurantStatus(
    hours: RestaurantHours | null | undefined,
    currentDate: Date = new Date()
): OpenStatusResult {
    const isOpen = checkIsOpen(hours, currentDate);
    const currentHours = getCurrentDayHours(hours, currentDate);
    const nextOpenTime = isOpen ? null : getNextOpenTime(hours, currentDate);

    return {
        isOpen,
        currentHours,
        nextOpenTime,
    };
}
