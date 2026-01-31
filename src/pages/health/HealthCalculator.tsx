import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import styles from './HealthCalculator.module.css';

export function HealthCalculator() {
    const { t } = useTranslation();
    const [height, setHeight] = useState('170'); // cm
    const [weight, setWeight] = useState('65'); // kg
    const [age, setAge] = useState('25');
    const [gender, setGender] = useState<'m' | 'f'>('m');
    const [activeInput, setActiveInput] = useState<'h' | 'w' | 'a'>('h');

    const h = parseFloat(height) || 0;
    const w = parseFloat(weight) || 0;

    // BMI Calculation
    const heightM = h / 100;
    const bmi = heightM > 0 ? w / (heightM * heightM) : 0;

    // BFP Calculation (U.S. Navy Method simplified or Jackson-Pollock - using simple BMI based est for demo)
    // Adult Body Fat % = (1.20 × BMI) + (0.23 × Age) − (10.8 × Sex) − 5.4 
    // Sex: 1 for men, 0 for women
    const sexFactor = gender === 'm' ? 1 : 0;
    const bfp = bmi > 0 ? (1.20 * bmi) + (0.23 * parseFloat(age)) - (10.8 * sexFactor) - 5.4 : 0;

    const getBMIStatus = (val: number) => {
        if (val < 18.5) return { label: 'Underweight', color: '#ffcc00' };
        if (val < 25) return { label: 'Normal', color: '#34c759' };
        if (val < 30) return { label: 'Overweight', color: '#ff9500' };
        return { label: 'Obese', color: '#ff3b30' };
    };

    const status = getBMIStatus(bmi);

    const handleDigit = (d: string) => {
        const setter = activeInput === 'h' ? setHeight : activeInput === 'w' ? setWeight : setAge;
        setter(prev => prev === '0' ? d : prev + d);
    };

    const handleClear = () => {
        const setter = activeInput === 'h' ? setHeight : activeInput === 'w' ? setWeight : setAge;
        setter('0');
    };

    return (
        <CalculatorLayout
            className={styles.layout}
            title={t('health.title')}
            description={t('health.desc')}
            display={
                <div className={styles.displayContent}>
                    <div className={styles.resultRow}>
                        <div className={styles.resultItem}>
                            <span className={styles.resultLabel}>BMI</span>
                            <span className={styles.resultValue} style={{ color: status.color }}>{bmi.toFixed(1)}</span>
                            <span className={styles.statusLabel} style={{ color: status.color }}>{status.label}</span>
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.resultItem}>
                            <span className={styles.resultLabel}>Body Fat</span>
                            <span className={styles.resultValue}>{bfp.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            }
            keypad={
                <>
                    <div className={styles.inputGrid}>
                        <button
                            className={`${styles.inputBtn} ${activeInput === 'h' ? styles.active : ''}`}
                            onClick={() => setActiveInput('h')}
                        >
                            <span className={styles.inputLabel}>{t('health.height', 'Height')} (cm)</span>
                            <span className={styles.inputValue}>{height}</span>
                        </button>
                        <button
                            className={`${styles.inputBtn} ${activeInput === 'w' ? styles.active : ''}`}
                            onClick={() => setActiveInput('w')}
                        >
                            <span className={styles.inputLabel}>{t('health.weight', 'Weight')} (kg)</span>
                            <span className={styles.inputValue}>{weight}</span>
                        </button>
                        <button
                            className={`${styles.inputBtn} ${activeInput === 'a' ? styles.active : ''}`}
                            onClick={() => setActiveInput('a')}
                        >
                            <span className={styles.inputLabel}>{t('health.age', 'Age')}</span>
                            <span className={styles.inputValue}>{age}</span>
                        </button>
                        <div className={styles.genderToggle}>
                            <button
                                className={`${styles.genderBtn} ${gender === 'm' ? styles.activeGender : ''}`}
                                onClick={() => setGender('m')}
                            >
                                Male
                            </button>
                            <button
                                className={`${styles.genderBtn} ${gender === 'f' ? styles.activeGender : ''}`}
                                onClick={() => setGender('f')}
                            >
                                Female
                            </button>
                        </div>
                    </div>

                    <div className={styles.numpad}>
                        {['7', '8', '9'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                        {['4', '5', '6'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                        {['1', '2', '3'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                        <Button onClick={() => handleDigit('0')} className="col-span-2" style={{ gridColumn: 'span 2' }}>0</Button>
                        <Button variant="secondary" onClick={handleClear}>C</Button>
                    </div>
                </>
            }
        />
    );
}
