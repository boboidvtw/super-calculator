import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { getSize, sizeTables, type SizeCategory, type Region } from '../../utils/sizeConversion';
import { Shirt, Footprints, type LucideIcon } from 'lucide-react';
import styles from './SizeConverter.module.css';

const categories: { id: SizeCategory; icon: LucideIcon; labelKey: string }[] = [
    { id: 'MensShoe', icon: Footprints, labelKey: 'size.menShoe' },
    { id: 'WomensShoe', icon: Footprints, labelKey: 'size.wmnShoe' },
    { id: 'MensTShirt', icon: Shirt, labelKey: 'size.menShirt' },
];

const regions: Region[] = ['US', 'UK', 'EU', 'JP'];
const DEFAULT_INDEX = 2;

export function SizeConverter() {
    const { t } = useTranslation();
    const [category, setCategory] = useState<SizeCategory>('MensShoe');
    const [selectedIndex, setSelectedIndex] = useState(DEFAULT_INDEX);

    const totalSizes = sizeTables[category].US.length;

    const handleNext = () => setSelectedIndex(i => Math.min(i + 1, totalSizes - 1));
    const handlePrev = () => setSelectedIndex(i => Math.max(i - 1, 0));

    return (
        <CalculatorLayout
            className={styles.layout}
            keypadLayout="stack"
            title={t('size.title')}
            description={t('size.desc')}
            display={
                <div className={styles.displayContent} aria-live="polite">
                    {regions.map(region => (
                        <div key={region} className={styles.row}>
                            <span className={styles.label}>{region}</span>
                            <span className={styles.value}>{getSize(category, region, selectedIndex)}</span>
                        </div>
                    ))}
                </div>
            }
            keypad={
                <div className={styles.controls}>
                    <div className={styles.catRow}>
                        {categories.map(c => (
                            <button
                                key={c.id}
                                type="button"
                                className={`${styles.catButton} ${category === c.id ? styles.active : ''}`}
                                onClick={() => { setCategory(c.id); setSelectedIndex(DEFAULT_INDEX); }}
                                aria-pressed={category === c.id}
                            >
                                <c.icon size={20} aria-hidden />
                                <span>{t(c.labelKey)}</span>
                            </button>
                        ))}
                    </div>

                    <div className={styles.navRow}>
                        <button type="button" className={styles.navButton} onClick={handlePrev} disabled={selectedIndex === 0}>
                            &lt; {t('size.smaller')}
                        </button>
                        <button type="button" className={styles.navButton} onClick={handleNext} disabled={selectedIndex === totalSizes - 1}>
                            {t('size.larger')} &gt;
                        </button>
                    </div>
                </div>
            }
        />
    );
}
