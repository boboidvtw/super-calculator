const API_KEY = 'YOUR_API_KEY'; // We will use a free endpoint without key if possible, or Open Exchange Rates
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest/';

export interface ExchangeRates {
    base: string;
    date: string;
    rates: Record<string, number>;
}

const CACHE_KEY = 'currency_rates';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const currencyService = {
    async getRates(base: string = 'USD'): Promise<ExchangeRates> {
        // Check cache first
        const cached = localStorage.getItem(`${CACHE_KEY}_${base}`);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        }

        try {
            // Using standard fetch
            const response = await fetch(`${BASE_URL}${base}`);
            if (!response.ok) throw new Error('Failed to fetch rates');

            const data = await response.json();

            // Save to cache
            localStorage.setItem(`${CACHE_KEY}_${base}`, JSON.stringify({
                data,
                timestamp: Date.now()
            }));

            return data;
        } catch (error) {
            console.error('Currency fetch error:', error);
            // Fallback to cache even if expired if fetch fails
            if (cached) {
                return JSON.parse(cached).data;
            }
            throw error;
        }
    },

    getAllCurrencies(): string[] {
        // Common currencies list (could be expanded)
        return [
            'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'TWD', 'HKD', 'AUD', 'CAD', 'SGD',
            'CHF', 'MYR', 'KRW', 'THB', 'INR', 'VND', 'PHP', 'IDR'
        ].sort();
    }
};
