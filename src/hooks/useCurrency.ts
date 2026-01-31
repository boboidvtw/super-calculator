import { useState, useEffect } from 'react';
import { currencyService } from '../services/currencyService';

export function useCurrency() {
    const [rates, setRates] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const data = await currencyService.getRates('USD');
                setRates(data.rates);
                setLastUpdated(new Date(Number(data.date) * 1000).toLocaleDateString()); // API returns seconds or date string
                setLoading(false);
            } catch (err) {
                setError('Failed to load exchange rates');
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    const convert = (amount: number, from: string, to: string) => {
        if (!rates[from] || !rates[to]) return 0;
        // Base is USD. Convert From -> USD -> To
        const amountInUSD = amount / rates[from];
        return amountInUSD * rates[to];
    };

    return { rates, loading, error, convert, lastUpdated };
}
