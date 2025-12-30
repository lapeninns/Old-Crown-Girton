/**
 * Time Formatting Utilities
 * 
 * Extracted from hooks/data/useRestaurant.ts to follow SRP.
 * These utilities handle formatting of time values for display.
 * 
 * @module lib/utils/time/formatting
 */

/**
 * Formats hours and minutes to a display string (e.g., "2:30 PM").
 * 
 * @param hours - Hour (0-23)
 * @param minutes - Minutes (0-59)
 * @returns Formatted time string in 12-hour format
 * 
 * @example
 * formatTime(14, 30) // Returns "2:30 PM"
 * formatTime(9, 0)   // Returns "9 AM"
 * formatTime(0, 0)   // Returns "12 AM"
 */
export function formatTime(hours: number, minutes: number): string {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
    return `${displayHours}${displayMinutes} ${period}`;
}

/**
 * Formats minutes since midnight to a display string.
 * 
 * @param totalMinutes - Minutes since midnight
 * @returns Formatted time string in 12-hour format
 * 
 * @example
 * formatMinutesToTime(870) // Returns "2:30 PM"
 * formatMinutesToTime(540) // Returns "9 AM"
 */
export function formatMinutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return formatTime(hours, minutes);
}

/**
 * Formats a 24-hour time range for display.
 * Converts "12:00-15:00" to "12 PM – 3 PM" format.
 * 
 * @param timeRange - Time range in 24-hour format
 * @returns Formatted time range for display
 * 
 * @example
 * formatHoursDisplay("12:00-15:00") // Returns "12 PM – 3 PM"
 * formatHoursDisplay("12:00-15:00,17:00-22:00") // Returns "12 PM – 3 PM, 5 PM – 10 PM"
 */
export function formatHoursDisplay(timeRange: string): string {
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
}

/**
 * Formats a relative day label (e.g., "Today", "Tomorrow", or day name).
 * 
 * @param daysFromNow - Number of days from today (0 = today, 1 = tomorrow, etc.)
 * @param dayName - The name of the day
 * @returns Formatted day label
 * 
 * @example
 * formatDayLabel(0, "monday")    // Returns "Today"
 * formatDayLabel(1, "tuesday")   // Returns "Tomorrow"
 * formatDayLabel(2, "wednesday") // Returns "Wednesday"
 */
export function formatDayLabel(daysFromNow: number, dayName: string): string {
    if (daysFromNow === 0) return 'Today';
    if (daysFromNow === 1) return 'Tomorrow';
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
}

/**
 * Formats a "next open" message with day and time.
 * 
 * @param daysFromNow - Number of days from today
 * @param dayName - The name of the day
 * @param openingMinutes - Opening time in minutes since midnight
 * @returns Formatted message (e.g., "Today at 11 AM", "Tomorrow at 12 PM")
 */
export function formatNextOpenMessage(
    daysFromNow: number,
    dayName: string,
    openingMinutes: number
): string {
    const dayLabel = formatDayLabel(daysFromNow, dayName);
    const displayTime = formatMinutesToTime(openingMinutes);
    return `${dayLabel} at ${displayTime}`;
}
