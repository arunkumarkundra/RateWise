import { useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InputField from './components/InputField';
import ResultsCard from './components/ResultsCard';
import { CURRENCY_SYMBOL } from './config';
import {
  ALL_FIELDS,
  CalcResult,
  Field,
  calculate,
  pickDerivedField,
  validateField,
} from './lib/calc';
import {
  formatCurrencyNumber,
  formatPercentNumber,
  parseCurrency,
  parsePercent,
} from './lib/format';

type RawValues = Record<Field, string>;

const EMPTY: RawValues = { salary: '', rate: '', gm: '' };

function parseField(field: Field, raw: string): number | null {
  return field === 'gm' ? parsePercent(raw) : parseCurrency(raw);
}

function formatField(field: Field, value: number): string {
  return field === 'gm' ? formatPercentNumber(value) : formatCurrencyNumber(value);
}

export default function App() {
  const [raw, setRaw] = useState<RawValues>(EMPTY);
  /** Fields the user has typed into, most recent first (PRD §9). */
  const [editOrder, setEditOrder] = useState<Field[]>([]);
  const [focused, setFocused] = useState<Field | null>(null);

  // Parse + validate every field's raw text.
  const parsed = useMemo(() => {
    const out = {} as Record<Field, number | null>;
    ALL_FIELDS.forEach((f) => (out[f] = parseField(f, raw[f])));
    return out;
  }, [raw]);

  const fieldErrors = useMemo(() => {
    const out = {} as Record<Field, string | null>;
    ALL_FIELDS.forEach((f) => (out[f] = validateField(f, parsed[f])));
    return out;
  }, [parsed]);

  // Only fields holding a valid value can be authoritative.
  const validEditOrder = editOrder.filter((f) => parsed[f] !== null && !fieldErrors[f]);
  const derivedField = pickDerivedField(validEditOrder);

  const calc: CalcResult = useMemo(() => {
    if (!derivedField) return { derivedField: null, values: null, error: null };
    return calculate(parsed, derivedField);
  }, [parsed, derivedField]);

  const handleChange = (field: Field) => (value: string) => {
    setRaw((prev) => ({ ...prev, [field]: value }));
    setEditOrder((prev) => {
      const rest = prev.filter((f) => f !== field);
      // Clearing a field releases it — it may become the derived field again.
      return value.trim() === '' ? rest : [field, ...rest];
    });
  };

  const handleBlur = (field: Field) => () => {
    setFocused(null);
    // Auto-format on blur: 1200000 → 1,200,000 (PRD §6).
    const value = parsed[field];
    if (field !== derivedField && value !== null && !fieldErrors[field]) {
      setRaw((prev) => ({ ...prev, [field]: formatField(field, value) }));
    }
  };

  /** What each input displays: computed value if derived, otherwise the user's text. */
  const displayValue = (field: Field): string => {
    if (field === derivedField && calc.values) {
      return formatField(field, calc.values[field]);
    }
    if (field === derivedField && calc.error) return '';
    return raw[field];
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Header />

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Inputs card */}
        <section aria-label="Inputs" className="rounded-2xl bg-card p-5 shadow-card sm:p-6">
          <h2 className="mb-3 font-display text-lg font-bold">Inputs</h2>
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-accent/20 bg-accent-soft px-3.5 py-3">
            <span aria-hidden="true" className="mt-0.5 font-display text-base font-bold text-accent-strong">→</span>
            <p className="text-sm font-semibold text-accent-strong">
              Fill in any two — the third updates as you type.
            </p>
          </div>
          <div className="space-y-5">
            <InputField
              id="salary"
              label="Annual salary"
              prefix={CURRENCY_SYMBOL}
              placeholder="1,200,000"
              helper="The employee’s total yearly salary."
              value={displayValue('salary')}
              derived={derivedField === 'salary'}
              error={fieldErrors.salary}
              onChange={handleChange('salary')}
              onFocus={() => setFocused('salary')}
              onBlur={handleBlur('salary')}
            />
            <InputField
              id="rate"
              label="Monthly billing rate"
              prefix={CURRENCY_SYMBOL}
              placeholder="150,000"
              helper="What you bill the client each month."
              value={displayValue('rate')}
              derived={derivedField === 'rate'}
              error={fieldErrors.rate}
              onChange={handleChange('rate')}
              onFocus={() => setFocused('rate')}
              onBlur={handleBlur('rate')}
            />
            <InputField
              id="gm"
              label="Gross margin"
              suffix="%"
              placeholder="35"
              helper="0 to 99.99. Enter 35 or 35%."
              value={displayValue('gm')}
              derived={derivedField === 'gm'}
              error={fieldErrors.gm}
              onChange={handleChange('gm')}
              onFocus={() => setFocused('gm')}
              onBlur={handleBlur('gm')}
            />
          </div>
          {focused !== null && <span className="sr-only">Editing {focused}</span>}
        </section>

        {/* Results card */}
        <ResultsCard values={calc.values} derivedField={calc.derivedField} error={calc.error} />
      </main>

      <Footer />
    </div>
  );
}
