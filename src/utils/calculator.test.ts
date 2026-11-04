import { describe, it, expect } from 'vitest';
import {
    calculate,
    calculatorReducer,
    formatNumber,
    ERROR_VALUE,
    INITIAL_CALCULATOR_STATE,
    MAX_INPUT_DIGITS,
    type CalculatorAction,
    type CalculatorState,
} from './calculator';

/** Feeds a key sequence like "1 2 + 3 =" into the reducer. */
function press(keys: string, start: CalculatorState = INITIAL_CALCULATOR_STATE): CalculatorState {
    const toAction = (key: string): CalculatorAction => {
        if (/^[0-9]$/.test(key)) return { type: 'digit', digit: key };
        switch (key) {
            case '.': return { type: 'dot' };
            case '=': return { type: 'equals' };
            case 'C': return { type: 'clear' };
            case '⌫': return { type: 'backspace' };
            case '±': return { type: 'toggleSign' };
            case '%': return { type: 'percent' };
            case '+': case '-': case '×': case '÷': return { type: 'operator', operator: key };
            default: throw new Error(`unknown key ${key}`);
        }
    };
    return keys.split(' ').filter(Boolean).map(toAction).reduce(calculatorReducer, start);
}

describe('calculate', () => {
    it('returns null for division by zero instead of 0', () => {
        expect(calculate(5, 0, '÷')).toBeNull();
    });

    it('performs the four operations', () => {
        expect(calculate(6, 3, '+')).toBe(9);
        expect(calculate(6, 3, '-')).toBe(3);
        expect(calculate(6, 3, '×')).toBe(18);
        expect(calculate(6, 3, '÷')).toBe(2);
    });
});

describe('formatNumber', () => {
    it('hides binary floating point noise', () => {
        expect(formatNumber(0.1 + 0.2)).toBe('0.3');
        expect(formatNumber(1.1 * 3)).toBe('3.3');
    });

    it('keeps 12 significant digits', () => {
        expect(formatNumber(1 / 3)).toBe('0.333333333333');
    });

    it('maps null, NaN and Infinity to Error', () => {
        expect(formatNumber(null)).toBe(ERROR_VALUE);
        expect(formatNumber(Number.NaN)).toBe(ERROR_VALUE);
        expect(formatNumber(Infinity)).toBe(ERROR_VALUE);
    });

    it('normalises negative zero', () => {
        expect(formatNumber(-0)).toBe('0');
    });
});

describe('calculatorReducer', () => {
    it('computes 0.1 + 0.2 = 0.3', () => {
        expect(press('0 . 1 + 0 . 2 =').currentValue).toBe('0.3');
    });

    it('shows Error on division by zero and recovers on next digit', () => {
        const errored = press('8 ÷ 0 =');
        expect(errored.currentValue).toBe(ERROR_VALUE);
        expect(press('7', errored).currentValue).toBe('7');
    });

    it('shows Error when chaining an operator after division by zero', () => {
        expect(press('8 ÷ 0 +').currentValue).toBe(ERROR_VALUE);
    });

    it('ignores operators, sign and percent while in Error', () => {
        const errored = press('1 ÷ 0 =');
        expect(press('+ ± %', errored).currentValue).toBe(ERROR_VALUE);
    });

    it('chains operations left to right', () => {
        expect(press('2 + 3 × 4 =').currentValue).toBe('20');
    });

    it('swaps operator when pressed twice', () => {
        const state = press('9 + -');
        expect(state.operator).toBe('-');
        expect(press('4 =', state).currentValue).toBe('5');
    });

    it('records each equals in history exactly once, newest first', () => {
        const state = press('1 + 1 = C 2 × 3 =');
        expect(state.history).toEqual(['2 × 3 = 6', '1 + 1 = 2']);
    });

    it('keeps at most 50 history entries', () => {
        let state = INITIAL_CALCULATOR_STATE;
        for (let i = 0; i < 60; i++) state = press('1 + 1 =', state);
        expect(state.history).toHaveLength(50);
    });

    it('limits input to the maximum digit count', () => {
        const state = press(Array(MAX_INPUT_DIGITS + 5).fill('9').join(' '));
        expect(state.currentValue).toHaveLength(MAX_INPUT_DIGITS);
    });

    it('prevents multiple leading zeros and duplicate dots', () => {
        expect(press('0 0 0 5').currentValue).toBe('5');
        expect(press('1 . . 5').currentValue).toBe('1.5');
        expect(press('.').currentValue).toBe('0.');
    });

    it('backspaces to zero', () => {
        expect(press('1 2 ⌫').currentValue).toBe('1');
        expect(press('1 ⌫').currentValue).toBe('0');
        expect(press('5 ± ⌫').currentValue).toBe('0');
    });

    it('toggles sign and computes percent', () => {
        expect(press('5 ±').currentValue).toBe('-5');
        expect(press('5 0 %').currentValue).toBe('0.5');
    });

    it('typing after a negated zero keeps the sign', () => {
        expect(press('0 ± 3', { ...INITIAL_CALCULATOR_STATE, isNewNumber: false }).currentValue).toBe('3');
        expect(calculatorReducer({ ...INITIAL_CALCULATOR_STATE, currentValue: '-0', isNewNumber: false }, { type: 'digit', digit: '4' }).currentValue).toBe('-4');
    });

    it('clear keeps history', () => {
        const state = press('1 + 1 = C');
        expect(state.currentValue).toBe('0');
        expect(state.history).toHaveLength(1);
    });

    it('equals without an operator is a no-op', () => {
        const state = press('4');
        expect(press('=', state)).toBe(state);
    });
});
