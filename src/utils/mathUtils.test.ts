import { describe, it, expect } from 'vitest';
import { timeUtils, numberBaseUtils, isDigitAllowed } from './mathUtils';

describe('Time Calculator Utils', () => {
    it('adds time correctly', () => {
        const t1 = { days: 0, hours: 2, minutes: 5, seconds: 0 };
        const t2 = { days: 0, hours: 1, minutes: 19, seconds: 0 };
        expect(timeUtils.addTime(t1, t2)).toEqual({ days: 0, hours: 3, minutes: 24, seconds: 0 });
    });

    it('carries overflowing units into larger ones', () => {
        const t1 = { days: 0, hours: 23, minutes: 59, seconds: 59 };
        const t2 = { days: 0, hours: 0, minutes: 0, seconds: 1 };
        expect(timeUtils.addTime(t1, t2)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 0 });
    });

    it('subtracts time correctly', () => {
        const t1 = { days: 1, hours: 0, minutes: 0, seconds: 0 };
        const t2 = { days: 0, hours: 1, minutes: 0, seconds: 0 };
        expect(timeUtils.subtractTime(t1, t2)).toEqual({ days: 0, hours: 23, minutes: 0, seconds: 0 });
    });

    it('clamps negative results to zero', () => {
        const zero = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        expect(timeUtils.subtractTime(zero, { ...zero, hours: 1 })).toEqual(zero);
    });

    it('formats durations', () => {
        expect(timeUtils.format({ days: 1, hours: 2, minutes: 0, seconds: 5 })).toBe('1d 2h 5s');
        expect(timeUtils.format({ days: 0, hours: 0, minutes: 0, seconds: 0 })).toBe('0s');
    });
});

describe('Number Base Utils', () => {
    it('converts decimal to binary', () => {
        expect(numberBaseUtils.convert('10', 10, 2)).toBe('1010');
    });
    it('converts binary to hex', () => {
        expect(numberBaseUtils.convert('1111', 2, 16)).toBe('F');
    });
    it('converts hex to decimal', () => {
        expect(numberBaseUtils.convert('FF', 16, 10)).toBe('255');
    });
    it('accepts lowercase hex', () => {
        expect(numberBaseUtils.convert('ff', 16, 10)).toBe('255');
    });
    it('rejects any invalid digit, not just a leading one', () => {
        expect(numberBaseUtils.convert('G', 16, 10)).toBe('Error');
        // parseInt('1G', 16) would silently return 1.
        expect(numberBaseUtils.convert('1G', 16, 10)).toBe('Error');
        expect(numberBaseUtils.convert('102', 2, 10)).toBe('Error');
    });
    it('keeps full precision beyond 2^53', () => {
        // 2^64 - 1
        expect(numberBaseUtils.convert('FFFFFFFFFFFFFFFF', 16, 10)).toBe('18446744073709551615');
        expect(numberBaseUtils.convert('18446744073709551615', 10, 2)).toBe('1'.repeat(64));
    });
    it('returns empty for empty input', () => {
        expect(numberBaseUtils.convert('', 10, 2)).toBe('');
    });
});

describe('isDigitAllowed', () => {
    it('limits keys to the active base', () => {
        expect(isDigitAllowed('1', 2)).toBe(true);
        expect(isDigitAllowed('2', 2)).toBe(false);
        expect(isDigitAllowed('7', 8)).toBe(true);
        expect(isDigitAllowed('8', 8)).toBe(false);
        expect(isDigitAllowed('9', 10)).toBe(true);
        expect(isDigitAllowed('A', 10)).toBe(false);
        expect(isDigitAllowed('F', 16)).toBe(true);
        expect(isDigitAllowed('G', 16)).toBe(false);
        expect(isDigitAllowed('BACKSPACE', 16)).toBe(false);
    });
});
