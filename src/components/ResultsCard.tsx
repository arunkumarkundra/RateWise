import { Field } from '../lib/calc';
import { formatCurrency, formatPercent } from '../lib/format';
import { CURRENCY_SYMBOL } from '../config';

interface ResultsCardProps {
  values: { salary: number; monthlySalary: number; rate: number; gm: number; markup: number } | null;
  derivedField: Field | null;
  error: string | null;
}

interface RowProps {
  label: string;
  value: string;
  highlighted?: boolean;
}

function Row({ label, value, highlighted }: RowProps) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 rounded-xl px-3 py-2.5 ${
        highlighted ? 'bg-accent-soft' : ''
      }`}
    >
      <span className={`text-sm ${highlighted ? 'font-semibold text-accent-strong' : 'text-muted'}`}>
        {label}
        {highlighted && <span className="ml-2 text-xs font-medium uppercase tracking-wide">calculated</span>}
      </span>
      <span
        className={`tnum text-right font-display ${
          highlighted ? 'text-2xl font-bold text-accent-strong sm:text-3xl' : 'text-lg font-semibold text-ink'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function ResultsCard({ values, derivedField, error }: ResultsCardProps) {
  return (
    <section
      aria-label="Results"
      aria-live="polite"
      className="rounded-2xl bg-card p-5 shadow-card sm:p-6"
    >
      <h2 className="mb-4 font-display text-lg font-bold">Results</h2>

      {error ? (
        <p className="rounded-xl bg-warn/10 px-3 py-3 text-sm text-warn">{error}</p>
      ) : values ? (
        <div className="space-y-1">
          <Row
            label="Annual salary"
            value={formatCurrency(values.salary, CURRENCY_SYMBOL)}
            highlighted={derivedField === 'salary'}
          />
          <Row label="Monthly salary" value={formatCurrency(values.monthlySalary, CURRENCY_SYMBOL)} />
          <Row
            label="Monthly billing rate"
            value={formatCurrency(values.rate, CURRENCY_SYMBOL)}
            highlighted={derivedField === 'rate'}
          />
          <Row label="Gross margin" value={formatPercent(values.gm)} highlighted={derivedField === 'gm'} />
          <Row label="Markup" value={formatPercent(values.markup)} />
        </div>
      ) : (
        <p className="rounded-xl bg-paper px-3 py-6 text-center text-sm text-muted">
          Enter any two values on the left — the third is calculated instantly.
        </p>
      )}
    </section>
  );
}
