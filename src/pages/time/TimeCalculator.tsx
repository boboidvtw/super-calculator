import { useState } from 'react';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import { timeUtils, type TimeObject } from '../../utils/mathUtils';
import styles from './TimeCalculator.module.css';

const INITIAL_TIME: TimeObject = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function TimeCalculator() {
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
            const newVal = parseInt(currentVal === '0' ? digit : currentVal + digit);
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

    const renderUnitInput = (label: string, field: 't1' | 't2', unit: keyof TimeObject, value: number) => (
        <div
            className={`${styles.unitBox} ${activeField === field && activeUnit === unit ? styles.active : ''}`}
            onClick={() => { setActiveField(field); setActiveUnit(unit); }}
        >
            <span className={styles.unitValue}>{value}</span>
            <span className={styles.unitLabel}>{label}</span>
            {field === 't1' && activeField === 't1' && activeUnit === unit && <div className={styles.indicator} />}
        </div>
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
            display={
                <div className={styles.displayContent}>
                    {renderTimeRow('t1', time1)}

                    <div className={styles.operatorRow}>
                        <button
                            className={styles.opButton}
                            onClick={() => setOperation(prev => prev === '+' ? '-' : '+')}
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
                    <Button variant="primary" style={{ visibility: 'hidden' }}>{' '}</Button>
                    <Button variant="primary" style={{ visibility: 'hidden' }}>{' '}</Button>

                    {['7', '8', '9'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                    <Button variant="secondary" onClick={() => setActiveUnit('hours')}>H</Button>

                    {['4', '5', '6'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                    <Button variant="secondary" onClick={() => setActiveUnit('minutes')}>M</Button>

                    {['1', '2', '3'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
                    <Button variant="secondary" onClick={() => setActiveUnit('seconds')}>S</Button>

                    <Button className="col-span-2" style={{ gridColumn: 'span 2' }} onClick={() => handleDigit('0')}>0</Button>
                    <Button onClick={() => setActiveField(prev => prev === 't1' ? 't2' : 't1')}>Next</Button>
                    <Button variant="accent" onClick={() => { }}>OK</Button>
                </>
            }
        />
    );
}
