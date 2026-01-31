import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './CalculatorLayout.module.css';

interface CalculatorLayoutProps {
    display: ReactNode;
    keypad: ReactNode;
    history?: ReactNode;
    className?: string;
}

export function CalculatorLayout({ display, keypad, history, className }: CalculatorLayoutProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.displayArea}>
                {display}
            </div>
            {history && (
                <div className={styles.historyArea}>
                    {history}
                </div>
            )}
            <div className={styles.keypadArea}>
                {keypad}
            </div>
        </div>
    );
}
