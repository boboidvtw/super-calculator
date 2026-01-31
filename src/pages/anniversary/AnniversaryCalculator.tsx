import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import styles from './AnniversaryCalculator.module.css';

export function AnniversaryCalculator() {
    const { t } = useTranslation();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const targetDate = new Date(date);
    const today = new Date();

    // Reset time part for accurate day calc
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(targetDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isPast = targetDate < today;

    return (
        <CalculatorLayout
            className={styles.layout}
            display={
                <div className={styles.displayContent}>
                    <div className={styles.daysContainer}>
                        <span className={styles.daysValue}>{diffDays}</span>
                        <span className={styles.daysLabel}>{t('anniversary.days', 'Days')}</span>
                    </div>
                    <div className={styles.message}>
                        {isPast ? t('anniversary.passed', 'Passed since') : t('anniversary.left', 'Left until')}
                    </div>
                </div>
            }
            keypad={
                <div className={styles.controls}>
                    <label className={styles.label}>{t('anniversary.select', 'Select Date')}</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={styles.dateInput}
                    />

                    <div className={styles.infoBox}>
                        <div className={styles.infoRow}>
                            <span>100 Days</span>
                            <span>{new Date(targetDate.getTime() + 100 * 86400000).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span>1 Year</span>
                            <span>{new Date(targetDate.getFullYear() + 1, targetDate.getMonth(), targetDate.getDate()).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            }
        />
    );
}
