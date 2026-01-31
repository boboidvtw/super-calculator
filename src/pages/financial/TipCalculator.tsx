import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import styles from './TipCalculator.module.css';

export function TipCalculator() {
    const { t } = useTranslation();
    const [billAmount, setBillAmount] = useState('0');
    const [tipPercent, setTipPercent] = useState(15);
    const [people, setPeople] = useState(1);

    const bill = parseFloat(billAmount) || 0;
    const tipAmount = bill * (tipPercent / 100);
    const totalAmount = bill + tipAmount;
    const perPerson = totalAmount / people;

    const handleDigit = (d: string) => {
        setBillAmount(prev => prev === '0' ? d : prev + d);
    };

    const handleDot = () => {
        if (!billAmount.includes('.')) setBillAmount(prev => prev + '.');
    };

    const handleDelete = () => setBillAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    const handleClear = () => setBillAmount('0');

    return (
        <CalculatorLayout
            className={styles.layout}
            title={t('tip.title')}
            description={t('tip.desc')}
            display={
                <div className={styles.resultContainer}>
                    <div className={styles.inputRow}>
                        <span className={styles.label}>{t('tip.bill', 'Bill')}</span>
                        <span className={styles.value}>{billAmount}</span>
                    </div>

                    <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                            <span className={styles.subLabel}>{t('tip.tip', 'Tip')} ({tipPercent}%)</span>
                            <span className={styles.subValue}>${tipAmount.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.subLabel}>{t('tip.total', 'Total')}</span>
                            <span className={styles.subValue}>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className={styles.finalRow}>
                        <span className={styles.finalLabel}>{t('tip.perPerson', 'Per Person')}</span>
                        <span className={styles.finalValue}>${perPerson.toFixed(2)}</span>
                    </div>
                </div>
            }
            keypad={
                <>
                    {/* Tip Controls */}
                    <div className={styles.controlRow}>
                        <span className={styles.controlLabel}>{t('tip.tip', 'Tip')} %</span>
                        <div className={styles.percentGrid}>
                            {[10, 15, 18, 20].map(p => (
                                <button
                                    key={p}
                                    className={`${styles.pillBtn} ${tipPercent === p ? styles.active : ''}`}
                                    onClick={() => setTipPercent(p)}
                                >
                                    {p}%
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Split Controls */}
                    <div className={styles.controlRow}>
                        <span className={styles.controlLabel}>{t('tip.split', 'Split')}</span>
                        <div className={styles.splitControl}>
                            <button className={styles.circleBtn} onClick={() => setPeople(Math.max(1, people - 1))}>-</button>
                            <span className={styles.peopleCount}>{people}</span>
                            <button className={styles.circleBtn} onClick={() => setPeople(people + 1)}>+</button>
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
