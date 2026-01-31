import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react';
import styles from './Financial.module.css';

export function InsuranceCalculator() {
    const { t } = useTranslation();
    const [monthlyPay, setMonthlyPay] = useState('');
    const [years, setYears] = useState('');
    const [payout, setPayout] = useState('');
    const [result, setResult] = useState<{ irr: number; totalPaid: number; netProfit: number } | null>(null);

    const calculateIRR = () => {
        const pmt = parseFloat(monthlyPay);
        const y = parseFloat(years);
        const fv = parseFloat(payout);

        if (!pmt || !y || !fv) return;

        const months = y * 12;
        const totalPaid = pmt * months;
        const netProfit = fv - totalPaid;

        // IRR Calculation (Newton-Raphson approximation)
        // Cash flow: -PMT at t=0, 1, ..., n-1. +FV at t=n (assuming payout at end of term)
        // Equation: -PMT * ((1 - (1+r)^-n) / r) * (1+r) + FV * (1+r)^-n = 0
        // (Annuity Due: payments at beginning of period)

        // Let monthly rate = r. 
        // PV of payments (at t=0) = PMT * (1 - (1+r)^-n)/r * (1+r)
        // PV of payout (at t=0) = FV * (1+r)^-n
        // NPV = -PV_payments + PV_payout = 0

        // We want to find annual IRR. Let annual rate = R. (1+R) = (1+r)^12 => r = (1+R)^(1/12) - 1.
        // Usually we solve for monthly r first.

        let guess = 0.005; // 0.5% per month ~ 6% p.a.
        for (let i = 0; i < 20; i++) {
            const factor = Math.pow(1 + guess, -months);
            // PV of payments (Annuity Due)
            const pvPmts = pmt * ((1 - factor) / guess) * (1 + guess);
            const pvFv = fv * factor;

            const npv = -pvPmts + pvFv;

            // Derivative of NPV w.r.t guess (r)
            // d/dr ( -PMT * (1+r)/r * (1 - (1+r)^-n) + FV * (1+r)^-n )
            // This is complex. Let's use secant method or simple binary search if logical?
            // Newton is faster but derivative is messy.
            // Let's use simple iterative search or Binary Search for stability.

            if (Math.abs(npv) < 1) break; // Precision

            // Heuristic adjustment? 
            // Binary search is safer.
        }

        // Binary Search Implementation for stability
        let low = -0.01; // -1% per month
        let high = 1.0; // 100% per month
        let r = 0;

        for (let i = 0; i < 100; i++) {
            r = (low + high) / 2;
            if (r === 0) r = 0.0000001;

            // NPV calculation
            // If r is very close to 0, use simple summation: -PMT * n + FV
            let npv = 0;
            if (Math.abs(r) < 1e-9) {
                npv = -totalPaid + fv;
            } else {
                const factor = Math.pow(1 + r, -months);
                const pvPmts = pmt * ((1 - factor) / r) * (1 + r);
                const pvFv = fv * factor;
                npv = -pvPmts + pvFv;
            }

            if (Math.abs(npv) < 0.1) break;

            if (npv > 0) {
                // Rate is too low (future value isn't discounted enough to match payments)
                low = r;
            } else {
                high = r;
            }
        }

        const annualIRR = (Math.pow(1 + r, 12) - 1) * 100;

        setResult({
            irr: annualIRR,
            totalPaid,
            netProfit
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Calculator className={styles.icon} />
                    <h2>{t('insurance.title')}</h2>
                </div>

                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>{t('insurance.monthlyPay')}</label>
                        <input
                            type="number"
                            value={monthlyPay}
                            onChange={(e) => setMonthlyPay(e.target.value)}
                            placeholder="0"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t('insurance.years')}</label>
                        <input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(e.target.value)}
                            placeholder="0"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t('insurance.payout')}</label>
                        <input
                            type="number"
                            value={payout}
                            onChange={(e) => setPayout(e.target.value)}
                            placeholder="0"
                        />
                    </div>

                    <button className={styles.calculateBtn} onClick={calculateIRR}>
                        {t('insurance.calculate')}
                    </button>

                    {result && (
                        <div className={styles.result}>
                            <div className={styles.resultItem}>
                                <span>{t('insurance.result')}</span>
                                <span className={styles.resultValue}>{result.irr.toFixed(2)}%</span>
                            </div>
                            <div className={styles.resultRow}>
                                <span>{t('insurance.totalPaid')}</span>
                                <span>${result.totalPaid.toLocaleString()}</span>
                            </div>
                            <div className={styles.resultRow}>
                                <span>{t('insurance.netProfit')}</span>
                                <span className={result.netProfit >= 0 ? styles.positive : styles.negative}>
                                    ${result.netProfit.toLocaleString()}
                                </span>
                            </div>
                            <p className={styles.note}>{t('insurance.note')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
