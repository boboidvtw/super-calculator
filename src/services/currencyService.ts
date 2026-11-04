// Exchange rates from the keyless ExchangeRate-API open endpoint (v6),
// cached in localStorage for 24 hours.
const BASE_URL = 'https://open.er-api.com/v6/latest/';

export interface ExchangeRates {
    base: string;
    /** Unix timestamp in milliseconds of the provider's last update. */
    updatedAt: number;
    rates: Record<string, number>;
}

interface CacheEntry {
    data: ExchangeRates;
    timestamp: number;
}

const CACHE_KEY = 'currency_rates_v2';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function isRates(value: unknown): value is Record<string, number> {
    if (typeof value !== 'object' || value === null) return false;
    return Object.values(value).every((v) => typeof v === 'number' && Number.isFinite(v));
}

/** Validates the raw provider payload and maps it to ExchangeRates. */
export function parseApiResponse(payload: unknown): ExchangeRates {
    const p = payload as Record<string, unknown> | null;
    if (!p || p.result !== 'success' || typeof p.base_code !== 'string' || !isRates(p.rates)) {
        throw new Error('Unexpected exchange rate response');
    }
    const updatedSeconds = typeof p.time_last_update_unix === 'number' ? p.time_last_update_unix : Date.now() / 1000;
    return { base: p.base_code, updatedAt: updatedSeconds * 1000, rates: p.rates };
}

/** Reads a cache entry, returning null when missing or corrupted. */
export function readCache(raw: string | null): CacheEntry | null {
    if (!raw) return null;
    try {
        const entry = JSON.parse(raw) as CacheEntry;
        if (typeof entry?.timestamp !== 'number' || !isRates(entry?.data?.rates)) return null;
        return entry;
    } catch {
        return null;
    }
}

function safeStorageGet(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeStorageSet(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Storage full or disabled (private mode): rates still work without cache.
    }
}

export const currencyService = {
    async getRates(base: string = 'USD'): Promise<ExchangeRates> {
        const key = `${CACHE_KEY}_${base}`;
        const cached = readCache(safeStorageGet(key));
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }

        try {
            const response = await fetch(`${BASE_URL}${encodeURIComponent(base)}`);
            if (!response.ok) throw new Error(`Failed to fetch rates: HTTP ${response.status}`);
            const data = parseApiResponse(await response.json());
            safeStorageSet(key, JSON.stringify({ data, timestamp: Date.now() }));
            return data;
        } catch (error) {
            console.error('Currency fetch error:', error);
            // Fall back to an expired cache rather than showing nothing offline.
            if (cached) return cached.data;
            throw error;
        }
    },
};
