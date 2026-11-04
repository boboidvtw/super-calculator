import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { currencyService, parseApiResponse, readCache } from './currencyService';
import { convertCurrency } from '../hooks/useCurrency';

// Shape of https://open.er-api.com/v6/latest/USD (trimmed), captured 2026-11-04.
const API_PAYLOAD = {
    result: 'success',
    time_last_update_unix: 1793750551,
    base_code: 'USD',
    rates: { USD: 1, TWD: 32, JPY: 150 },
};

function memoryStorage() {
    const store = new Map<string, string>();
    return {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => { store.set(k, v); },
        removeItem: (k: string) => { store.delete(k); },
        clear: () => store.clear(),
    };
}

describe('parseApiResponse', () => {
    it('converts the unix timestamp to milliseconds', () => {
        const data = parseApiResponse(API_PAYLOAD);
        expect(data.updatedAt).toBe(1793750551000);
        expect(new Date(data.updatedAt).toISOString()).toBe('2026-11-04T00:02:31.000Z');
        expect(data.base).toBe('USD');
        expect(data.rates.TWD).toBe(32);
    });

    it('rejects error and malformed payloads', () => {
        expect(() => parseApiResponse({ result: 'error' })).toThrow();
        expect(() => parseApiResponse(null)).toThrow();
        expect(() => parseApiResponse({ ...API_PAYLOAD, rates: { TWD: 'x' } })).toThrow();
    });
});

describe('readCache', () => {
    it('returns null for missing or corrupted entries instead of throwing', () => {
        expect(readCache(null)).toBeNull();
        expect(readCache('{not json')).toBeNull();
        expect(readCache(JSON.stringify({ data: {}, timestamp: 1 }))).toBeNull();
    });

    it('returns a valid entry', () => {
        const entry = { data: parseApiResponse(API_PAYLOAD), timestamp: 123 };
        expect(readCache(JSON.stringify(entry))).toEqual(entry);
    });
});

describe('currencyService.getRates', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', memoryStorage());
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('fetches, caches, then serves from cache', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => API_PAYLOAD });
        vi.stubGlobal('fetch', fetchMock);

        const first = await currencyService.getRates('USD');
        const second = await currencyService.getRates('USD');

        expect(first.rates.TWD).toBe(32);
        expect(second).toEqual(first);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith('https://open.er-api.com/v6/latest/USD');
    });

    it('falls back to an expired cache when offline', async () => {
        const stale = { data: parseApiResponse(API_PAYLOAD), timestamp: 0 };
        localStorage.setItem('currency_rates_v2_USD', JSON.stringify(stale));
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));

        await expect(currencyService.getRates('USD')).resolves.toEqual(stale.data);
    });

    it('throws when offline with no cache', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
        await expect(currencyService.getRates('USD')).rejects.toThrow('HTTP 500');
    });

    it('survives a corrupted cache entry', async () => {
        localStorage.setItem('currency_rates_v2_USD', '{broken');
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => API_PAYLOAD }));
        await expect(currencyService.getRates('USD')).resolves.toMatchObject({ base: 'USD' });
    });
});

describe('convertCurrency', () => {
    const rates = { USD: 1, TWD: 32, JPY: 150 };

    it('converts through the USD base', () => {
        expect(convertCurrency(rates, 100, 'USD', 'TWD')).toBe(3200);
        expect(convertCurrency(rates, 3200, 'TWD', 'JPY')).toBe(15000);
    });

    it('returns null for unknown currencies', () => {
        expect(convertCurrency(rates, 1, 'USD', 'XXX')).toBeNull();
    });
});
