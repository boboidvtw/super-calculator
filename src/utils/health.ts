// Pure health formulas. Body fat is an estimate, not a measurement.

export type Sex = 'm' | 'f';
export type BmiStatus = 'underweight' | 'normal' | 'overweight' | 'obese';

export const BMI_STATUS_COLORS: Record<BmiStatus, string> = {
    underweight: '#ffcc00',
    normal: '#34c759',
    overweight: '#ff9500',
    obese: '#ff3b30',
};

/** BMI = kg / m². Returns null for non-positive inputs. */
export function calculateBmi(heightCm: number, weightKg: number): number | null {
    if (!(heightCm > 0) || !(weightKg > 0)) return null;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
}

/** WHO adult BMI categories. */
export function bmiStatus(bmi: number): BmiStatus {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
}

/**
 * Adult body fat % estimated from BMI (Deurenberg et al., 1991):
 * BF% = 1.2 × BMI + 0.23 × age − 10.8 × sex − 5.4, sex = 1 for men, 0 for women.
 * Returns null when inputs are missing or the person is under 18.
 */
export function estimateBodyFat(bmi: number | null, age: number, sex: Sex): number | null {
    if (bmi === null || !Number.isFinite(age) || age < 18) return null;
    const sexFactor = sex === 'm' ? 1 : 0;
    return 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
}
