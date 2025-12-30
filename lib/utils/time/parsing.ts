/**
 * Time Parsing Utilities
 * 
 * Extracted from hooks/data/useRestaurant.ts to follow SRP.
 * These utilities handle parsing of various time formats used in restaurant hours.
 * 
 * @module lib/utils/time/parsing
 */

/**
 * Checks if a time string is in 12-hour format (contains AM/PM).
 */
export function is12HourFormat(timeStr: string): boolean {
    const upper = timeStr.toUpperCase();
    return upper.includes('AM') || upper.includes('PM');
}

/**
 * Parses a 12-hour format time string (e.g., "11:30 AM") to minutes since midnight.
 * 
 * @param timeStr - Time string in 12-hour format (e.g., "11:30 AM", "10:00 PM")
 * @returns Minutes since midnight
 * 
 * @example
 * parseTime12Hour("11:30 AM") // Returns 690 (11 * 60 + 30)
 * parseTime12Hour("10:00 PM") // Returns 1320 (22 * 60)
 */
export function parseTime12Hour(timeStr: string): number {
    // robust split that handles multiple spaces
    const parts = timeStr.trim().split(/\s+/);
    if (parts.length < 2) return 0; // Invalid format? or throw

    const time = parts[0];
    const period = parts[1];

    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = hours * 60 + (minutes || 0);

    if (period?.toUpperCase() === 'PM' && hours !== 12) {
        totalMinutes += 12 * 60;
    } else if (period?.toUpperCase() === 'AM' && hours === 12) {
        totalMinutes = minutes || 0;
    }

    return totalMinutes;
}

/**
 * Parses a 24-hour format time string (e.g., "14:30") to minutes since midnight.
 * 
 * @param timeStr - Time string in 24-hour format (e.g., "14:30", "09:00")
 * @returns Minutes since midnight, or null if parsing fails
 * 
 * @example
 * parseTime24Hour("14:30") // Returns 870 (14 * 60 + 30)
 * parseTime24Hour("09:00") // Returns 540 (9 * 60)
 */
export function parseTime24Hour(timeStr: string): number | null {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;

    const [, hours, minutes] = match;
    return parseInt(hours) * 60 + parseInt(minutes);
}

/**
 * Parses an opening time from a time range string.
 * Supports both 12-hour and 24-hour formats.
 * 
 * @param timeRange - Time range string (e.g., "11:30 AM - 10:00 PM" or "12:00-15:00")
 * @returns Opening time in minutes since midnight, or null if parsing fails
 */
export function parseOpeningTime(timeRange: string): number | null {
    if (!timeRange || timeRange.toLowerCase() === 'closed') return null;

    // Check for 12-hour format first
    if (is12HourFormat(timeRange)) {
        // e.g. "11:30 AM - 10:00 PM" -> get "11:30 AM"
        const parts = timeRange.split(/\s*-\s*/);
        if (parts.length > 0) {
            return parseTime12Hour(parts[0]);
        }
    }

    // Handle 24-hour format
    const match = timeRange.match(/(\d{1,2}):(\d{2})/);
    if (match) {
        const [, hours, minutes] = match;
        return parseInt(hours) * 60 + parseInt(minutes);
    }

    return null;
}

/**
 * Gets the current time as minutes since midnight.
 * Useful for comparing with parsed time values.
 * 
 * @param date - Optional date to use (defaults to current time)
 * @returns Minutes since midnight
 */
export function getCurrentTimeMinutes(date: Date = new Date()): number {
    return date.getHours() * 60 + date.getMinutes();
}

/**
 * Gets the current day name in lowercase.
 * 
 * @param date - Optional date to use (defaults to current time)
 * @returns Day name in lowercase (e.g., "monday", "tuesday")
 */
export function getCurrentDayName(date: Date = new Date()): string {
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
}

/**
 * Gets the day index (0 = Sunday, 6 = Saturday).
 * 
 * @param date - Optional date to use (defaults to current time)
 * @returns Day index (0-6)
 */
export function getDayIndex(date: Date = new Date()): number {
    return date.getDay();
}

/**
 * Array of day names in order (Sunday first for JS Date compatibility).
 */
export const DAY_NAMES = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
] as const;

export type DayName = typeof DAY_NAMES[number];
