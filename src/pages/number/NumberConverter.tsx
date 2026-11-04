import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import { isDigitAllowed, numberBaseUtils } from '../../utils/mathUtils';
import styles from './NumberConverter.module.css';

const BASES = [
    { id: 2, name: 'BIN' },
    { id: 8, name: 'OCT' },
    { id: 10, name: 'DEC' },
    { id: 16, name: 'HEX' },
] as const;

type Base = typeof BASES[number]['id'];

const HEX_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const DIGIT_ROWS = [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3']];
const MAX_LENGTH = 64;

export function NumberConverter() {
    const { t } = useTranslation();
    const [value, setValue] = useState('0');
    const [activeBase, setActiveBase] = useState<Base>(10);

    const handleDigit = (digit: string) => {
        if (!isDigitAllowed(digit, activeBase)) return;
        setValue(prev => {
            if (prev === '0') return digit;
            return prev.length >= MAX_LENGTH ? prev : prev + digit;
        });
    };

    const handleDelete = () => setValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    const handleClear = () => setValue('0');

    const valueIn = (base: Base) => base === activeBase ? value : numberBaseUtils.convert(value, activeBase, base);

    const selectBase = (base: Base) => {
        const converted = valueIn(base);
        setActiveBase(base);
        setValue(converted === 'Error' || converted === '' ? '0' : converted);
    };

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            const key = event.key.toUpperCase();
            if (key === 'BACKSPACE') handleDelete();
            else if (key === 'ESCAPE' || key === 'DELETE') handleClear();
            else if (key.length === 1) handleDigit(key);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    });

    const spacer = (key: string, variant: 'primary' | 'secondary' = 'primary') => (
        <Button key={key} variant={variant} style={{ visibility: 'hidden' }} aria-hidden tabIndex={-1}>{' '}</Button>
    );

    return (
        <CalculatorLayout
            className={styles.layout}
            keypadLayout="stack"
            title={t('number.title')}
            description={t('number.desc')}
            display={
                <div className={styles.displayContent} role="radiogroup" aria-label={t('number.base')}>
                    {BASES.map(b => (
                        <button
                            key={b.id}
                            type="button"
                            role="radio"
                            aria-checked={activeBase === b.id}
                            className={`${styles.baseRow} ${activeBase === b.id ? styles.active : ''}`}
                            onClick={() => selectBase(b.id)}
                        >
                            <span className={styles.baseLabel}>{b.name}</span>
                            <span className={styles.baseValue}>{valueIn(b.id)}</span>
                        </button>
                    ))}
                </div>
            }
            keypad={
                <>
                    <div className={styles.hexRow}>
                        {HEX_LETTERS.map(char => (
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
                        <Button variant="secondary" onClick={handleDelete} aria-label={t('common.delete')}>DEL</Button>
                        {spacer('s1', 'secondary')}
                        {spacer('s2', 'secondary')}

                        {DIGIT_ROWS.flatMap((row) => [
                            ...row.map(d => (
                                <Button key={d} onClick={() => handleDigit(d)} disabled={!isDigitAllowed(d, activeBase)}>{d}</Button>
                            )),
                            spacer(`spacer-${row[0]}`),
                        ])}

                        <Button style={{ gridColumn: 'span 2', aspectRatio: 'auto' }} onClick={() => handleDigit('0')}>0</Button>
                    </div>
                </>
            }
        />
    );
}
