export type Region = 'US' | 'UK' | 'EU' | 'JP';
export type SizeCategory = 'MensShoe' | 'WomensShoe' | 'MensTShirt';

export const sizeTables: Record<SizeCategory, Record<Region, string[]>> = {
    MensShoe: {
        US: ['6', '7', '8', '9', '10', '11', '12'],
        UK: ['5.5', '6.5', '7.5', '8.5', '9.5', '10.5', '11.5'],
        EU: ['39', '40', '41', '42', '43', '44', '46'],
        JP: ['24', '25', '26', '27', '28', '29', '30']
    },
    WomensShoe: {
        US: ['4', '5', '6', '7', '8', '9', '10'],
        UK: ['2', '3', '4', '5', '6', '7', '8'],
        EU: ['35', '36', '37', '38', '39', '40', '42'],
        JP: ['21', '22', '23', '24', '25', '26', '27']
    },
    MensTShirt: {
        US: ['S', 'M', 'L', 'XL', 'XXL'],
        UK: ['34/36', '38/40', '42/44', '46/48', '50/52'],
        EU: ['44/46', '48/50', '52/54', '56/58', '60/62'],
        JP: ['S', 'M', 'L', 'LL', '3L']
    }
};

export const getSize = (category: SizeCategory, region: Region, index: number): string => {
    return sizeTables[category][region][index] || '-';
};
