import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import { useNumericInput } from '../../hooks/useNumericInput';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { conversionTables, convertUnit, type UnitCategory } from '../../utils/unitConversion';
import { toNumber } from '../../utils/numericInput';
import { Ruler, Scale, Thermometer, Box, Grid, type LucideIcon } from 'lucide-react';
import styles from './UnitConverter.module.css';

const categories: { id: UnitCategory; icon: LucideIcon }[] = [
    { id: 'length', icon: Ruler },
    { id: 'weight', icon: Scale },
    { id: 'temperature', icon: Thermometer },
    { id: 'volume', icon: Box },
    { id: 'area', icon: Grid },
];

const DIGIT_ROWS = [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3']];

export function UnitConverter() {
    const { t } = useTranslation();
    const [category, setCategory] = useState<UnitCategory>('length');
    const amount = useNumericInput('0');
    const [fromUnit, setFromUnit] = useState(conversionTables.length[0].id);
    const [toUnit, setToUnit] = useState(conversionTables.length[1].id);

    useKeyboardInput({
        onDigit: amount.inputDigit,
        onDot: amount.inputDot,
        onBackspace: amount.backspace,
        onClear: amount.clear,
    });

    const handleCategoryChange = (newCategory: UnitCategory) => {
        const units = conversionTables[newCategory];
        setCategory(newCategory);
        setFromUnit(units[0].id);
        setToUnit(units[1]?.id ?? units[0].id);
        amount.clear();
    };

    const result = useMemo(
        () => convertUnit(toNumber(amount.value), fromUnit, toUnit, category),
        [amount.value, fromUnit, toUnit, category],
    );

    const unitSelect = (value: string, onChange: (v: string) => void, label: string) => (
        <select value={value} onChange={(e) => onChange(e.target.value)} className={styles.select} aria-label={label}>
            {conversionTables[category].map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
            ))}
        </select>
    );

    const spacer = (key: string) => (
        <Button key={key} variant="primary" style={{ visibility: 'hidden' }} aria-hidden tabIndex={-1}> </Button>
    );

    return (
        <CalculatorLayout
            className={styles.unitLayout}
            title={t('unit.title')}
            description={t('unit.desc')}
            display={
                <div className={styles.converterDisplay}>
                    <div className={styles.row}>
                        {unitSelect(fromUnit, setFromUnit, t('unit.from'))}
                        <div className={styles.amount}>{amount.value}</div>
                    </div>
                    <div className={styles.divider}>=</div>
                    <div className={styles.row}>
                        {unitSelect(toUnit, setToUnit, t('unit.to'))}
                        <div className={styles.amount}>
                            {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </div>
                    </div>
                </div>
            }
            keypad={
                <>
                    <Button variant="secondary" onClick={amount.clear} aria-label={t('common.clear')}>C</Button>
                    <Button variant="secondary" onClick={amount.backspace} aria-label={t('common.delete')}>⌫</Button>
                    <div className={styles.categoryGrid} role="group" aria-label={t('unit.category')}>
                        {categories.map(c => (
                            <button
                                key={c.id}
                                type="button"
                                className={`${styles.catButton} ${category === c.id ? styles.active : ''}`}
                                onClick={() => handleCategoryChange(c.id)}
                                aria-label={t(`unit.${c.id}`)}
                                aria-pressed={category === c.id}
                                title={t(`unit.${c.id}`)}
                            >
                                <c.icon size={16} aria-hidden />
                            </button>
                        ))}
                    </div>

                    {DIGIT_ROWS.flatMap((row) => [
                        ...row.map(d => <Button key={d} onClick={() => amount.inputDigit(d)}>{d}</Button>),
                        spacer(`spacer-${row[0]}`),
                    ])}

                    <Button style={{ gridColumn: 'span 2', aspectRatio: 'auto' }} onClick={() => amount.inputDigit('0')}>0</Button>
                    <Button onClick={amount.inputDot}>.</Button>
                    {spacer('spacer-last')}
                </>
            }
        />
    );
}
