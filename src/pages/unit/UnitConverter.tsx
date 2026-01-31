import { useState, useMemo } from 'react';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import { conversionTables, convertUnit, type UnitCategory } from '../../utils/unitConversion';
import { Ruler, Scale, Thermometer, Box, Grid } from 'lucide-react';
import styles from './UnitConverter.module.css';

const categories: { id: UnitCategory; icon: any; name: string }[] = [
    { id: 'length', icon: Ruler, name: 'Length' },
    { id: 'weight', icon: Scale, name: 'Weight' },
    { id: 'temperature', icon: Thermometer, name: 'Temp' },
    { id: 'volume', icon: Box, name: 'Volume' },
    { id: 'area', icon: Grid, name: 'Area' },
];

export function UnitConverter() {
    const [category, setCategory] = useState<UnitCategory>('length');
    const [amount, setAmount] = useState('0');
    const [fromUnit, setFromUnit] = useState(conversionTables['length'][0].id);
    const [toUnit, setToUnit] = useState(conversionTables['length'][1].id);

    // Update units when category changes
    const handleCategoryChange = (newCategory: UnitCategory) => {
        setCategory(newCategory);
        setFromUnit(conversionTables[newCategory][0].id);
        setToUnit(conversionTables[newCategory][1]?.id || conversionTables[newCategory][0].id);
        setAmount('0');
    };

    const handleDigit = (digit: string) => {
        setAmount(prev => prev === '0' ? digit : prev + digit);
    };

    const handleDot = () => {
        if (!amount.includes('.')) setAmount(prev => prev + '.');
    };

    const handleDelete = () => {
        setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    };

    const handleClear = () => setAmount('0');

    const result = useMemo(() => {
        const val = parseFloat(amount);
        if (isNaN(val)) return 0;
        return convertUnit(val, fromUnit, toUnit, category);
    }, [amount, fromUnit, toUnit, category]);

    const renderKeypad = () => (
        <>
            <Button variant="secondary" onClick={handleClear}>C</Button>
            <Button variant="secondary" onClick={handleDelete}>⌫</Button>
            <div className={styles.categoryGrid}>
                {categories.map(c => (
                    <button
                        key={c.id}
                        className={`${styles.catButton} ${category === c.id ? styles.active : ''}`}
                        onClick={() => handleCategoryChange(c.id)}
                    >
                        <c.icon size={16} />
                    </button>
                ))}
            </div>

            {['7', '8', '9'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
            <Button variant="primary" style={{ visibility: 'hidden' }}>{' '}</Button>

            {['4', '5', '6'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
            <Button variant="primary" style={{ visibility: 'hidden' }}>{' '}</Button>

            {['1', '2', '3'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
            <Button variant="primary" style={{ visibility: 'hidden' }}>{' '}</Button>

            <Button className="col-span-2" style={{ gridColumn: 'span 2' }} onClick={() => handleDigit('0')}>0</Button>
            <Button onClick={handleDot}>.</Button>
            <Button variant="accent" onClick={() => { }}>OK</Button>
        </>
    );

    return (
        <CalculatorLayout
            className={styles.unitLayout}
            display={
                <div className={styles.converterDisplay}>
                    <div className={styles.row}>
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            className={styles.select}
                        >
                            {conversionTables[category].map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                        <div className={styles.amount}>{amount}</div>
                    </div>
                    <div className={styles.divider}>=</div>
                    <div className={styles.row}>
                        <select
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            className={styles.select}
                        >
                            {conversionTables[category].map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                        <div className={styles.amount}>
                            {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </div>
                    </div>
                </div>
            }
            keypad={renderKeypad()}
        />
    );
}
