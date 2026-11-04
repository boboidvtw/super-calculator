import { useReducer, useMemo } from 'react';
import {
    calculatorReducer,
    INITIAL_CALCULATOR_STATE,
    type Operator,
} from '../utils/calculator';

export function useCalculator() {
    const [state, dispatch] = useReducer(calculatorReducer, INITIAL_CALCULATOR_STATE);

    const actions = useMemo(() => ({
        inputDigit: (digit: string) => dispatch({ type: 'digit', digit }),
        inputDot: () => dispatch({ type: 'dot' }),
        deleteLast: () => dispatch({ type: 'backspace' }),
        clear: () => dispatch({ type: 'clear' }),
        performOperation: (operator: Operator) => dispatch({ type: 'operator', operator }),
        calculateEquals: () => dispatch({ type: 'equals' }),
        toggleSign: () => dispatch({ type: 'toggleSign' }),
        percentage: () => dispatch({ type: 'percent' }),
    }), []);

    return { state, history: state.history, ...actions };
}
