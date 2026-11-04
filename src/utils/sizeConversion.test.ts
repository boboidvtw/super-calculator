import { describe, it, expect } from 'vitest';
import { getSize, sizeTables } from './sizeConversion';

describe('sizeConversion', () => {
    it('every region of a category has the same number of sizes', () => {
        for (const table of Object.values(sizeTables)) {
            const lengths = Object.values(table).map((sizes) => sizes.length);
            expect(new Set(lengths).size).toBe(1);
        }
    });

    it('looks up a size by index', () => {
        expect(getSize('MensShoe', 'US', 3)).toBe('9');
        expect(getSize('MensShoe', 'EU', 3)).toBe('42');
    });

    it('returns a dash outside the table', () => {
        expect(getSize('MensTShirt', 'JP', 99)).toBe('-');
    });
});
