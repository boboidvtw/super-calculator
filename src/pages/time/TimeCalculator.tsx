import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { timeUtils, type TimeObject } from '../../utils/mathUtils';
import styles from './TimeCalculator.module.css';

const INITIAL_TIME: TimeObject = { days: 0, hours: 0, minutes: 0, seconds: 0 };
const MAX_UNIT_DIGITS = 5;

export function TimeCalculator() {
    const { t } = useTranslation();
    const [time1, setTime1] = useState<TimeObject>(INITIAL_TIME);
    const [time2, setTime2] = useState<TimeObject>(INITIAL_TIME);
    const [operation, setOperation] = useState<'+' | '-'>('+');
    const [activeField, setActiveField] = useState<'t1' | 't2'>('t1');
    const [activeUnit, setActiveUnit] = useState<keyof TimeObject>('hours');

    const result = operation === '+'
        ? timeUtils.addTime(time1, time2)
        : timeUtils.subtractTime(time1, time2);

    const handleDigit = (digit: string) => {
        const setter = activeField === 't1' ? setTime1 : setTime2;
        setter(prev => {
            const currentVal = prev[activeUnit].toString();
            if (currentVal !== '0' && currentVal.length >= MAX_UNIT_DIGITS) return prev;
            const newVal = Number.parseInt(currentVal === '0' ? digit : currentVal + digit, 10);
            return { ...prev, [activeUnit]: newVal };
        });
    };

    const clear = () => {
        const setter = activeField === 't1' ? setTime1 : setTime2;
        setter(prev => ({ ...prev, [activeUnit]: 0 }));
    };

    const clearAll = () => {
        setTime1(INITIAL_TIME);
        setTime2(INITIAL_TIME);
    };

    const backspace = () => {
        const setter = activeField === 't1' ? setTime1 : setTime2;
        setter(prev => {
            const currentVal = prev[activeUnit].toString();
            const next = currentVal.length > 1 ? Number.parseInt(currentVal.slice(0, -1), 10) : 0;
            return { ...prev, [activeUnit]: next };
        });
    };

    useKeyboardInput({ onDigit: handleDigit, onBackspace: backspace, onClear: clear });

    const renderUnitInput = (label: string, field: 't1' | 't2', unit: keyof TimeObject, value: number) => (
        <button
            type="button"
            className={`${styles.unitBox} ${activeField === field && activeUnit === unit ? styles.active : ''}`}
            onClick={() => { setActiveField(field); setActiveUnit(unit); }}
            aria-pressed={activeField === field && activeUnit === unit}
        >
            <span className={styles.unitValue}>{value}</span>
            <span className={styles.unitLabel}>{label}</span>
            {activeField === field && activeUnit === unit && <span className={styles.indicator} />}
        </button>
    );

    const renderTimeRow = (field: 't1' | 't2', time: TimeObject) => (
        <div className={styles.timeRow}>
            {renderUnitInput('D', field, 'days', time.days)}
            <span className={styles.colon}>:</span>
            {renderUnitInput('H', field, 'hours', time.hours)}
            <span className={styles.colon}>:</span>
            {renderUnitInput('M', field, 'minutes', time.minutes)}
            <span className={styles.colon}>:</span>
            {renderUnitInput('S', field, 'seconds', time.seconds)}
        </div>
    );

    return (
        <CalculatorLayout
            className={styles.layout}
            title={t('time.title')}
            description={t('time.desc')}
            display={
                <div className={styles.displayContent}>
                    {renderTimeRow('t1', time1)}

                    <div className={styles.operatorRow}>
                        <button
                            className={styles.opButton}
                            onClick={() => setOperation(prev => prev === '+' ? '-' : '+')}
                            aria-label={t('time.toggleOperation')}
                        >
                            {operation}
                        </button>
                    </div>

                    {renderTimeRow('t2', time2)}

                    <div className={styles.resultRow}>
                        = {timeUtils.format(result)}
                    </div>
                </div>
            }
            keypad={
                <>
                    <Button variant="secondary" onClick={clearAll}>AC</Button>
                    <Button variant="secondary" onClick={clear}>C</Button>
                    <Button variant="secondary" onClick={backspace} aria-label={t('common.delete')}>⌫</Button>
                    <Button variant="secondary" onClick={() => setActiveUnit('days')}>D</Button>

                    {['7', '8', '9'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                    <Button variant="secondary" onClick={() => setActiveUnit('hours')}>H</Button>

                    {['4', '5', '6'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                    <Button variant="secondary" onClick={() => setActiveUnit('minutes')}>M</Button>

                    {['1', '2', '3'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                    <Button variant="secondary" onClick={() => setActiveUnit('seconds')}>S</Button>

                    <Button style={{ gridColumn: 'span 2', aspectRatio: 'auto' }} onClick={() => handleDigit('0')}>0</Button>
                    <Button variant="accent" style={{ gridColumn: 'span 2', aspectRatio: 'auto', fontSize: '1rem' }} onClick={() => setActiveField(prev => prev === 't1' ? 't2' : 't1')}>
                        {t('time.next')}
                    </Button>
                </>
            }
        />
    );
}
