import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Display } from '../../components/Display';
import { Button } from '../../components/Button';
import { useCalculator } from '../../hooks/useCalculator';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { ERROR_VALUE } from '../../utils/calculator';
import { useTranslation } from 'react-i18next';

export function StandardCalculator() {
    const { t } = useTranslation();
    const {
        state,
        inputDigit,
        inputDot,
        clear,
        deleteLast,
        performOperation,
        calculateEquals,
        toggleSign,
        percentage
    } = useCalculator();

    useKeyboardInput({
        onDigit: inputDigit,
        onDot: inputDot,
        onBackspace: deleteLast,
        onClear: clear,
        onEnter: calculateEquals,
        onOperator: performOperation,
        onPercent: percentage,
    });

    const displayValue = state.currentValue === ERROR_VALUE ? t('common.error') : state.currentValue;

    const renderKeypad = () => (
        <>
            {/* Row 1 */}
            <Button variant="secondary" onClick={clear}>{state.currentValue !== '0' ? 'C' : 'AC'}</Button>
            <Button variant="secondary" onClick={toggleSign}>+/-</Button>
            <Button variant="secondary" onClick={percentage}>%</Button>
            <Button variant="primary" onClick={() => performOperation('÷')}>÷</Button>

            {/* Row 2 */}
            <Button onClick={() => inputDigit('7')}>7</Button>
            <Button onClick={() => inputDigit('8')}>8</Button>
            <Button onClick={() => inputDigit('9')}>9</Button>
            <Button variant="primary" onClick={() => performOperation('×')}>×</Button>

            {/* Row 3 */}
            <Button onClick={() => inputDigit('4')}>4</Button>
            <Button onClick={() => inputDigit('5')}>5</Button>
            <Button onClick={() => inputDigit('6')}>6</Button>
            <Button variant="primary" onClick={() => performOperation('-')}>-</Button>

            {/* Row 4 */}
            <Button onClick={() => inputDigit('1')}>1</Button>
            <Button onClick={() => inputDigit('2')}>2</Button>
            <Button onClick={() => inputDigit('3')}>3</Button>
            <Button variant="primary" onClick={() => performOperation('+')}>+</Button>

            {/* Row 5 */}
            <Button onClick={() => inputDigit('0')}>0</Button>
            <Button onClick={inputDot}>.</Button>
            <Button variant="secondary" onClick={deleteLast} aria-label={t('common.delete')}>⌫</Button>
            <Button variant="accent" onClick={calculateEquals}>=</Button>
        </>
    );

    return (
        <CalculatorLayout
            display={<Display value={displayValue} expression={state.expression} />}
            keypad={renderKeypad()}
            title={t('standard.title')}
            description={t('standard.desc')}
        />
    );
}
