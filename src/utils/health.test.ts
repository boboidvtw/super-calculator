import { describe, it, expect } from 'vitest';
import { bmiStatus, calculateBmi, estimateBodyFat } from './health';

describe('calculateBmi', () => {
    it('computes kg / m²', () => {
        expect(calculateBmi(170, 65)).toBeCloseTo(22.4913, 4);
    });

    it('returns null for missing or zero inputs', () => {
        expect(calculateBmi(0, 65)).toBeNull();
        expect(calculateBmi(170, 0)).toBeNull();
        expect(calculateBmi(Number.NaN, 65)).toBeNull();
    });
});

describe('bmiStatus (WHO cut-offs)', () => {
    it.each([
        [18.4, 'underweight'],
        [18.5, 'normal'],
        [24.9, 'normal'],
        [25, 'overweight'],
        [30, 'obese'],
    ])('%s -> %s', (bmi, expected) => {
        expect(bmiStatus(bmi)).toBe(expected);
    });
});

describe('estimateBodyFat (Deurenberg 1991)', () => {
    it('matches the published formula', () => {
        // 1.2 × 22.5 + 0.23 × 25 − 10.8 − 5.4 = 16.55
        expect(estimateBodyFat(22.5, 25, 'm')).toBeCloseTo(16.55, 10);
        // 1.2 × 22.5 + 0.23 × 25 − 5.4 = 27.35
        expect(estimateBodyFat(22.5, 25, 'f')).toBeCloseTo(27.35, 10);
    });

    it('returns null for children, missing age or missing BMI', () => {
        expect(estimateBodyFat(22.5, 12, 'm')).toBeNull();
        expect(estimateBodyFat(22.5, Number.NaN, 'm')).toBeNull();
        expect(estimateBodyFat(null, 30, 'm')).toBeNull();
    });
});
