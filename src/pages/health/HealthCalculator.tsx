import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { NumPad } from '../../components/NumPad';
import { useNumericInput } from '../../hooks/useNumericInput';
import { BMI_STATUS_COLORS, bmiStatus, calculateBmi, estimateBodyFat, type Sex } from '../../utils/health';
import { toNumber } from '../../utils/numericInput';
import styles from './HealthCalculator.module.css';

type Field = 'h' | 'w' | 'a';

export function HealthCalculator() {
    const { t } = useTranslation();
    const height = useNumericInput('170', 5); // cm
    const weight = useNumericInput('65', 5); // kg
    const age = useNumericInput('25', 3);
    const [sex, setSex] = useState<Sex>('m');
    const [active, setActive] = useState<Field>('h');
    const inputs = { h: height, w: weight, a: age };

    const bmi = calculateBmi(toNumber(height.value), toNumber(weight.value));
    const status = bmi === null ? null : bmiStatus(bmi);
    const color = status ? BMI_STATUS_COLORS[status] : undefined;
    const bodyFat = estimateBodyFat(bmi, toNumber(age.value, Number.NaN), sex);

    const fields: { id: Field; label: string; value: string }[] = [
        { id: 'h', label: `${t('health.height')} (cm)`, value: height.value },
        { id: 'w', label: `${t('health.weight')} (kg)`, value: weight.value },
        { id: 'a', label: t('health.age'), value: age.value },
    ];

    return (
        <CalculatorLayout
            className={styles.layout}
            keypadLayout="stack"
            title={t('health.title')}
            description={t('health.desc')}
            display={
                <div className={styles.displayContent}>
                    <div className={styles.resultRow}>
                        <div className={styles.resultItem}>
                            <span className={styles.resultLabel}>{t('health.bmi')}</span>
                            <span className={styles.resultValue} style={{ color }}>{bmi === null ? '–' : bmi.toFixed(1)}</span>
                            {status && <span className={styles.statusLabel} style={{ color }}>{t(`health.status.${status}`)}</span>}
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.resultItem}>
                            <span className={styles.resultLabel}>{t('health.bfp')}</span>
                            <span className={styles.resultValue}>{bodyFat === null ? '–' : `${bodyFat.toFixed(1)}%`}</span>
                            <span className={styles.statusLabel}>{t('health.bfpNote')}</span>
                        </div>
                    </div>
                </div>
            }
            keypad={
                <>
                    <div className={styles.inputGrid}>
                        {fields.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                className={`${styles.inputBtn} ${active === f.id ? styles.active : ''}`}
                                onClick={() => setActive(f.id)}
                                aria-pressed={active === f.id}
                            >
                                <span className={styles.inputLabel}>{f.label}</span>
                                <span className={styles.inputValue}>{f.value}</span>
                            </button>
                        ))}
                        <div className={styles.genderToggle} role="group" aria-label={t('health.sex')}>
                            {(['m', 'f'] as const).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    className={`${styles.genderBtn} ${sex === s ? styles.activeGender : ''}`}
                                    onClick={() => setSex(s)}
                                    aria-pressed={sex === s}
                                >
                                    {t(s === 'm' ? 'health.male' : 'health.female')}
                                </button>
                            ))}
                        </div>
                    </div>
                    <NumPad input={inputs[active]} allowDecimal={active !== 'a'} />
                </>
            }
        />
    );
}
