import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { NumPad } from '../../components/NumPad';
import { useNumericInput } from '../../hooks/useNumericInput';
import { tipSplit } from '../../utils/finance';
import { toNumber } from '../../utils/numericInput';
import styles from './TipCalculator.module.css';

const MAX_PEOPLE = 99;

export function TipCalculator() {
    const { t } = useTranslation();
    const bill = useNumericInput('0');
    const [tipPercent, setTipPercent] = useState(15);
    const [people, setPeople] = useState(1);

    const { tip, total, perPerson } = tipSplit(toNumber(bill.value), tipPercent, people);

    return (
        <CalculatorLayout
            className={styles.layout}
            keypadLayout="stack"
            title={t('tip.title')}
            description={t('tip.desc')}
            display={
                <div className={styles.resultContainer}>
                    <div className={styles.inputRow}>
                        <span className={styles.label}>{t('tip.bill')}</span>
                        <span className={styles.value}>{bill.value}</span>
                    </div>

                    <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                            <span className={styles.subLabel}>{t('tip.tip')} ({tipPercent}%)</span>
                            <span className={styles.subValue}>${tip.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.subLabel}>{t('tip.total')}</span>
                            <span className={styles.subValue}>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className={styles.finalRow}>
                        <span className={styles.finalLabel}>{t('tip.perPerson')}</span>
                        <span className={styles.finalValue}>${perPerson.toFixed(2)}</span>
                    </div>
                </div>
            }
            keypad={
                <>
                    <div className={styles.controlRow}>
                        <span className={styles.controlLabel}>{t('tip.tip')} %</span>
                        <div className={styles.percentGrid}>
                            {[10, 15, 18, 20].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    className={`${styles.pillBtn} ${tipPercent === p ? styles.active : ''}`}
                                    onClick={() => setTipPercent(p)}
                                    aria-pressed={tipPercent === p}
                                >
                                    {p}%
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.controlRow}>
                        <span className={styles.controlLabel}>{t('tip.split')}</span>
                        <div className={styles.splitControl}>
                            <button type="button" className={styles.circleBtn} aria-label={t('tip.fewer')} onClick={() => setPeople(p => Math.max(1, p - 1))}>-</button>
                            <span className={styles.peopleCount} aria-live="polite">{people}</span>
                            <button type="button" className={styles.circleBtn} aria-label={t('tip.more')} onClick={() => setPeople(p => Math.min(MAX_PEOPLE, p + 1))}>+</button>
                        </div>
                    </div>

                    <NumPad input={bill} />
                </>
            }
        />
    );
}
