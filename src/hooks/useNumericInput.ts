import { useState, useMemo } from 'react';
import { appendDigit, appendDot, removeLast, DEFAULT_MAX_LENGTH } from '../utils/numericInput';

export interface NumericInput {
    value: string;
    inputDigit: (digit: string) => void;
    inputDot: () => void;
    backspace: () => void;
    clear: () => void;
}

/** State for one keypad-driven number field, with a length cap. */
export function useNumericInput(initial = '0', maxLength = DEFAULT_MAX_LENGTH): NumericInput {
    const [value, setValue] = useState(initial);

    const actions = useMemo(() => ({
        inputDigit: (digit: string) => setValue((prev) => appendDigit(prev, digit, maxLength)),
        inputDot: () => setValue(appendDot),
        backspace: () => setValue(removeLast),
        clear: () => setValue('0'),
    }), [maxLength]);

    return { value, ...actions };
}
