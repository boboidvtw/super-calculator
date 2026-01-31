import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './CalculatorLayout.module.css';

interface CalculatorLayoutProps {
    display: ReactNode;
    keypad: ReactNode;
    history?: ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

export function CalculatorLayout({ display, keypad, history, className, title, description }: CalculatorLayoutProps) {
    return (
        <div className={clsx(styles.container, className)}>
            {(title || description) && (
                <div className={styles.header}>
                    {title && <h2 className={styles.title}>{title}</h2>}
                    {description && <p className={styles.description}>{description}</p>}
                </div>
            )}
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
