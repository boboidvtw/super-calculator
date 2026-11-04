export const timeUtils = {
    // Convert everything to seconds, calculate, then format back
    addTime: (t1: TimeObject, t2: TimeObject): TimeObject => {
        const totalSeconds = toSeconds(t1) + toSeconds(t2);
        return fromSeconds(totalSeconds);
    },

    subtractTime: (t1: TimeObject, t2: TimeObject): TimeObject => {
        const totalSeconds = Math.max(0, toSeconds(t1) - toSeconds(t2));
        return fromSeconds(totalSeconds);
    },

    format: (t: TimeObject): string => {
        const parts = [];
        if (t.days) parts.push(`${t.days}d`);
        if (t.hours) parts.push(`${t.hours}h`);
        if (t.minutes) parts.push(`${t.minutes}m`);
        if (t.seconds) parts.push(`${t.seconds}s`);
        return parts.length > 0 ? parts.join(' ') : '0s';
    }
};

export interface TimeObject {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const toSeconds = (t: TimeObject) => {
    return t.days * 86400 + t.hours * 3600 + t.minutes * 60 + t.seconds;
};

const fromSeconds = (totalSeconds: number): TimeObject => {
    const days = Math.floor(totalSeconds / 86400);
    let remaining = totalSeconds % 86400;

    const hours = Math.floor(remaining / 3600);
    remaining %= 3600;

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    return { days, hours, minutes, seconds };
};

// Number Base Utils
const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Parses a non-negative integer in any base 2..36 with exact BigInt precision. */
function parseBigInt(value: string, base: number): bigint | null {
    const normalized = value.trim().toUpperCase();
    if (!normalized) return null;
    const bigBase = BigInt(base);
    let result = 0n;
    for (const char of normalized) {
        const digit = DIGITS.indexOf(char);
        if (digit < 0 || digit >= base) return null;
        result = result * bigBase + BigInt(digit);
    }
    return result;
}

export const numberBaseUtils = {
    /** Converts between bases; returns 'Error' for any invalid digit (e.g. "1G" in hex). */
    convert: (value: string, fromBase: number, toBase: number): string => {
        if (!value) return '';
        const parsed = parseBigInt(value, fromBase);
        if (parsed === null) return 'Error';
        return parsed.toString(toBase).toUpperCase();
    }
};

/** True when the single character `key` is a valid digit in `base` (2..16). */
export function isDigitAllowed(key: string, base: number): boolean {
    return /^[0-9A-F]$/.test(key) && Number.parseInt(key, 16) < base;
}
