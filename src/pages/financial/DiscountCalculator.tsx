import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import styles from './DiscountCalculator.module.css';

export function DiscountCalculator() {
    const { t } = useTranslation();
    const [originalPrice, setOriginalPrice] = useState('0');
    const [discountPercent, setDiscountPercent] = useState(10);

    const original = parseFloat(originalPrice) || 0;
    const savedAmount = original * (discountPercent / 100);
    const finalPrice = original - savedAmount;

    const handleDigit = (d: string) => {
        setOriginalPrice(prev => prev === '0' ? d : prev + d);
    };

    const handleDot = () => {
        if (!originalPrice.includes('.')) setOriginalPrice(prev => prev + '.');
    };

    const handleDelete = () => setOriginalPrice(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    const handleClear = () => setOriginalPrice('0');

    return (
        <CalculatorLayout
            className={styles.layout}
            display={
                <div className={styles.displayContent}>
                    <div className={styles.row}>
                        <span className={styles.label}>{t('discount.price', 'Original Price')}</span>
                        <span className={styles.value}>{originalPrice}</span>
                    </div>

                    <div className={styles.row}>
                        <span className={styles.label}>{t('discount.saved', 'You Save')}</span>
                        <span className={styles.savedValue}>-${savedAmount.toFixed(2)}</span>
                    </div>

                    <div className={`${styles.row} ${styles.totalRow}`}>
                        <span className={styles.label}>{t('discount.final', 'Final Price')}</span>
                        <span className={styles.finalValue}>${finalPrice.toFixed(2)}</span>
                    </div>
                </div>
            }
            keypad={
                <>
                    <div className={styles.sliderContainer}>
                        <div className={styles.sliderHeader}>
                            <span>{t('discount.discount', 'Discount')}</span>
                            <span className={styles.percentValue}>{discountPercent}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
                            className={styles.slider}
                        />
                        <div className={styles.presets}>
                            {[10, 20, 30, 50, 70].map(p => (
                                <button key={p} className={styles.presetBtn} onClick={() => setDiscountPercent(p)}>{p}%</button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.numpad}>
                        <Button variant="secondary" onClick={handleClear}>C</Button>
                        <Button variant="secondary" onClick={handleDelete}>⌫</Button>
                        <Button variant="secondary" style={{ visibility: 'hidden' }}> </Button>

                        {['7', '8', '9'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                        {['4', '5', '6'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                        {['1', '2', '3'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}

                        <Button onClick={() => handleDigit('0')} className="col-span-2" style={{ gridColumn: 'span 2' }}>0</Button>
                        <Button onClick={handleDot}>.</Button>
                    </div>
                </>
            }
        />
    );
}
