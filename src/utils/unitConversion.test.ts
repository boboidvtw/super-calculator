import { describe, it, expect } from 'vitest';
import { convertUnit } from './unitConversion';

describe('Unit Conversion Logic', () => {
    describe('Length', () => {
        it('converts meters to kilometers', () => {
            expect(convertUnit(1000, 'm', 'km', 'length')).toBe(1);
        });
        it('converts inches to centimeters', () => {
            expect(convertUnit(1, 'in', 'cm', 'length')).toBeCloseTo(2.54);
        });
    });

    describe('Weight', () => {
        it('converts kilograms to grams', () => {
            expect(convertUnit(1, 'kg', 'g', 'weight')).toBe(1000);
        });
        it('converts pounds to kilograms', () => {
            expect(convertUnit(1, 'lb', 'kg', 'weight')).toBeCloseTo(0.453592, 5);
        });
    });

    describe('Temperature', () => {
        it('converts Celsius to Fahrenheit', () => {
            expect(convertUnit(0, 'C', 'F', 'temperature')).toBe(32);
            expect(convertUnit(100, 'C', 'F', 'temperature')).toBe(212);
        });
        it('converts Fahrenheit to Celsius', () => {
            expect(convertUnit(32, 'F', 'C', 'temperature')).toBe(0);
            expect(convertUnit(212, 'F', 'C', 'temperature')).toBe(100);
        });
        it('converts Celsius to Kelvin', () => {
            expect(convertUnit(0, 'C', 'K', 'temperature')).toBe(273.15);
        });
    });
});
