// Pure financial formulas used by the financial calculators.

export interface InsuranceInput {
    monthlyPay: number;
    payYears: number;
    payoutYear: number;
    payout: number;
}

export type InsuranceResult =
    | { ok: true; annualIrr: number; totalPaid: number; netProfit: number }
    | { ok: false; reason: 'invalidInput' | 'payoutBeforePayments' | 'noSolution' };

// Monthly rate search bracket: -99.9% to +100% per month.
const MIN_MONTHLY_RATE = -0.999;
const MAX_MONTHLY_RATE = 1;
const MAX_ITERATIONS = 200;
const RATE_TOLERANCE = 1e-12;

/**
 * Net value of the policy at monthly rate r, with the same sign as its NPV.
 * Payments are made at the start of months 0..payMonths-1 (annuity due),
 * and the payout is received at month payoutMonth.
 *
 * For r >= 0 this is the present value at month 0; for r < 0 it is the
 * future value at payoutMonth. Both differ only by the positive factor
 * (1+r)^payoutMonth, and each form keeps every power <= 1 so long policies
 * never overflow to Infinity.
 */
export function insuranceNetValue(r: number, monthlyPay: number, payMonths: number, payoutMonth: number, payout: number): number {
    let payments = 0;
    if (r >= 0) {
        const discount = 1 / (1 + r);
        let factor = 1;
        for (let k = 0; k < payMonths; k++) {
            payments += monthlyPay * factor;
            factor *= discount;
        }
        return payout * Math.pow(discount, payoutMonth) - payments;
    }
    for (let k = 0; k < payMonths; k++) {
        payments += monthlyPay * Math.pow(1 + r, payoutMonth - k);
    }
    return payout - payments;
}

/**
 * Annualised IRR of a savings-insurance policy, found by bisection.
 * Outflows precede a single inflow, so NPV(r) has exactly one root.
 */
export function calculateInsuranceIrr(input: InsuranceInput): InsuranceResult {
    const { monthlyPay, payYears, payoutYear, payout } = input;
    const values = [monthlyPay, payYears, payoutYear, payout];
    if (values.some((v) => !Number.isFinite(v) || v <= 0)) {
        return { ok: false, reason: 'invalidInput' };
    }
    if (payoutYear < payYears) return { ok: false, reason: 'payoutBeforePayments' };

    const payMonths = Math.round(payYears * 12);
    const payoutMonth = Math.round(payoutYear * 12);
    const totalPaid = monthlyPay * payMonths;
    const npv = (r: number) => insuranceNetValue(r, monthlyPay, payMonths, payoutMonth, payout);

    let low = MIN_MONTHLY_RATE;
    let high = MAX_MONTHLY_RATE;
    // NPV decreases as r increases: positive at low, negative at high when a root exists.
    if (npv(low) < 0 || npv(high) > 0) return { ok: false, reason: 'noSolution' };

    for (let i = 0; i < MAX_ITERATIONS && high - low > RATE_TOLERANCE; i++) {
        const mid = (low + high) / 2;
        if (npv(mid) > 0) low = mid;
        else high = mid;
    }

    const monthly = (low + high) / 2;
    return {
        ok: true,
        annualIrr: (Math.pow(1 + monthly, 12) - 1) * 100,
        totalPaid,
        netProfit: payout - totalPaid,
    };
}

/** Simple interest: A = P(1 + rt), rate in percent per year. */
export function simpleInterest(principal: number, ratePercent: number, years: number) {
    const total = principal * (1 + (ratePercent / 100) * years);
    return { total, interest: total - principal };
}

export function tipSplit(bill: number, tipPercent: number, people: number) {
    const tip = bill * (tipPercent / 100);
    const total = bill + tip;
    const safePeople = Math.max(1, Math.floor(people));
    return { tip, total, perPerson: total / safePeople };
}

export function discountPrice(original: number, discountPercent: number) {
    const saved = original * (discountPercent / 100);
    return { saved, final: original - saved };
}

/** Returns null when efficiency is not positive (division by zero). */
export function fuelCost(distanceKm: number, kmPerLiter: number, pricePerLiter: number) {
    if (!(kmPerLiter > 0)) return null;
    const liters = distanceKm / kmPerLiter;
    return { liters, cost: liters * pricePerLiter };
}
