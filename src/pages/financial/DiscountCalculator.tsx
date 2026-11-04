import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { NumPad } from '../../components/NumPad';
import { useNumericInput } from '../../hooks/useNumericInput';
import { discountPrice } from '../../utils/finance';
import { toNumber } from '../../utils/numericInput';
import styles from './DiscountCalculator.module.css';

export function DiscountCalculator() {
    const { t } = useTranslation();
    const price = useNumericInput('0');
    const [discountPercent, setDiscountPercent] = useState(10);

    const { saved, final } = discountPrice(toNumber(price.value), discountPercent);

    return (
        <CalculatorLayout
            className={styles.layout}
            keypadLayout="stack"
            title={t('discount.title')}
            description={t('discount.desc')}
            display={
                <div className={styles.displayContent}>
                    <div className={styles.row}>
                        <span className={styles.label}>{t('discount.price')}</span>
                        <span className={styles.value}>{price.value}</span>
                    </div>

                    <div className={styles.row}>
                        <span className={styles.label}>{t('discount.saved')}</span>
                        <span className={styles.savedValue}>-${saved.toFixed(2)}</span>
                    </div>

                    <div className={`${styles.row} ${styles.totalRow}`}>
                        <span className={styles.label}>{t('discount.final')}</span>
                        <span className={styles.finalValue}>${final.toFixed(2)}</span>
                    </div>
                </div>
            }
            keypad={
                <>
                    <div className={styles.sliderContainer}>
                        <div className={styles.sliderHeader}>
                            <label htmlFor="discount-slider">{t('discount.discount')}</label>
                            <span className={styles.percentValue}>{discountPercent}%</span>
                        </div>
                        <input
                            id="discount-slider"
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(Number.parseInt(e.target.value, 10))}
                            className={styles.slider}
                        />
                        <div className={styles.presets}>
                            {[10, 20, 30, 50, 70].map(p => (
                                <button key={p} type="button" className={styles.presetBtn} onClick={() => setDiscountPercent(p)}>{p}%</button>
                            ))}
                        </div>
                    </div>

                    <NumPad input={price} />
                </>
            }
        />
    );
}
