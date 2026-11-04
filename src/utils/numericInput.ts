// Pure string-editing rules shared by every on-screen numeric keypad.

export const DEFAULT_MAX_LENGTH = 12;

export function appendDigit(value: string, digit: string, maxLength = DEFAULT_MAX_LENGTH): string {
    if (value === '0') return digit;
    if (value.replace('.', '').length >= maxLength) return value;
    return value + digit;
}

export function appendDot(value: string): string {
    return value.includes('.') ? value : `${value}.`;
}

export function removeLast(value: string): string {
    return value.length > 1 ? value.slice(0, -1) : '0';
}

/** Parses keypad text; returns `fallback` for empty or invalid input. */
export function toNumber(value: string, fallback = 0): number {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
}
