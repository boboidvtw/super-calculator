import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import { numberBaseUtils } from '../../utils/mathUtils';
import styles from './NumberConverter.module.css';

const bases = [
    { id: 2, name: 'BIN' },
    { id: 8, name: 'OCT' },
    { id: 10, name: 'DEC' },
    { id: 16, name: 'HEX' },
];

export function NumberConverter() {
    const { t } = useTranslation();
    const [value, setValue] = useState('0');
    const [activeBase, setActiveBase] = useState(10);

    const handleDigit = (digit: string) => {
        setValue(prev => {
            if (prev === '0' && digit !== '.') return digit;
            return prev + digit;
        });
    };

    const handleDelete = () => setValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    const handleClear = () => setValue('0');

    // Calculate all other bases
    const values = {
        2: activeBase === 2 ? value : numberBaseUtils.convert(value, activeBase, 2),
        8: activeBase === 8 ? value : numberBaseUtils.convert(value, activeBase, 8),
        10: activeBase === 10 ? value : numberBaseUtils.convert(value, activeBase, 10),
        16: activeBase === 16 ? value : numberBaseUtils.convert(value, activeBase, 16),
    };

    // Determine authorized keys based on active base
    const isKeyDisabled = (key: string) => {
        if (activeBase === 2) return !['0', '1'].includes(key);
        if (activeBase === 8) return !['0', '1', '2', '3', '4', '5', '6', '7'].includes(key);
        if (activeBase === 10) return isNaN(parseInt(key));
        // Hex allows all
        return false;
    };

    const renderKeypad = () => (
        <>
            <div className={styles.hexRow}>
                {['A', 'B', 'C', 'D', 'E', 'F'].map(char => (
                    <Button
                        key={char}
                        onClick={() => handleDigit(char)}
                        disabled={activeBase !== 16}
                        className={styles.hexBtn}
                    >
                        {char}
                    </Button>
                ))}
            </div>

            <div className={styles.grid}>
                <Button variant="secondary" onClick={handleClear}>AC</Button>
                <Button variant="secondary" onClick={handleDelete}>DEL</Button>
                <Button variant="secondary" style={{ visibility: 'hidden' }}>{' '}</Button>
                <Button variant="secondary" style={{ visibility: 'hidden' }}>{' '}</Button>

                {['7', '8', '9'].map(d => (
                    <Button key={d} onClick={() => handleDigit(d)} disabled={isKeyDisabled(d)}>{d}</Button>
                ))}
                <Button variant="primary" style={{ visibility: 'hidden' }}>{' '}</Button>

                {['4', '5', '6'].map(d => (
                    <Button key={d} onClick={() => handleDigit(d)} disabled={isKeyDisabled(d)}>{d}</Button>
                ))}
                <Button variant="primary" style={{ visibility: 'hidden' }}>{' '}</Button>

                {['1', '2', '3'].map(d => (
                    <Button key={d} onClick={() => handleDigit(d)} disabled={isKeyDisabled(d)}>{d}</Button>
                ))}
                <Button variant="primary" style={{ visibility: 'hidden' }}>{' '}</Button>

                <Button className="col-span-2" style={{ gridColumn: 'span 2' }} onClick={() => handleDigit('0')} disabled={isKeyDisabled('0')}>0</Button>
            </div>
        </>
    );

    return (
        <CalculatorLayout
            className={styles.layout}
            title={t('number.title')}
            description={t('number.desc')}
            display={
                <div className={styles.displayContent}>
                    {bases.map(b => (
                        <div
                            key={b.id}
                            className={`${styles.baseRow} ${activeBase === b.id ? styles.active : ''}`}
                            onClick={() => { setActiveBase(b.id); setValue(values[b.id as keyof typeof values]); }}
                        >
                            <span className={styles.baseLabel}>{b.name}</span>
                            <span className={styles.baseValue}>{values[b.id as keyof typeof values]}</span>
                        </div>
                    ))}
                </div>
            }
            keypad={renderKeypad()}
        />
    );
}
