import { HashRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { Home } from './pages/Home';
import { StandardCalculator } from './pages/standard/StandardCalculator';
import { CurrencyConverter } from './pages/currency/CurrencyConverter';
import { UnitConverter } from './pages/unit/UnitConverter';
import { TimeCalculator } from './pages/time/TimeCalculator';
import { NumberConverter } from './pages/number/NumberConverter';
import { SizeConverter } from './pages/size/SizeConverter';
import { TipCalculator } from './pages/financial/TipCalculator';
import { DiscountCalculator } from './pages/financial/DiscountCalculator';
import { HealthCalculator } from './pages/health/HealthCalculator';
import { AnniversaryCalculator } from './pages/anniversary/AnniversaryCalculator';
import { FuelCalculator } from './pages/financial/FuelCalculator';
import { InterestCalculator } from './pages/financial/InterestCalculator';
import { InsuranceCalculator } from './pages/financial/InsuranceCalculator';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          {/* We will add more routes here */}
          <Route path="standard" element={<StandardCalculator />} />
          <Route path="currency" element={<CurrencyConverter />} />
          <Route path="unit" element={<UnitConverter />} />
          <Route path="time" element={<TimeCalculator />} />
          <Route path="number" element={<NumberConverter />} />
          <Route path="size" element={<SizeConverter />} />
          <Route path="tip" element={<TipCalculator />} />
          <Route path="discount" element={<DiscountCalculator />} />
          <Route path="health" element={<HealthCalculator />} />
          <Route path="anniversary" element={<AnniversaryCalculator />} />
          <Route path="fuel" element={<FuelCalculator />} />
          <Route path="fuel" element={<FuelCalculator />} />
          <Route path="interest" element={<InterestCalculator />} />
          <Route path="insurance" element={<InsuranceCalculator />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
