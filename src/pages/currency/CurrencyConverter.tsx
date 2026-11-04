import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../hooks/useCurrency';
import { useNumericInput } from '../../hooks/useNumericInput';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Button } from '../../components/Button';
import { toNumber } from '../../utils/numericInput';
import { ArrowRightLeft } from 'lucide-react';
import styles from './CurrencyConverter.module.css';

export function CurrencyConverter() {
    const { t, i18n } = useTranslation();
    const { rates, loading, error, convert, updatedAt } = useCurrency();
    const amount = useNumericInput('0');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('TWD');

    useKeyboardInput({
        onDigit: amount.inputDigit,
        onDot: amount.inputDot,
        onBackspace: amount.backspace,
        onClear: amount.clear,
    });

    const swap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    if (loading) return <div className={styles.loading}>{t('common.loading')}</div>;
    if (error) return <div className={styles.loading} role="alert">{t('currency.error')}</div>;

    const result = convert(toNumber(amount.value), fromCurrency, toCurrency);
    const currencyList = Object.keys(rates).sort();
    const digits = [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3']];

    return (
        <CalculatorLayout
            className={styles.currencyLayout}
            title={t('currency.title')}
            description={t('currency.desc')}
            display={
                <div className={styles.converterDisplay}>
                    <div className={styles.row}>
                        <select
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            className={styles.select}
                            aria-label={t('currency.from')}
                        >
                            {currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className={styles.amount}>{amount.value}</div>
                    </div>
                    <div className={styles.divider}>=</div>
                    <div className={styles.row}>
                        <select
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            className={styles.select}
                            aria-label={t('currency.to')}
                        >
                            {currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className={styles.amount}>
                            {result === null ? '–' : result.toLocaleString(i18n.language, { maximumFractionDigits: 2 })}
                        </div>
                    </div>
                    {updatedAt !== null && (
                        <div className={styles.updated}>
                            {t('currency.lastUpdated', { date: new Date(updatedAt).toLocaleString(i18n.language) })}
                        </div>
                    )}
                </div>
            }
            keypad={
                <>
                    <Button variant="secondary" onClick={amount.clear} aria-label={t('common.clear')}>C</Button>
                    <Button variant="secondary" onClick={amount.backspace} aria-label={t('common.delete')}>⌫</Button>
                    <Button variant="secondary" onClick={swap} aria-label={t('currency.swap')}>
                        <ArrowRightLeft size={20} />
                    </Button>
                    <Button variant="primary" style={{ visibility: 'hidden' }} aria-hidden tabIndex={-1}> </Button>

                    {digits.flatMap((row) => [
                        ...row.map(d => <Button key={d} onClick={() => amount.inputDigit(d)}>{d}</Button>),
                        <Button key={`spacer-${row[0]}`} variant="primary" style={{ visibility: 'hidden' }} aria-hidden tabIndex={-1}> </Button>,
                    ])}

                    <Button style={{ gridColumn: 'span 2', aspectRatio: 'auto' }} onClick={() => amount.inputDigit('0')}>0</Button>
                    <Button onClick={amount.inputDot}>.</Button>
                    <Button variant="primary" style={{ visibility: 'hidden' }} aria-hidden tabIndex={-1}> </Button>
                </>
            }
        />
    );
}
