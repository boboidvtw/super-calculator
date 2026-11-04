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
    /** 'grid' = 4-column calculator keys; 'stack' = form controls above a self-contained keypad. */
    keypadLayout?: 'grid' | 'stack';
}

// The plain "displayArea"/"keypadArea" class names are stable hooks that pages
// target with `.layout :global(.displayArea)`; CSS-module names alone are hashed.
export function CalculatorLayout({ display, keypad, history, className, title, description, keypadLayout = 'grid' }: CalculatorLayoutProps) {
    return (
        <div className={clsx(styles.container, className)}>
            {(title || description) && (
                <div className={styles.header}>
                    {title && <h2 className={styles.title}>{title}</h2>}
                    {description && <p className={styles.description}>{description}</p>}
                </div>
            )}
            <div className={clsx(styles.displayArea, 'displayArea')}>
                {display}
            </div>
            {history && (
                <div className={styles.historyArea}>
                    {history}
                </div>
            )}
            <div className={clsx(styles.keypadArea, keypadLayout === 'stack' && styles.keypadStack, 'keypadArea')}>
                {keypad}
            </div>
        </div>
    );
}
