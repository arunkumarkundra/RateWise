/**
 * RateWise calculation engine (PRD §5, §9, §13).
 *
 * Formulas:
 *   GM     = 1 − ((Annual Salary / 12) / Monthly Billing Rate)
 *   Rate   = (Annual Salary / 12) / (1 − GM)
 *   Salary = 12 × Monthly Billing Rate × (1 − GM)
 *   Markup = (Rate − Monthly Salary) / Monthly Salary
 */

export type Field = 'salary' | 'rate' | 'gm';

export const ALL_FIELDS: Field[] = ['salary', 'rate', 'gm'];

export interface FieldValues {
  salary: number | null;
  rate: number | null;
  gm: number | null;
}

export interface CalcResult {
  /** Which field was derived, or null if fewer than two valid inputs exist. */
  derivedField: Field | null;
  /** Fully resolved values when calculation succeeds. */
  values: { salary: number; monthlySalary: number; rate: number; gm: number; markup: number } | null;
  /** Friendly message when the derived value is mathematically invalid. */
  error: string | null;
}

/** Per-field input validation (PRD §13). Returns a message or null if valid. */
export function validateField(field: Field, value: number | null): string | null {
  if (value === null) return null;
  if (field === 'salary' && value <= 0) return 'Annual salary must be greater than zero.';
  if (field === 'rate' && value <= 0) return 'Billing rate must be greater than zero.';
  if (field === 'gm') {
    if (value < 0) return 'Gross margin can’t be negative.';
    if (value >= 1) return 'Gross margin must be below 100%.';
  }
  return null;
}

/**
 * Decide which field should be derived, honouring recency (PRD §9).
 * `editOrder` lists fields most-recently-edited first. The derived field is
 * the one the user touched least recently (or never) — it is safe to overwrite.
 */
export function pickDerivedField(editOrder: Field[]): Field | null {
  const authoritative = editOrder.slice(0, 2);
  if (authoritative.length < 2) return null;
  return ALL_FIELDS.find((f) => !authoritative.includes(f)) ?? null;
}

/** Run the calculation given the two authoritative values. */
export function calculate(inputs: FieldValues, derivedField: Field): CalcResult {
  const result = (salary: number, rate: number, gm: number): CalcResult => {
    const monthlySalary = salary / 12;
    const markup = (rate - monthlySalary) / monthlySalary;
    const vals = { salary, monthlySalary, rate, gm, markup };
    for (const v of Object.values(vals)) {
      if (!Number.isFinite(v)) {
        return { derivedField, values: null, error: 'These numbers don’t produce a valid result. Adjust an input and try again.' };
      }
    }
    return { derivedField, values: vals, error: null };
  };

  if (derivedField === 'rate') {
    const { salary, gm } = inputs;
    if (salary === null || gm === null) return { derivedField, values: null, error: null };
    if (1 - gm <= 0) {
      return { derivedField, values: null, error: 'Gross margin must be below 100% to calculate a billing rate.' };
    }
    return result(salary, salary / 12 / (1 - gm), gm);
  }

  if (derivedField === 'gm') {
    const { salary, rate } = inputs;
    if (salary === null || rate === null) return { derivedField, values: null, error: null };
    const gm = 1 - salary / 12 / rate;
    if (gm < 0) {
      return {
        derivedField,
        values: null,
        error: 'The billing rate is lower than the monthly salary, so gross margin would be negative. Raise the rate or lower the salary.',
      };
    }
    return result(salary, rate, gm);
  }

  // derivedField === 'salary'
  const { rate, gm } = inputs;
  if (rate === null || gm === null) return { derivedField, values: null, error: null };
  return result(12 * rate * (1 - gm), rate, gm);
}
