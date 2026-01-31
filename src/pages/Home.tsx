import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calculator, DollarSign, Percent, Calendar, Ruler, Heart, Clock, Tag } from 'lucide-react';
import styles from './Home.module.css';

const features = [
    { name: 'menu.standard', path: '/standard', icon: Calculator, color: 'var(--primary-color)' },
    { name: 'menu.currency', path: '/currency', icon: DollarSign, color: '#34c759' },
    { name: 'menu.unit', path: '/unit', icon: Ruler, color: '#ff9500' },
    { name: 'menu.time', path: '/time', icon: Clock, color: '#007aff' },
    { name: 'menu.number', path: '/number', icon: Tag, color: '#af52de' }, // Tag icon reused for number base
    { name: 'menu.size', path: '/size', icon: Ruler, color: '#ff2d55' },
    { name: 'menu.interest', path: '/interest', icon: Percent, color: '#5856d6' },
    { name: 'menu.fuel', path: '/fuel', icon: DollarSign, color: '#ff9500' }, // Orange
    { name: 'menu.health', path: '/health', icon: Heart, color: '#ff3b30' },
    { name: 'menu.anniversary', path: '/anniversary', icon: Calendar, color: '#007aff' }, // Blue
];

export function Home() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>{t('menu.home')}</h2>
            <div className={styles.grid}>
                {features.map((feature) => (
                    <Link key={feature.path} to={feature.path} className={styles.card}>
                        <div className={styles.iconWrapper} style={{ backgroundColor: feature.color }}>
                            <feature.icon size={32} color="white" />
                        </div>
                        <span className={styles.label}>{t(feature.name)}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
