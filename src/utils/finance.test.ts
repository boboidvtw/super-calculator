import { describe, it, expect } from 'vitest';
import {
    calculateInsuranceIrr,
    discountPrice,
    fuelCost,
    insuranceNetValue,
    simpleInterest,
    tipSplit,
} from './finance';

/** Payout that makes a policy earn exactly `monthlyRate` (future value of an annuity due). */
function payoutForRate(monthlyPay: number, payMonths: number, payoutMonth: number, monthlyRate: number): number {
    let fv = 0;
    for (let k = 0; k < payMonths; k++) fv += monthlyPay * Math.pow(1 + monthlyRate, payoutMonth - k);
    return fv;
}

function irrOf(monthlyPay: number, payYears: number, payoutYear: number, payout: number) {
    const result = calculateInsuranceIrr({ monthlyPay, payYears, payoutYear, payout });
    if (!result.ok) throw new Error(`expected ok, got ${result.reason}`);
    return result;
}

describe('calculateInsuranceIrr', () => {
    it('is 0% when the payout equals total premiums', () => {
        expect(irrOf(1000, 6, 6, 72_000).annualIrr).toBeCloseTo(0, 6);
    });

    it('recovers 1%/month = 12.6825% a year', () => {
        const payout = payoutForRate(1000, 72, 72, 0.01);
        expect(irrOf(1000, 6, 6, payout).annualIrr).toBeCloseTo(12.682503013197, 6);
    });

    it('recovers a deferred payout year', () => {
        const payout = payoutForRate(500, 120, 240, 0.002);
        // (1.002^12 - 1) * 100
        expect(irrOf(500, 10, 20, payout).annualIrr).toBeCloseTo(2.4266, 3);
    });

    it('handles large losses beyond the old -5%/month floor', () => {
        // -6%/month = (0.94^12 - 1) = -52.408% a year; the old code clamped this at -45.96%.
        const payout = payoutForRate(1000, 72, 72, -0.06);
        expect(irrOf(1000, 6, 6, payout).annualIrr).toBeCloseTo(-52.4079685186, 6);
    });

    it('does not overflow on 100-year policies with heavy losses', () => {
        // 1000^1200 would overflow a naive present-value formula.
        const payout = payoutForRate(1000, 600, 1200, -0.05);
        // (0.95^12 - 1) * 100
        expect(irrOf(1000, 50, 100, payout).annualIrr).toBeCloseTo(-45.9639912337, 6);
    });

    it('reports totals', () => {
        const result = irrOf(1000, 6, 6, 80_000);
        expect(result.totalPaid).toBe(72_000);
        expect(result.netProfit).toBe(8_000);
    });

    it('rejects a payout year before the end of payments', () => {
        expect(calculateInsuranceIrr({ monthlyPay: 1000, payYears: 6, payoutYear: 5, payout: 80_000 }))
            .toEqual({ ok: false, reason: 'payoutBeforePayments' });
    });

    it('rejects empty, zero or negative inputs', () => {
        for (const bad of [Number.NaN, 0, -1]) {
            expect(calculateInsuranceIrr({ monthlyPay: bad, payYears: 6, payoutYear: 6, payout: 1 }))
                .toEqual({ ok: false, reason: 'invalidInput' });
        }
    });

    it('reports no solution when the return exceeds 100% a month', () => {
        expect(calculateInsuranceIrr({ monthlyPay: 1, payYears: 1, payoutYear: 1, payout: 1e12 }))
            .toEqual({ ok: false, reason: 'noSolution' });
    });
});

describe('insuranceNetValue', () => {
    it('has the same sign on both sides of the root', () => {
        expect(insuranceNetValue(-0.01, 1000, 12, 12, 12_000)).toBeGreaterThan(0);
        expect(insuranceNetValue(0.01, 1000, 12, 12, 12_000)).toBeLessThan(0);
    });
});

describe('simpleInterest', () => {
    it('computes A = P(1 + rt)', () => {
        expect(simpleInterest(10_000, 5, 1)).toEqual({ total: 10_500, interest: 500 });
        expect(simpleInterest(1_000, 3, 2.5).total).toBeCloseTo(1_075, 10);
    });
});

describe('tipSplit', () => {
    it('splits bill plus tip', () => {
        const r = tipSplit(100, 15, 3);
        expect(r.tip).toBe(15);
        expect(r.total).toBe(115);
        expect(r.perPerson).toBeCloseTo(38.3333, 4);
    });

    it('never divides by fewer than one person', () => {
        expect(tipSplit(100, 0, 0).perPerson).toBe(100);
    });
});

describe('discountPrice', () => {
    it('subtracts the discount', () => {
        expect(discountPrice(200, 30)).toEqual({ saved: 60, final: 140 });
    });
});

describe('fuelCost', () => {
    it('computes liters and cost', () => {
        expect(fuelCost(120, 12, 30)).toEqual({ liters: 10, cost: 300 });
    });

    it('returns null for zero efficiency', () => {
        expect(fuelCost(120, 0, 30)).toBeNull();
    });
});
