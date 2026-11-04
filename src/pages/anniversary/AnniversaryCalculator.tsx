import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { addDays, addYears, daysBetween, parseLocalDate, toLocalDateString } from '../../utils/dateUtils';
import styles from './AnniversaryCalculator.module.css';

export function AnniversaryCalculator() {
    const { t, i18n } = useTranslation();
    const [date, setDate] = useState(() => toLocalDateString(new Date()));

    const targetDate = parseLocalDate(date);
    const diffDays = targetDate ? daysBetween(new Date(), targetDate) : null;
    const isPast = diffDays !== null && diffDays < 0;
    const formatDate = (d: Date) => d.toLocaleDateString(i18n.language);

    return (
        <CalculatorLayout
            className={styles.anniversaryLayout}
            keypadLayout="stack"
            title={t('anniversary.title')}
            description={t('anniversary.desc')}
            display={
                <div className={styles.displayContent}>
                    <div className={styles.daysContainer}>
                        <span className={styles.daysValue}>{diffDays === null ? '–' : Math.abs(diffDays)}</span>
                        <span className={styles.daysLabel}>{t('anniversary.days')}</span>
                    </div>
                    <div className={styles.message}>
                        {diffDays === null
                            ? t('anniversary.invalid')
                            : isPast ? t('anniversary.passed') : t('anniversary.left')}
                    </div>
                </div>
            }
            keypad={
                <div className={styles.controls}>
                    <label className={styles.label} htmlFor="anniversary-date">{t('anniversary.select')}</label>
                    <input
                        id="anniversary-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={styles.dateInput}
                    />

                    {targetDate && (
                        <div className={styles.infoBox}>
                            <div className={styles.infoRow}>
                                <span>{t('anniversary.after100')}</span>
                                <span>{formatDate(addDays(targetDate, 100))}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span>{t('anniversary.after1Year')}</span>
                                <span>{formatDate(addYears(targetDate, 1))}</span>
                            </div>
                        </div>
                    )}
                </div>
            }
        />
    );
}
