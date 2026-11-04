import { describe, it, expect } from 'vitest';
import { appendDigit, appendDot, removeLast, toNumber } from './numericInput';

describe('numeric keypad editing', () => {
    it('replaces a lone zero', () => {
        expect(appendDigit('0', '7')).toBe('7');
    });

    it('caps the number of digits, not counting the dot', () => {
        expect(appendDigit('1234', '5', 4)).toBe('1234');
        expect(appendDigit('12.34', '5', 4)).toBe('12.34');
        expect(appendDigit('12.', '3', 4)).toBe('12.3');
    });

    it('adds at most one dot', () => {
        expect(appendDot('3')).toBe('3.');
        expect(appendDot('3.1')).toBe('3.1');
    });

    it('backspaces to zero', () => {
        expect(removeLast('42')).toBe('4');
        expect(removeLast('4')).toBe('0');
    });

    it('parses with a fallback', () => {
        expect(toNumber('3.5')).toBe(3.5);
        expect(toNumber('')).toBe(0);
        expect(toNumber('.', 7)).toBe(7);
        expect(Number.isNaN(toNumber('', Number.NaN))).toBe(true);
    });
});
