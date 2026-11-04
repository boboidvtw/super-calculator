import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { NumPad } from '../../components/NumPad';
import { useNumericInput } from '../../hooks/useNumericInput';
import { simpleInterest } from '../../utils/finance';
import { toNumber } from '../../utils/numericInput';
import styles from './InterestCalculator.module.css';

type Field = 'p' | 'r' | 'y';

export function InterestCalculator() {
    const { t } = useTranslation();
    const principal = useNumericInput('10000');
    const rate = useNumericInput('5');
    const years = useNumericInput('1');
    const [active, setActive] = useState<Field>('p');
    const inputs = { p: principal, r: rate, y: years };

    const { total, interest } = simpleInterest(toNumber(principal.value), toNumber(rate.value), toNumber(years.value));

    const fieldButton = (field: Field, label: string, display: string) => (
        <button
            type="button"
            className={`${styles.inputGroup} ${active === field ? styles.active : ''}`}
            onClick={() => setActive(field)}
            aria-pressed={active === field}
        >
            <span className={styles.fieldLabel}>{label}</span>
            <span className={styles.valueDisplay}>{display}</span>
        </button>
    );

    return (
        <CalculatorLayout
            className={styles.layout}
            keypadLayout="stack"
            title={t('interest.title')}
            description={t('interest.desc')}
            display={
                <div className={styles.displayContent}>
                    <div className={styles.summaryBox}>
                        <div className={styles.summaryRow}>
                            <span>{t('interest.total')}</span>
                            <span className={styles.totalValue}>${total.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>{t('interest.interest')}</span>
                            <span className={styles.interestValue}>+${interest.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            }
            keypad={
                <>
                    <div className={styles.formContainer}>
                        {fieldButton('p', t('interest.principal'), `$${principal.value}`)}
                        <div className={styles.row}>
                            {fieldButton('r', `${t('interest.rate')} (%)`, `${rate.value}%`)}
                            {fieldButton('y', t('interest.years'), years.value)}
                        </div>
                    </div>
                    <NumPad input={inputs[active]} />
                </>
            }
        />
    );
}
