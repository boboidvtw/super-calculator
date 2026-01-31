import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import styles from './InterestCalculator.module.css';

export function InterestCalculator() {
    const { t } = useTranslation();
    const [principal, setPrincipal] = useState('10000');
    const [rate, setRate] = useState('5');
    const [years, setYears] = useState('1');
    const [activeInput, setActiveInput] = useState<'p' | 'r' | 'y'>('p');

    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) || 0;
    const y = parseFloat(years) || 0;

    // Simple Interest Formula: A = P(1 + rt)
    const totalSimple = p * (1 + (r / 100) * y);
    const interestSimple = totalSimple - p;

    const handleDigit = (digit: string) => {
        const setter = activeInput === 'p' ? setPrincipal : activeInput === 'r' ? setRate : setYears;
        setter(prev => prev === '0' ? digit : prev + digit);
    };

    const handleDot = () => {
        const setter = activeInput === 'p' ? setPrincipal : activeInput === 'r' ? setRate : setYears;
        const current = activeInput === 'p' ? principal : activeInput === 'r' ? rate : years;
        if (!current.includes('.')) setter(prev => prev + '.');
    };

    const handleClear = () => {
        const setter = activeInput === 'p' ? setPrincipal : activeInput === 'r' ? setRate : setYears;
        setter('0');
    };

    return (
        <CalculatorLayout
            className={styles.layout}
            title={t('interest.title')}
            description={t('interest.desc')}
            display={
                <div className={styles.displayContent}>
                    <div className={styles.summaryBox}>
                        <div className={styles.summaryRow}>
                            <span>{t('interest.total', 'Total Balance')}</span>
                            <span className={styles.totalValue}>${totalSimple.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>{t('interest.interest', 'Interest Earned')}</span>
                            <span className={styles.interestValue}>+${interestSimple.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            }
            keypad={
                <>
                    <div className={styles.formContainer}>
                        <button className={`${styles.inputGroup} ${activeInput === 'p' ? styles.active : ''}`} onClick={() => setActiveInput('p')}>
                            <label>{t('interest.principal', 'Principal')}</label>
                            <div className={styles.valueDisplay}>${principal}</div>
                        </button>
                        <div className={styles.row}>
                            <button className={`${styles.inputGroup} ${activeInput === 'r' ? styles.active : ''}`} onClick={() => setActiveInput('r')}>
                                <label>{t('interest.rate', 'Rate')} (%)</label>
                                <div className={styles.valueDisplay}>{rate}%</div>
                            </button>
                            <button className={`${styles.inputGroup} ${activeInput === 'y' ? styles.active : ''}`} onClick={() => setActiveInput('y')}>
                                <label>{t('interest.years', 'Years')}</label>
                                <div className={styles.valueDisplay}>{years}</div>
                            </button>
                        </div>
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
