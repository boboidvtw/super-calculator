import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronLeft, Globe, Heart } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import styles from './RootLayout.module.css';

const LANGUAGES = [
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'en-US', label: 'English' },
    { code: 'de-DE', label: 'Deutsch' },
    { code: 'fr-FR', label: 'Français' },
    { code: 'es-ES', label: 'Español' },
    { code: 'ja-JP', label: '日本語' },
    { code: 'ko-KR', label: '한국어' },
    { code: 'zh-CN', label: '简体中文' },
];

export function RootLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const isHome = location.pathname === '/';

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsLangMenuOpen(false);
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsLangMenuOpen(false);
        setIsMenuOpen(false);
    };

    const menuItems = [
        { path: '/', label: t('menu.home') },
        { path: '/standard', label: t('menu.standard') },
        { path: '/currency', label: t('menu.currency') },
        { path: '/unit', label: t('menu.unit') },
        { path: '/time', label: t('menu.time') },
        { path: '/number', label: t('menu.number') },
        { path: '/size', label: t('menu.size') },
    ];

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                {!isHome && (
                    <Link to="/" className={styles.backButton}>
                        <ChevronLeft size={24} />
                    </Link>
                )}
                <h1 className={styles.title}>Super Calculator</h1>
                <button className={styles.menuButton} onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            <nav className={clsx(styles.sidebar, isMenuOpen && styles.open)}>
                <div className={styles.langSelector}>
                    <button
                        className={styles.langButton}
                        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    >
                        <Globe size={20} />
                        <span>Language</span>
                    </button>

                    {isLangMenuOpen && (
                        <div className={styles.langDropdown}>
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    className={clsx(styles.langOption, i18n.language === lang.code && styles.activeLang)}
                                    onClick={() => changeLanguage(lang.code)}
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
                            <Link to={item.path} onClick={toggleMenu}>{item.label}</Link>
                        </li>
                    ))}
                </ul>

                <div className={styles.donateSection}>
                    <a
                        href="https://paypal.me/boboidvtw168"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.donateButton}
                    >
                        <Heart size={20} className={styles.heartIcon} />
                        <span>Donate</span>
                    </a>
                </div>
            </nav>

            {isMenuOpen && <div className={styles.overlay} onClick={toggleMenu} />}

            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}
