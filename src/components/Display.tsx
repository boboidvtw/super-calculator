import clsx from 'clsx';
import styles from './Display.module.css';

interface DisplayProps {
    value: string;
    expression?: string;
    className?: string;
}

export function Display({ value, expression, className }: DisplayProps) {
    // Auto-scale font size based on length (simplified)
    const getFontSize = (text: string) => {
        if (text.length > 12) return '2rem';
        if (text.length > 9) return '2.5rem';
        return '3.5rem';
    };

    return (
        <div className={clsx(styles.display, className)}>
            {expression && <div className={styles.expression}>{expression}</div>}
            <div
                className={styles.value}
                style={{ fontSize: getFontSize(value) }}
            >
                {value}
            </div>
        </div>
    );
}
