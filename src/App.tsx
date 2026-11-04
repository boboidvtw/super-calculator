import { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootLayout } from './layouts/RootLayout';
import { Home } from './pages/Home';
import { FEATURES } from './features';

function PageFallback() {
    const { t } = useTranslation();
    return <div role="status" style={{ padding: '2rem', textAlign: 'center' }}>{t('common.loading')}</div>;
}

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Home />} />
                    {FEATURES.map(({ path, component: Page }) => (
                        <Route
                            key={path}
                            path={path}
                            element={<Suspense fallback={<PageFallback />}><Page /></Suspense>}
                        />
                    ))}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;
