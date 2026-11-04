// Pure calculator logic: arithmetic, number formatting and a reducer
// so the standard calculator can be tested without rendering React.

export type Operator = '+' | '-' | '×' | '÷';

export const ERROR_VALUE = 'Error';
export const MAX_INPUT_DIGITS = 16;
const HISTORY_LIMIT = 50;
const SIGNIFICANT_DIGITS = 12;

export interface CalculatorState {
    currentValue: string;
    previousValue: string | null;
    operator: Operator | null;
    expression: string;
    isNewNumber: boolean;
    history: string[];
}

export const INITIAL_CALCULATOR_STATE: CalculatorState = {
    currentValue: '0',
    previousValue: null,
    operator: null,
    expression: '',
    isNewNumber: true,
    history: [],
};

export type CalculatorAction =
    | { type: 'digit'; digit: string }
    | { type: 'dot' }
    | { type: 'clear' }
    | { type: 'backspace' }
    | { type: 'operator'; operator: Operator }
    | { type: 'equals' }
    | { type: 'toggleSign' }
    | { type: 'percent' };

/** Returns null when the operation is undefined (division by zero). */
export function calculate(prev: number, current: number, operator: Operator): number | null {
    switch (operator) {
        case '+': return prev + current;
        case '-': return prev - current;
        case '×': return prev * current;
        case '÷': return current === 0 ? null : prev / current;
    }
}

/** Removes binary floating point noise, e.g. 0.1 + 0.2 -> "0.3". */
export function formatNumber(value: number | null): string {
    if (value === null || !Number.isFinite(value)) return ERROR_VALUE;
    const rounded = Number.parseFloat(value.toPrecision(SIGNIFICANT_DIGITS));
    return String(Object.is(rounded, -0) ? 0 : rounded);
}

function countDigits(value: string): number {
    return value.replace(/[^0-9]/g, '').length;
}

function withHistory(history: string[], entry: string): string[] {
    return [entry, ...history].slice(0, HISTORY_LIMIT);
}

function resetIfError(state: CalculatorState): CalculatorState {
    return state.currentValue === ERROR_VALUE
        ? { ...INITIAL_CALCULATOR_STATE, history: state.history }
        : state;
}

function inputDigit(state: CalculatorState, digit: string): CalculatorState {
    const base = resetIfError(state);
    if (base.isNewNumber) {
        return { ...base, currentValue: digit, isNewNumber: false };
    }
    if (countDigits(base.currentValue) >= MAX_INPUT_DIGITS) return base;
    if (base.currentValue === '0') return { ...base, currentValue: digit };
    if (base.currentValue === '-0') return { ...base, currentValue: `-${digit}` };
    return { ...base, currentValue: base.currentValue + digit };
}

function inputDot(state: CalculatorState): CalculatorState {
    const base = resetIfError(state);
    if (base.isNewNumber) {
        return { ...base, currentValue: '0.', isNewNumber: false };
    }
    if (base.currentValue.includes('.')) return base;
    return { ...base, currentValue: `${base.currentValue}.` };
}

function backspace(state: CalculatorState): CalculatorState {
    if (state.isNewNumber || state.currentValue === ERROR_VALUE) return state;
    const next = state.currentValue.slice(0, -1);
    if (next === '' || next === '-') {
        return { ...state, currentValue: '0', isNewNumber: true };
    }
    return { ...state, currentValue: next };
}

function applyOperator(state: CalculatorState, operator: Operator): CalculatorState {
    if (state.currentValue === ERROR_VALUE) return state;

    if (state.previousValue === null) {
        return {
            ...state,
            previousValue: state.currentValue,
            operator,
            expression: `${state.currentValue} ${operator}`,
            isNewNumber: true,
        };
    }

    if (state.operator && !state.isNewNumber) {
        const result = formatNumber(calculate(
            Number.parseFloat(state.previousValue),
            Number.parseFloat(state.currentValue),
            state.operator,
        ));
        if (result === ERROR_VALUE) {
            return { ...INITIAL_CALCULATOR_STATE, currentValue: ERROR_VALUE, history: state.history };
        }
        return {
            ...state,
            previousValue: result,
            currentValue: result,
            operator,
            expression: `${result} ${operator}`,
            isNewNumber: true,
        };
    }

    // Operator pressed twice in a row: just swap the operator.
    return { ...state, operator, expression: `${state.previousValue} ${operator}` };
}

function equals(state: CalculatorState): CalculatorState {
    if (!state.operator || state.previousValue === null) return state;

    const result = formatNumber(calculate(
        Number.parseFloat(state.previousValue),
        Number.parseFloat(state.currentValue),
        state.operator,
    ));
    const entry = `${state.previousValue} ${state.operator} ${state.currentValue} = ${result}`;

    return {
        ...INITIAL_CALCULATOR_STATE,
        currentValue: result,
        history: withHistory(state.history, entry),
    };
}

function mapCurrent(state: CalculatorState, fn: (value: number) => number): CalculatorState {
    if (state.currentValue === ERROR_VALUE) return state;
    return { ...state, currentValue: formatNumber(fn(Number.parseFloat(state.currentValue))) };
}

export function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
    switch (action.type) {
        case 'digit': return inputDigit(state, action.digit);
        case 'dot': return inputDot(state);
        case 'clear': return { ...INITIAL_CALCULATOR_STATE, history: state.history };
        case 'backspace': return backspace(state);
        case 'operator': return applyOperator(state, action.operator);
        case 'equals': return equals(state);
        case 'toggleSign': return mapCurrent(state, (v) => -v);
        case 'percent': return mapCurrent(state, (v) => v / 100);
    }
}
