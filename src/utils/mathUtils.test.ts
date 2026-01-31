import { describe, it, expect } from 'vitest';
import { timeUtils, numberBaseUtils } from './mathUtils';

describe('Time Calculator Utils', () => {
    it('adds time correctly', () => {
        const t1 = { days: 0, hours: 2, minutes: 5, seconds: 0 };
        const t2 = { days: 0, hours: 1, minutes: 19, seconds: 0 }; // 79m = 1h 19m
        // 2h5m + 79m = 2h5m + 1h19m = 3h24m
        const result = timeUtils.addTime(t1, t2);
        expect(result).toEqual({ days: 0, hours: 3, minutes: 24, seconds: 0 });
    });

    it('subtracts time correctly', () => {
        const t1 = { days: 1, hours: 0, minutes: 0, seconds: 0 };
        const t2 = { days: 0, hours: 1, minutes: 0, seconds: 0 };
        const result = timeUtils.subtractTime(t1, t2);
        expect(result).toEqual({ days: 0, hours: 23, minutes: 0, seconds: 0 });
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
    it('handles invalid input', () => {
        expect(numberBaseUtils.convert('G', 16, 10)).toBe('Error'); // G is not hex (wait, parseInt might parse valid prefix, let's check behavior)
        // Actually parseInt('G', 16) is NaN.
    });
});
