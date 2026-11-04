import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronLeft, Globe, Heart } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { FEATURES } from '../features';
import { LANGUAGES } from '../i18n/languages';
import styles from './RootLayout.module.css';

const DONATE_URL = 'https://paypal.me/boboidvtw168';

export function RootLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const isHome = location.pathname === '/';

    const toggleMenu = () => {
        setIsMenuOpen(open => !open);
        setIsLangMenuOpen(false);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsLangMenuOpen(false);
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        closeMenu();
    };

    const menuItems = [
        { path: '/', label: t('menu.home') },
        ...FEATURES.map(f => ({ path: `/${f.path}`, label: t(f.labelKey) })),
    ];

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                {!isHome && (
                    <Link to="/" className={styles.backButton} aria-label={t('common.back')}>
                        <ChevronLeft size={24} aria-hidden />
                    </Link>
                )}
                <h1 className={styles.title}>Super Calculator</h1>
                <button
                    type="button"
                    className={styles.menuButton}
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
                    aria-expanded={isMenuOpen}
                    aria-controls="side-menu"
                >
                    {isMenuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
                </button>
            </header>

            <nav id="side-menu" className={clsx(styles.sidebar, isMenuOpen && styles.open)} aria-hidden={!isMenuOpen} inert={!isMenuOpen}>
                <div className={styles.langSelector}>
                    <button
                        type="button"
                        className={styles.langButton}
                        onClick={() => setIsLangMenuOpen(open => !open)}
                        aria-expanded={isLangMenuOpen}
                    >
                        <Globe size={20} aria-hidden />
                        <span>{t('common.language')}</span>
                    </button>

                    {isLangMenuOpen && (
                        <div className={styles.langDropdown}>
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    type="button"
                                    lang={lang.code}
                                    className={clsx(styles.langOption, i18n.resolvedLanguage === lang.code && styles.activeLang)}
                                    onClick={() => changeLanguage(lang.code)}
                                    aria-current={i18n.resolvedLanguage === lang.code}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <ul className={styles.navList}>
                    {menuItems.map(item => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                onClick={closeMenu}
                                aria-current={location.pathname === item.path ? 'page' : undefined}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className={styles.donateSection}>
                    <a
                        href={DONATE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.donateButton}
                    >
                        <Heart size={20} className={styles.heartIcon} aria-hidden />
                        <span>{t('menu.donate')}</span>
                    </a>
                </div>
            </nav>

            {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} aria-hidden />}

            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}
