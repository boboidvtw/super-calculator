import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import styles from './FuelCalculator.module.css';

export function FuelCalculator() {
    const { t } = useTranslation();
    const [distance, setDistance] = useState('0'); // km
    const [efficiency, setEfficiency] = useState('12'); // km/l
    const [price, setPrice] = useState('30'); // per liter
    const [activeInput, setActiveInput] = useState<'d' | 'e' | 'p'>('d');

    const d = parseFloat(distance) || 0;
    const e = parseFloat(efficiency) || 1;
    const p = parseFloat(price) || 0;

    const fuelNeeded = d / e;
    const totalCost = fuelNeeded * p;

    const handleDigit = (digit: string) => {
        const setter = activeInput === 'd' ? setDistance : activeInput === 'e' ? setEfficiency : setPrice;
        setter(prev => prev === '0' ? digit : prev + digit);
    };

    const handleDot = () => {
        const setter = activeInput === 'd' ? setDistance : activeInput === 'e' ? setEfficiency : setPrice;
        const current = activeInput === 'd' ? distance : activeInput === 'e' ? efficiency : price;
        if (!current.includes('.')) setter(prev => prev + '.');
    };

    const handleClear = () => {
        const setter = activeInput === 'd' ? setDistance : activeInput === 'e' ? setEfficiency : setPrice;
        setter('0');
    };

    return (
        <CalculatorLayout
            className={styles.layout}
            display={
                <div className={styles.displayContent}>
                    <div className={styles.resultBox}>
                        <span className={styles.resultLabel}>{t('fuel.cost', 'Estimated Cost')}</span>
                        <span className={styles.resultValue}>${totalCost.toFixed(2)}</span>
                    </div>
                    <div className={styles.subResult}>
                        <span>{t('fuel.fuel', 'Fuel Needed')}: {fuelNeeded.toFixed(1)} L</span>
                    </div>
                </div>
            }
            keypad={
                <>
                    <div className={styles.inputGrid}>
                        <button
                            className={`${styles.inputBtn} ${activeInput === 'd' ? styles.active : ''}`}
                            onClick={() => setActiveInput('d')}
                        >
                            <span className={styles.inputLabel}>{t('fuel.distance', 'Distance')} (km)</span>
                            <span className={styles.inputValue}>{distance}</span>
                        </button>
                        <button
                            className={`${styles.inputBtn} ${activeInput === 'e' ? styles.active : ''}`}
                            onClick={() => setActiveInput('e')}
                        >
                            <span className={styles.inputLabel}>{t('fuel.efficiency', 'Efficiency')} (km/L)</span>
                            <span className={styles.inputValue}>{efficiency}</span>
                        </button>
                        <button
                            className={`${styles.inputBtn} ${activeInput === 'p' ? styles.active : ''}`}
                            onClick={() => setActiveInput('p')}
                        >
                            <span className={styles.inputLabel}>{t('fuel.price', 'Price')} ($/L)</span>
                            <span className={styles.inputValue}>{price}</span>
                        </button>
                    </div>

                    <div className={styles.numpad}>
                        {['7', '8', '9'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                        {['4', '5', '6'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                        {['1', '2', '3'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                        <Button onClick={() => handleDigit('0')} className="col-span-2" style={{ gridColumn: 'span 2' }}>0</Button>
                        <Button onClick={handleDot}>.</Button>
                        <Button variant="secondary" onClick={handleClear}>C</Button>
                    </div>
                </>
            }
        />
    );
}
