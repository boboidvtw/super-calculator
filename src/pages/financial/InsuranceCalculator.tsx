import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react';
import styles from './Financial.module.css';

export function InsuranceCalculator() {
    const { t } = useTranslation();
    const [monthlyPay, setMonthlyPay] = useState('');
    const [years, setYears] = useState(''); // Payment years
    const [payoutYears, setPayoutYears] = useState(''); // When do we get money back?
    const [payout, setPayout] = useState('');
    const [result, setResult] = useState<{ irr: number; totalPaid: number; netProfit: number } | null>(null);
    const [error, setError] = useState('');

    // Auto-fill payout years with payment years if empty
    useEffect(() => {
        if (years && !payoutYears) {
            setPayoutYears(years);
        }
    }, [years]);

    const calculateIRR = () => {
        const pmt = parseFloat(monthlyPay);
        const yPay = parseFloat(years);
        const yOut = parseFloat(payoutYears);
        const fv = parseFloat(payout);

        setError('');

        if (!pmt || !yPay || !yOut || !fv) return;

        if (yOut < yPay) {
            setError('領回年期不能小於繳款年限');
            return;
        }

        const monthsPay = yPay * 12;
        const monthsTotal = yOut * 12; // Time of payout

        const totalPaid = pmt * monthsPay;
        const netProfit = fv - totalPaid;

        // Binary Search for IRR
        let low = -0.05; // -5% per month
        let high = 1.0; // 100% per month
        let r = 0;

        for (let i = 0; i < 100; i++) {
            r = (low + high) / 2;
            if (r === 0) r = 0.000000001;

            // NPV = -PV(Payments) + PV(Payout)
            // Payments are Annuity Due (beginning of month) for 'monthsPay' periods
            let pvPmts = 0;
            let pvFv = 0;

            if (Math.abs(r) < 1e-9) {
                // Zero interest case
                pvPmts = totalPaid;
                pvFv = fv;
            } else {
                const factorPay = Math.pow(1 + r, -monthsPay);
                const factorTotal = Math.pow(1 + r, -monthsTotal);

                // PV of Annuity Due: PMT * [ (1 - (1+r)^-n) / r ] * (1+r)
                pvPmts = pmt * ((1 - factorPay) / r) * (1 + r);

                // PV of Payout: FV * (1+r)^-N
                pvFv = fv * factorTotal;
            }

            const npv = -pvPmts + pvFv;

            if (Math.abs(npv) < 0.01) break;

            if (npv > 0) {
                // NPV > 0 means Future Value is too strong (or Payments too weak) for this rate.
                // We need a HIGHER discount rate to reduce NPV to 0.
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
                        <label>{t('insurance.payoutYears')}</label>
                        <input
                            type="number"
                            value={payoutYears}
                            onChange={(e) => setPayoutYears(e.target.value)}
                            placeholder={years || "0"}
                        />
                        {error && <span className={styles.errorText} style={{ color: 'red', fontSize: '0.8rem' }}>{error}</span>}
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
