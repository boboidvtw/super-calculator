import { useState, useEffect, useCallback } from 'react';
import { currencyService } from '../services/currencyService';

/** Converts via the USD base: from -> USD -> to. Returns null for unknown codes. */
export function convertCurrency(rates: Record<string, number>, amount: number, from: string, to: string): number | null {
    if (!rates[from] || !rates[to] || !Number.isFinite(amount)) return null;
    return (amount / rates[from]) * rates[to];
}

export function useCurrency() {
    const [rates, setRates] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [updatedAt, setUpdatedAt] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        currencyService.getRates('USD')
            .then((data) => {
                if (cancelled) return;
                setRates(data.rates);
                setUpdatedAt(data.updatedAt);
            })
            .catch(() => {
                if (!cancelled) setError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    const convert = useCallback(
        (amount: number, from: string, to: string) => convertCurrency(rates, amount, from, to),
        [rates],
    );

    return { rates, loading, error, convert, updatedAt };
}
