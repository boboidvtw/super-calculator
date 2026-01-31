import { useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
// import { Display } from '../../components/Display';
import { ArrowRightLeft } from 'lucide-react';
import styles from './CurrencyConverter.module.css';

export function CurrencyConverter() {
    const { rates, loading, convert } = useCurrency();
    const [amount, setAmount] = useState('0');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('TWD');

    const handleDigit = (digit: string) => {
        setAmount(prev => prev === '0' ? digit : prev + digit);
    };

    const handleDot = () => {
        if (!amount.includes('.')) setAmount(prev => prev + '.');
    };

    const handleDelete = () => {
        setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    };

    const handleClear = () => {
        setAmount('0');
    };

    // Convert on the fly
    const result = convert(parseFloat(amount), fromCurrency, toCurrency);

    const currencyList = Object.keys(rates).sort();

    const renderKeypad = () => (
        <>
            <Button variant="secondary" onClick={handleClear}>C</Button>
            <Button variant="secondary" onClick={handleDelete}>⌫</Button>
            {/* Swap Button */}
            <Button variant="secondary" onClick={() => {
                setFromCurrency(toCurrency);
                setToCurrency(fromCurrency);
            }}>
                <ArrowRightLeft size={20} />
            </Button>
            <Button variant="primary" onClick={() => { }} disabled>Curr</Button>

            {['7', '8', '9'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
            <Button variant="primary" style={{ visibility: 'hidden' }}> </Button>

            {['4', '5', '6'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
            <Button variant="primary" style={{ visibility: 'hidden' }}> </Button>

            {['1', '2', '3'].map(d => <Button key={d} onClick={() => handleDigit(d)}>{d}</Button>)}
            <Button variant="primary" style={{ visibility: 'hidden' }}> </Button>

            <Button className="col-span-2" style={{ gridColumn: 'span 2' }} onClick={() => handleDigit('0')}>0</Button>
            <Button onClick={handleDot}>.</Button>
            <Button variant="accent" onClick={() => { }}>OK</Button>
        </>
    );

    if (loading) return <div className={styles.loading}>Loading rates...</div>;

    return (
        <CalculatorLayout
            className={styles.currencyLayout}
            display={
                <div className={styles.converterDisplay}>
                    <div className={styles.row}>
                        <select
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            className={styles.select}
                        >
                            {currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className={styles.amount}>{amount}</div>
                    </div>
                    <div className={styles.divider}>=</div>
                    <div className={styles.row}>
                        <select
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            className={styles.select}
                        >
                            {currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className={styles.amount}>{result.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </div>
                </div>
            }
            keypad={renderKeypad()}
        />
    );
}
