// Single registry of calculators: drives routes, the home grid and the side menu.
import { lazy, type ComponentType } from 'react';
import {
    Calculator, DollarSign, Percent, Calendar, Ruler, Heart, Clock, Hash,
    Shirt, Receipt, Tag, Fuel, ShieldCheck, type LucideIcon,
} from 'lucide-react';

// Each calculator is code-split so the first load only ships the home screen.
const StandardCalculator = lazy(() => import('./pages/standard/StandardCalculator').then((m) => ({ default: m.StandardCalculator })));
const CurrencyConverter = lazy(() => import('./pages/currency/CurrencyConverter').then((m) => ({ default: m.CurrencyConverter })));
const UnitConverter = lazy(() => import('./pages/unit/UnitConverter').then((m) => ({ default: m.UnitConverter })));
const TimeCalculator = lazy(() => import('./pages/time/TimeCalculator').then((m) => ({ default: m.TimeCalculator })));
const NumberConverter = lazy(() => import('./pages/number/NumberConverter').then((m) => ({ default: m.NumberConverter })));
const SizeConverter = lazy(() => import('./pages/size/SizeConverter').then((m) => ({ default: m.SizeConverter })));
const TipCalculator = lazy(() => import('./pages/financial/TipCalculator').then((m) => ({ default: m.TipCalculator })));
const DiscountCalculator = lazy(() => import('./pages/financial/DiscountCalculator').then((m) => ({ default: m.DiscountCalculator })));
const HealthCalculator = lazy(() => import('./pages/health/HealthCalculator').then((m) => ({ default: m.HealthCalculator })));
const AnniversaryCalculator = lazy(() => import('./pages/anniversary/AnniversaryCalculator').then((m) => ({ default: m.AnniversaryCalculator })));
const FuelCalculator = lazy(() => import('./pages/financial/FuelCalculator').then((m) => ({ default: m.FuelCalculator })));
const InterestCalculator = lazy(() => import('./pages/financial/InterestCalculator').then((m) => ({ default: m.InterestCalculator })));
const InsuranceCalculator = lazy(() => import('./pages/financial/InsuranceCalculator').then((m) => ({ default: m.InsuranceCalculator })));

export interface Feature {
    path: string;
    labelKey: string;
    icon: LucideIcon;
    color: string;
    component: ComponentType;
}

export const FEATURES: Feature[] = [
    { path: 'standard', labelKey: 'menu.standard', icon: Calculator, color: 'var(--primary-color)', component: StandardCalculator },
    { path: 'currency', labelKey: 'menu.currency', icon: DollarSign, color: '#34c759', component: CurrencyConverter },
    { path: 'unit', labelKey: 'menu.unit', icon: Ruler, color: '#ff9500', component: UnitConverter },
    { path: 'time', labelKey: 'menu.time', icon: Clock, color: '#007aff', component: TimeCalculator },
    { path: 'number', labelKey: 'menu.number', icon: Hash, color: '#af52de', component: NumberConverter },
    { path: 'size', labelKey: 'menu.size', icon: Shirt, color: '#ff2d55', component: SizeConverter },
    { path: 'tip', labelKey: 'menu.tip', icon: Receipt, color: '#30b0c7', component: TipCalculator },
    { path: 'discount', labelKey: 'menu.discount', icon: Tag, color: '#ff6b35', component: DiscountCalculator },
    { path: 'interest', labelKey: 'menu.interest', icon: Percent, color: '#5856d6', component: InterestCalculator },
    { path: 'insurance', labelKey: 'menu.insurance', icon: ShieldCheck, color: '#0a84ff', component: InsuranceCalculator },
    { path: 'fuel', labelKey: 'menu.fuel', icon: Fuel, color: '#e0a800', component: FuelCalculator },
    { path: 'health', labelKey: 'menu.health', icon: Heart, color: '#ff3b30', component: HealthCalculator },
    { path: 'anniversary', labelKey: 'menu.anniversary', icon: Calendar, color: '#64d2ff', component: AnniversaryCalculator },
];
