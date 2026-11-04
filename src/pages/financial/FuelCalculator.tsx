import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { NumPad } from '../../components/NumPad';
import { useNumericInput } from '../../hooks/useNumericInput';
import { fuelCost } from '../../utils/finance';
import { toNumber } from '../../utils/numericInput';
import styles from './FuelCalculator.module.css';

type Field = 'd' | 'e' | 'p';

export function FuelCalculator() {
    const { t } = useTranslation();
    const distance = useNumericInput('0'); // km
    const efficiency = useNumericInput('12'); // km/L
    const price = useNumericInput('30'); // per liter
    const [active, setActive] = useState<Field>('d');
    const inputs = { d: distance, e: efficiency, p: price };

    const result = fuelCost(toNumber(distance.value), toNumber(efficiency.value), toNumber(price.value));

    const fields: { id: Field; label: string; value: string }[] = [
        { id: 'd', label: `${t('fuel.distance')} (km)`, value: distance.value },
        { id: 'e', label: `${t('fuel.efficiency')} (km/L)`, value: efficiency.value },
        { id: 'p', label: `${t('fuel.price')} ($/L)`, value: price.value },
    ];

    return (
        <CalculatorLayout
            className={styles.layout}
            keypadLayout="stack"
            title={t('fuel.title')}
            description={t('fuel.desc')}
            display={
                <div className={styles.displayContent}>
                    <div className={styles.resultBox}>
                        <span className={styles.resultLabel}>{t('fuel.cost')}</span>
                        <span className={styles.resultValue}>{result ? `$${result.cost.toFixed(2)}` : '–'}</span>
                    </div>
                    <div className={styles.subResult}>
                        <span>
                            {result
                                ? `${t('fuel.fuel')}: ${result.liters.toFixed(1)} L`
                                : t('fuel.errorEfficiency')}
                        </span>
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
                    </div>
                    <NumPad input={inputs[active]} />
                </>
            }
        />
    );
}
