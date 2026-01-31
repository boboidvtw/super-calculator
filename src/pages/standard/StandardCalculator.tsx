import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { Display } from '../../components/Display';
import { Button } from '../../components/Button';
import { useCalculator } from '../../hooks/useCalculator';

export function StandardCalculator() {
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
            <Button className="col-span-2" style={{ gridColumn: 'span 2' }} onClick={() => inputDigit('0')}>0</Button>
            <Button onClick={inputDot}>.</Button>
            <Button variant="accent" onClick={calculateEquals}>=</Button>
        </>
    );

    return (
        <CalculatorLayout
            display={<Display value={state.currentValue} expression={state.expression} />}
            keypad={renderKeypad()}
        />
    );
}
