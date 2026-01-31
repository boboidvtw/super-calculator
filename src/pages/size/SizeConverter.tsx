import { useState } from 'react';
import { CalculatorLayout } from '../../layouts/CalculatorLayout';
import { sizeTables, type SizeCategory, type Region } from '../../utils/sizeConversion';
import { Shirt, Footprints } from 'lucide-react';
import styles from './SizeConverter.module.css';

const categories: { id: SizeCategory; icon: any; name: string }[] = [
    { id: 'MensShoe', icon: Footprints, name: 'Men Shoe' },
    { id: 'WomensShoe', icon: Footprints, name: 'Wmn Shoe' },
    { id: 'MensTShirt', icon: Shirt, name: 'Men Shirt' },
];

const regions: Region[] = ['US', 'UK', 'EU', 'JP'];

export function SizeConverter() {
    const [category, setCategory] = useState<SizeCategory>('MensShoe');
    const [selectedIndex, setSelectedIndex] = useState(2); // Default to middle size

    const currentSizes = sizeTables[category];
    const totalSizes = currentSizes['US'].length;

    const handleNext = () => setSelectedIndex(i => Math.min(i + 1, totalSizes - 1));
    const handlePrev = () => setSelectedIndex(i => Math.max(i - 1, 0));

    return (
        <CalculatorLayout
            className={styles.layout}
            display={
                <div className={styles.displayContent}>
                    {regions.map(region => (
                        <div key={region} className={styles.row}>
                            <span className={styles.label}>{region}</span>
                            <span className={styles.value}>{currentSizes[region][selectedIndex]}</span>
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
                                className={`${styles.catButton} ${category === c.id ? styles.active : ''}`}
                                onClick={() => { setCategory(c.id); setSelectedIndex(2); }}
                            >
                                <c.icon size={20} />
                                <span>{c.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className={styles.navRow}>
                        <button className={styles.navButton} onClick={handlePrev}>&lt; Smaller</button>
                        <button className={styles.navButton} onClick={handleNext}>Larger &gt;</button>
                    </div>
                </div>
            }
        />
    );
}
