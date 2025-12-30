import { describe, it, expect } from '@jest/globals';
import {
    checkIsOpen,
    getRestaurantStatus,
    isTimeRangeOpen,
    type RestaurantHours,
} from '@/lib/utils/restaurant/status';

describe('Restaurant Status Utilities', () => {

    describe('isTimeRangeOpen', () => {
        it('returns true if time is within 12-hour range', () => {
            // 12:00 PM - 2:00 PM (720 - 840 minutes)
            // Check at 1:00 PM (780)
            expect(isTimeRangeOpen('12:00 PM - 02:00 PM', 780)).toBe(true);
        });

        it('returns false if time is outside 12-hour range', () => {
            // 12:00 PM - 2:00 PM
            // Check at 2:01 PM (841)
            expect(isTimeRangeOpen('12:00 PM - 02:00 PM', 841)).toBe(false);
        });

        it('returns true if time is within 24-hour range', () => {
            // 12:00 - 14:00
            // Check at 13:00 (780)
            expect(isTimeRangeOpen('12:00 - 14:00', 780)).toBe(true);
        });

        it('handles multiple 24-hour ranges', () => {
            // 12:00-14:00, 18:00-22:00
            // Check at 19:00 (1140)
            expect(isTimeRangeOpen('12:00-14:00, 18:00-22:00', 1140)).toBe(true);
            // Check at 16:00 (960) -> Closed
            expect(isTimeRangeOpen('12:00-14:00, 18:00-22:00', 960)).toBe(false);
        });

        it('handles overnight hours (e.g. 22:00 - 02:00)', () => {
            // 22:00 (1320) - 02:00 (120) -> end is 120 + 1440 = 1560
            // Check at 23:00 (1380)
            expect(isTimeRangeOpen('22:00 - 02:00', 1380)).toBe(true);
        });

        it('returns false for "Closed"', () => {
            expect(isTimeRangeOpen('Closed', 500)).toBe(false);
        });
    });

    describe('checkIsOpen', () => {
        // 2023-12-25 is Monday
        const mondayNoon = new Date('2023-12-25T12:00:00');
        const mondayNight = new Date('2023-12-25T23:00:00');

        const legacyHours: RestaurantHours = {
            monday: '11:00 AM - 10:00 PM',
            tuesday: 'Closed'
        };

        const detailedHours: RestaurantHours = {
            kitchen: {
                monday: '12:00-15:00, 18:00-22:00'
            },
            bar: {
                monday: '12:00-23:00'
            }
        };

        it('works with legacy hours', () => {
            // Open
            expect(checkIsOpen(legacyHours, mondayNoon)).toBe(true);
            // Closed (too late)
            expect(checkIsOpen(legacyHours, mondayNight)).toBe(false);
        });

        it('works with detailed hours (kitchen or bar)', () => {
            // At noon: Kitchen open (12-15), Bar open (12-23) -> Open
            expect(checkIsOpen(detailedHours, mondayNoon)).toBe(true);

            // At 4PM (16:00): Kitchen closed (15-18), Bar open (12-23) -> Open
            const monday4pm = new Date('2023-12-25T16:00:00');
            expect(checkIsOpen(detailedHours, monday4pm)).toBe(true);
        });

        it('returns false if hours are null', () => {
            expect(checkIsOpen(null)).toBe(false);
        });
    });

    describe('getRestaurantStatus', () => {
        // 2023-12-25 is Monday
        const mondayMorning = new Date('2023-12-25T09:00:00'); // Closed, opens at 11

        const hours: RestaurantHours = {
            monday: '11:00 AM - 10:00 PM'
        };

        it('returns next opening time when closed', () => {
            const status = getRestaurantStatus(hours, mondayMorning);
            expect(status.isOpen).toBe(false);
            expect(status.nextOpenTime).toContain('Today at 11 AM');
        });
    });
});
