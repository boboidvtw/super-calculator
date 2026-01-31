import { useState, useCallback } from 'react';

type Operator = '+' | '-' | '×' | '÷' | null;

interface CalculatorState {
    currentValue: string;
    previousValue: string | null;
    operator: Operator;
    expression: string;
    isNewNumber: boolean;
}

const INITIAL_STATE: CalculatorState = {
    currentValue: '0',
    previousValue: null,
    operator: null,
    expression: '',
    isNewNumber: true,
};

export function useCalculator() {
    const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
    const [history, setHistory] = useState<string[]>([]);

    const inputDigit = useCallback((digit: string) => {
        setState((prev) => {
            if (prev.isNewNumber) {
                return {
                    ...prev,
                    currentValue: digit,
                    isNewNumber: false,
                };
            }
            // Prevent multiple leading zeros
            if (prev.currentValue === '0' && digit === '0') return prev;
            if (prev.currentValue === '0' && digit !== '0') {
                return { ...prev, currentValue: digit };
            }
            return {
                ...prev,
                currentValue: prev.currentValue + digit,
            };
        });
    }, []);

    const inputDot = useCallback(() => {
        setState((prev) => {
            if (prev.isNewNumber) {
                return {
                    ...prev,
                    currentValue: '0.',
                    isNewNumber: false,
                };
            }
            if (prev.currentValue.includes('.')) return prev;
            return {
                ...prev,
                currentValue: prev.currentValue + '.',
            };
        });
    }, []);

    const clear = useCallback(() => {
        setState(INITIAL_STATE);
    }, []);

    const deleteLast = useCallback(() => {
        setState((prev) => {
            if (prev.isNewNumber) return prev;
            if (prev.currentValue.length === 1) {
                return { ...prev, currentValue: '0', isNewNumber: true };
            }
            return { ...prev, currentValue: prev.currentValue.slice(0, -1) };
        });
    }, []);

    const performOperation = useCallback((nextOperator: Operator) => {
        setState((prev) => {
            const inputValue = parseFloat(prev.currentValue);

            if (prev.previousValue === null) {
                return {
                    ...prev,
                    previousValue: prev.currentValue,
                    operator: nextOperator,
                    expression: `${prev.currentValue} ${nextOperator}`,
                    isNewNumber: true,
                };
            }

            if (prev.operator && !prev.isNewNumber) {
                const result = calculate(parseFloat(prev.previousValue), inputValue, prev.operator);
                const newExpression = `${result} ${nextOperator}`;

                return {
                    ...prev,
                    previousValue: String(result),
                    currentValue: String(result),
                    operator: nextOperator,
                    expression: newExpression,
                    isNewNumber: true,
                };
            }

            // If operator is changed, just update operator
            return {
                ...prev,
                operator: nextOperator,
                expression: `${prev.previousValue} ${nextOperator}`,
            };
        });
    }, []);

    const calculateEquals = useCallback(() => {
        setState((prev) => {
            if (!prev.operator || prev.previousValue === null) return prev;

            const inputValue = parseFloat(prev.currentValue);
            const result = calculate(parseFloat(prev.previousValue), inputValue, prev.operator);

            const operationString = `${prev.previousValue} ${prev.operator} ${prev.currentValue} = ${result}`;
            setHistory(h => [operationString, ...h].slice(0, 50)); // Keep last 50

            return {
                ...prev,
                previousValue: null,
                operator: null,
                currentValue: String(result),
                expression: '',
                isNewNumber: true,
            };
        });
    }, []);

    const toggleSign = useCallback(() => {
        setState((prev) => {
            const value = parseFloat(prev.currentValue);
            return {
                ...prev,
                currentValue: String(value * -1),
            };
        });
    }, []);

    const percentage = useCallback(() => {
        setState((prev) => {
            const value = parseFloat(prev.currentValue);
            return {
                ...prev,
                currentValue: String(value / 100),
            };
        });
    }, []);

    return {
        state,
        history,
        inputDigit,
        inputDot,
        deleteLast,
        clear,
        performOperation,
        calculateEquals,
        toggleSign,
        percentage
    };
}

function calculate(prev: number, current: number, operator: Operator): number {
    switch (operator) {
        case '+': return prev + current;
        case '-': return prev - current;
        case '×': return prev * current;
        case '÷': return current !== 0 ? prev / current : 0; // Avoid NaN, or handle Error
        default: return current;
    }
}
