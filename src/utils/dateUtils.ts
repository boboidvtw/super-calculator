// Calendar-date helpers that work in the user's local time zone.
// `new Date('YYYY-MM-DD')` is parsed as UTC midnight, which shifts the day
// in negative-offset zones, so dates are always built from their parts.

const MS_PER_DAY = 86_400_000;

/** Parses "YYYY-MM-DD" as a local calendar date; null if invalid. */
export function parseLocalDate(value: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const [year, month, day] = match.slice(1).map(Number);
    const date = new Date(year, month - 1, day);
    const valid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    return valid ? date : null;
}

/** Formats a Date as local "YYYY-MM-DD" (unlike toISOString, which is UTC). */
export function toLocalDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/** Whole calendar days from `from` to `to` (negative if `to` is earlier); DST-safe. */
export function daysBetween(from: Date, to: Date): number {
    const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((b - a) / MS_PER_DAY);
}

export function addDays(date: Date, days: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Adds years, clamping Feb 29 to Feb 28 in non-leap years. */
export function addYears(date: Date, years: number): Date {
    const targetYear = date.getFullYear() + years;
    const lastDay = new Date(targetYear, date.getMonth() + 1, 0).getDate();
    return new Date(targetYear, date.getMonth(), Math.min(date.getDate(), lastDay));
}
