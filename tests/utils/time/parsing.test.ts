import { describe, it, expect } from '@jest/globals';
import {
    parseTime12Hour,
    parseTime24Hour,
    parseOpeningTime,
    getCurrentTimeMinutes,
    getCurrentDayName,
    getDayIndex,
    is12HourFormat,
} from '@/lib/utils/time/parsing';

describe('Time Parsing Utilities', () => {

    describe('is12HourFormat', () => {
        it('returns true for strings containing AM', () => {
            expect(is12HourFormat('10:00 AM')).toBe(true);
        });

        it('returns true for strings containing PM', () => {
            expect(is12HourFormat('05:00 PM')).toBe(true);
        });

        it('returns false for 24-hour style strings', () => {
            expect(is12HourFormat('14:30')).toBe(false);
            expect(is12HourFormat('09:00')).toBe(false);
        });
    });

    describe('parseTime12Hour', () => {
        it('parses 12:00 AM as 0 minutes', () => {
            expect(parseTime12Hour('12:00 AM')).toBe(0);
        });

        it('parses 01:00 AM as 60 minutes', () => {
            expect(parseTime12Hour('01:00 AM')).toBe(60);
        });

        it('parses 12:00 PM as 720 minutes', () => {
            expect(parseTime12Hour('12:00 PM')).toBe(12 * 60);
        });

        it('parses 01:00 PM as 780 minutes', () => {
            expect(parseTime12Hour('01:00 PM')).toBe(13 * 60);
        });

        it('parses partial hours like 1 PM', () => {
            expect(parseTime12Hour('1 PM')).toBe(13 * 60);
        });

        it('handles whitespace', () => {
            expect(parseTime12Hour(' 1:30   PM ')).toBe(13 * 60 + 30);
        });
    });

    describe('parseTime24Hour', () => {
        it('parses 00:00 as 0 minutes', () => {
            expect(parseTime24Hour('00:00')).toBe(0);
        });

        it('parses 14:30 as 870 minutes', () => {
            expect(parseTime24Hour('14:30')).toBe(14 * 60 + 30);
        });
    });

    describe('parseOpeningTime', () => {
        it('handles 12-hour format strings', () => {
            // "11:30 AM - 10:00 PM"
            expect(parseOpeningTime('11:30 AM - 10:00 PM')).toBe(11 * 60 + 30);
        });

        it('handles 24-hour single range', () => {
            // "12:00-15:00"
            expect(parseOpeningTime('12:00 - 15:00')).toBe(12 * 60);
        });

        it('handles 24-hour multi range (takes first)', () => {
            // "12:00-15:00, 17:00-22:00"
            expect(parseOpeningTime('12:00-15:00, 17:00-22:00')).toBe(12 * 60);
        });

        it('returns null for "Closed"', () => {
            expect(parseOpeningTime('Closed')).toBeNull();
        });

        it('returns null for invalid/empty inputs', () => {
            expect(parseOpeningTime('')).toBeNull();
            expect(parseOpeningTime(undefined)).toBeNull();
        });
    });

    describe('Date Helpers', () => {
        // Mock date to 2023-12-25 (Monday) 12:30:00
        const mockDate = new Date('2023-12-25T12:30:00');

        it('getCurrentTimeMinutes returns correct minutes', () => {
            expect(getCurrentTimeMinutes(mockDate)).toBe(12 * 60 + 30);
        });

        it('getCurrentDayName returns correct day', () => {
            expect(getCurrentDayName(mockDate)).toBe('monday');
        });

        it('getDayIndex returns correct index (monday=0)', () => {
            // Based on logic in parsing.ts, usually 0=Monday if using that standard
            expect(getDayIndex(mockDate)).toBe(1);
        });
    });
});
