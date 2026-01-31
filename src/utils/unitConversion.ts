export type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'area';

export interface UnitDefinition {
    id: string;
    name: string;
    factor: number;    // Conversion factor to base unit
    offset?: number;   // For temperature (e.g. Celsius to Kelvin)
}

export const conversionTables: Record<UnitCategory, UnitDefinition[]> = {
    length: [
        { id: 'm', name: 'Meter (m)', factor: 1 },
        { id: 'km', name: 'Kilometer (km)', factor: 1000 },
        { id: 'cm', name: 'Centimeter (cm)', factor: 0.01 },
        { id: 'mm', name: 'Millimeter (mm)', factor: 0.001 },
        { id: 'in', name: 'Inch (in)', factor: 0.0254 },
        { id: 'ft', name: 'Foot (ft)', factor: 0.3048 },
        { id: 'yd', name: 'Yard (yd)', factor: 0.9144 },
        { id: 'mi', name: 'Mile (mi)', factor: 1609.344 },
    ],
    weight: [
        { id: 'kg', name: 'Kilogram (kg)', factor: 1 },
        { id: 'g', name: 'Gram (g)', factor: 0.001 },
        { id: 'mg', name: 'Milligram (mg)', factor: 0.000001 },
        { id: 'lb', name: 'Pound (lb)', factor: 0.45359237 },
        { id: 'oz', name: 'Ounce (oz)', factor: 0.02834952 },
    ],
    temperature: [
        { id: 'C', name: 'Celsius (°C)', factor: 1, offset: 0 },
        { id: 'F', name: 'Fahrenheit (°F)', factor: 1, offset: 0 }, // Special handling needed
        { id: 'K', name: 'Kelvin (K)', factor: 1, offset: 273.15 },
    ],
    volume: [
        { id: 'l', name: 'Liter (L)', factor: 1 },
        { id: 'ml', name: 'Milliliter (ml)', factor: 0.001 },
        { id: 'gal', name: 'Gallon (US)', factor: 3.78541 },
        { id: 'qt', name: 'Quart (US)', factor: 0.946353 },
        { id: 'pt', name: 'Pint (US)', factor: 0.473176 },
        { id: 'cup', name: 'Cup (US)', factor: 0.236588 },
    ],
    area: [
        { id: 'm2', name: 'Square Meter (m²)', factor: 1 },
        { id: 'ft2', name: 'Square Foot (ft²)', factor: 0.092903 },
        { id: 'ac', name: 'Acre', factor: 4046.86 },
        { id: 'ha', name: 'Hectare', factor: 10000 },
    ]
};

export const convertUnit = (value: number, from: string, to: string, category: UnitCategory): number => {
    const units = conversionTables[category];
    const fromUnit = units.find(u => u.id === from);
    const toUnit = units.find(u => u.id === to);

    if (!fromUnit || !toUnit) return 0;

    // Special handling for Temperature
    if (category === 'temperature') {
        let valueInCelsius = value;
        if (from === 'F') valueInCelsius = (value - 32) * 5 / 9;
        else if (from === 'K') valueInCelsius = value - 273.15;

        if (to === 'C') return valueInCelsius;
        if (to === 'F') return (valueInCelsius * 9 / 5) + 32;
        if (to === 'K') return valueInCelsius + 273.15;
    }

    // Standard conversion via base unit
    const valueInBase = value * fromUnit.factor;
    return valueInBase / toUnit.factor;
};
