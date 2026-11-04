import { useEffect, useRef } from 'react';

export interface KeyboardHandlers {
    onDigit?: (digit: string) => void;
    onDot?: () => void;
    onBackspace?: () => void;
    onClear?: () => void;
    onEnter?: () => void;
    onOperator?: (operator: '+' | '-' | '×' | '÷') => void;
    onPercent?: () => void;
}

const OPERATOR_KEYS: Record<string, '+' | '-' | '×' | '÷'> = {
    '+': '+',
    '-': '-',
    '*': '×',
    'x': '×',
    '/': '÷',
};

function isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

/** Maps physical keyboard keys to calculator handlers. */
export function useKeyboardInput(handlers: KeyboardHandlers) {
    const ref = useRef(handlers);

    useEffect(() => {
        ref.current = handlers;
    });

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            if (isEditableTarget(event.target)) return;

            const h = ref.current;
            const { key } = event;
            let handled = true;

            if (/^[0-9]$/.test(key) && h.onDigit) h.onDigit(key);
            else if ((key === '.' || key === ',') && h.onDot) h.onDot();
            else if (key === 'Backspace' && h.onBackspace) h.onBackspace();
            else if ((key === 'Escape' || key === 'Delete') && h.onClear) h.onClear();
            else if ((key === 'Enter' || key === '=') && h.onEnter) h.onEnter();
            else if (key === '%' && h.onPercent) h.onPercent();
            else if (OPERATOR_KEYS[key] && h.onOperator) h.onOperator(OPERATOR_KEYS[key]);
            else handled = false;

            if (handled) event.preventDefault();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);
}
