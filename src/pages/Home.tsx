import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FEATURES } from '../features';
import styles from './Home.module.css';

export function Home() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>{t('menu.home')}</h2>
            <div className={styles.grid}>
                {FEATURES.map((feature) => (
                    <Link key={feature.path} to={`/${feature.path}`} className={styles.card}>
                        <div className={styles.iconWrapper} style={{ backgroundColor: feature.color }}>
                            <feature.icon size={32} color="white" aria-hidden />
                        </div>
                        <span className={styles.label}>{t(feature.labelKey)}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
