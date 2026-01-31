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
export const numberBaseUtils = {
    convert: (value: string, fromBase: number, toBase: number): string => {
        if (!value) return '';
        try {
            const decimal = parseInt(value, fromBase);
            if (isNaN(decimal)) return 'Error';
            return decimal.toString(toBase).toUpperCase();
        } catch {
            return 'Error';
        }
    }
};
