import { describe, it, expect, afterEach } from 'vitest';
import { addDays, addYears, daysBetween, parseLocalDate, toLocalDateString } from './dateUtils';

const originalTz = process.env.TZ;

afterEach(() => {
    process.env.TZ = originalTz;
});

describe('parseLocalDate', () => {
    it('parses as a local calendar date even in negative UTC offsets', () => {
        process.env.TZ = 'America/New_York';
        // Regression: new Date('2026-11-04') is UTC midnight = Nov 3 in New York.
        expect(new Date('2026-11-04').getDate()).toBe(3);
        const date = parseLocalDate('2026-11-04');
        expect(date?.getFullYear()).toBe(2026);
        expect(date?.getMonth()).toBe(10);
        expect(date?.getDate()).toBe(4);
    });

    it('rejects empty and impossible dates', () => {
        expect(parseLocalDate('')).toBeNull();
        expect(parseLocalDate('2025-02-29')).toBeNull();
        expect(parseLocalDate('2024-13-01')).toBeNull();
        expect(parseLocalDate('not-a-date')).toBeNull();
    });
});

describe('toLocalDateString', () => {
    it('uses the local date, not UTC', () => {
        process.env.TZ = 'Asia/Taipei';
        // 07:00 in Taipei is still the previous day in UTC.
        expect(toLocalDateString(new Date(2026, 10, 4, 7, 0))).toBe('2026-11-04');
    });
});

describe('daysBetween', () => {
    it('counts a leap year', () => {
        expect(daysBetween(new Date(2024, 0, 1), new Date(2024, 11, 31))).toBe(365);
    });

    it('is negative for past dates', () => {
        expect(daysBetween(new Date(2026, 10, 4), new Date(2026, 10, 1))).toBe(-3);
    });

    it('ignores time of day', () => {
        expect(daysBetween(new Date(2026, 10, 4, 23, 59), new Date(2026, 10, 5, 0, 1))).toBe(1);
    });

    it('is not affected by daylight saving transitions', () => {
        process.env.TZ = 'America/New_York';
        // DST starts on 2026-03-08 in the US: that day has only 23 hours.
        expect(daysBetween(new Date(2026, 2, 7), new Date(2026, 2, 9))).toBe(2);
    });
});

describe('addDays / addYears', () => {
    it('adds 100 days across month boundaries', () => {
        expect(toLocalDateString(addDays(new Date(2026, 0, 1), 100))).toBe('2026-04-11');
    });

    it('clamps Feb 29 to Feb 28 in a non-leap year', () => {
        expect(toLocalDateString(addYears(new Date(2024, 1, 29), 1))).toBe('2025-02-28');
    });

    it('keeps the day otherwise', () => {
        expect(toLocalDateString(addYears(new Date(2026, 10, 4), 1))).toBe('2027-11-04');
    });
});
