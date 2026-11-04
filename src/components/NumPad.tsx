import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import type { NumericInput } from '../hooks/useNumericInput';
import styles from './NumPad.module.css';

interface NumPadProps {
    input: NumericInput;
    allowDecimal?: boolean;
}

const DIGIT_ROWS = [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3']];

/** Three-column keypad (C ⌫ / 7-9 / 4-6 / 1-3 / 0 .) bound to one numeric input, with keyboard support. */
export function NumPad({ input, allowDecimal = true }: NumPadProps) {
    const { t } = useTranslation();

    useKeyboardInput({
        onDigit: input.inputDigit,
        onDot: allowDecimal ? input.inputDot : undefined,
        onBackspace: input.backspace,
        onClear: input.clear,
    });

    return (
        <div className={styles.numpad}>
            <Button variant="secondary" className={styles.span2} onClick={input.clear} aria-label={t('common.clear')}>C</Button>
            <Button variant="secondary" onClick={input.backspace} aria-label={t('common.delete')}>⌫</Button>
            {DIGIT_ROWS.flat().map((d) => (
                <Button key={d} onClick={() => input.inputDigit(d)}>{d}</Button>
            ))}
            <Button className={allowDecimal ? styles.span2 : styles.span3} onClick={() => input.inputDigit('0')}>0</Button>
            {allowDecimal && <Button onClick={input.inputDot}>.</Button>}
        </div>
    );
}
