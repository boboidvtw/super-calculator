import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react';
import { calculateInsuranceIrr, type InsuranceResult } from '../../utils/finance';
import styles from './Financial.module.css';

const ERROR_KEYS = {
    invalidInput: 'insurance.errorInvalid',
    payoutBeforePayments: 'insurance.errorPayoutBeforePay',
    noSolution: 'insurance.errorNoSolution',
} as const;

export function InsuranceCalculator() {
    const { t, i18n } = useTranslation();
    const [monthlyPay, setMonthlyPay] = useState('');
    const [years, setYears] = useState('');
    const [payoutYears, setPayoutYears] = useState('');
    const [payout, setPayout] = useState('');
    const [result, setResult] = useState<InsuranceResult | null>(null);

    // Payout year defaults to the end of the payment term when left blank.
    const effectivePayoutYears = payoutYears || years;
    const formatMoney = (n: number) => n.toLocaleString(i18n.language, { maximumFractionDigits: 2 });

    const handleCalculate = () => {
        setResult(calculateInsuranceIrr({
            monthlyPay: Number.parseFloat(monthlyPay),
            payYears: Number.parseFloat(years),
            payoutYear: Number.parseFloat(effectivePayoutYears),
            payout: Number.parseFloat(payout),
        }));
    };

    const fields = [
        { id: 'monthlyPay', label: t('insurance.monthlyPay'), value: monthlyPay, set: setMonthlyPay, placeholder: '0' },
        { id: 'years', label: t('insurance.years'), value: years, set: setYears, placeholder: '0' },
        { id: 'payoutYears', label: t('insurance.payoutYears'), value: payoutYears, set: setPayoutYears, placeholder: years || '0' },
        { id: 'payout', label: t('insurance.payout'), value: payout, set: setPayout, placeholder: '0' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Calculator className={styles.icon} />
                    <h2>{t('insurance.title')}</h2>
                    <p className={styles.description}>{t('insurance.desc')}</p>
                </div>

                <div className={styles.form}>
                    {fields.map((f) => (
                        <div key={f.id} className={styles.inputGroup}>
                            <label htmlFor={`insurance-${f.id}`}>{f.label}</label>
                            <input
                                id={`insurance-${f.id}`}
                                type="number"
                                inputMode="decimal"
                                min="0"
                                value={f.value}
                                onChange={(e) => f.set(e.target.value)}
                                placeholder={f.placeholder}
                            />
                        </div>
                    ))}

                    <button className={styles.calculateBtn} onClick={handleCalculate}>
                        {t('insurance.calculate')}
                    </button>

                    {result && !result.ok && (
                        <p className={styles.errorText} role="alert">{t(ERROR_KEYS[result.reason])}</p>
                    )}

                    {result?.ok && (
                        <div className={styles.result}>
                            <div className={styles.resultItem}>
                                <span>{t('insurance.result')}</span>
                                <span className={styles.resultValue}>{result.annualIrr.toFixed(2)}%</span>
                            </div>
                            <div className={styles.resultRow}>
                                <span>{t('insurance.totalPaid')}</span>
                                <span>${formatMoney(result.totalPaid)}</span>
                            </div>
                            <div className={styles.resultRow}>
                                <span>{t('insurance.netProfit')}</span>
                                <span className={result.netProfit >= 0 ? styles.positive : styles.negative}>
                                    ${formatMoney(result.netProfit)}
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
