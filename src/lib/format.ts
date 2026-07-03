/**
 * Parsing & formatting helpers (PRD §6, §14).
 * Currency: thousand separators, up to 2 decimals, e.g. 1,200,000 / 75,500.50
 * Percent: up to 2 decimals, trailing zeros removed, e.g. 35% / 42.75%
 */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Parse a currency string like "1,200,000.50" (symbol/commas/spaces tolerated). */
export function parseCurrency(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.\-]/g, '');
  if (cleaned === '' || cleaned === '.' || cleaned === '-') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Parse a percent string: accepts "35" or "35%" → 0.35 (PRD §6). */
export function parsePercent(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.\-]/g, '');
  if (cleaned === '' || cleaned === '.' || cleaned === '-') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n / 100 : null;
}

/** 1200000 → "1,200,000"; 75500.5 → "75,500.50" (keep the entered cents). */
export function formatCurrencyNumber(n: number): string {
  const hasCents = Math.round(n * 100) % 100 !== 0;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Format with the configured symbol, e.g. "₹1,200,000". */
export function formatCurrency(n: number, symbol: string): string {
  return `${symbol}${formatCurrencyNumber(n)}`;
}

/** 0.35 → "35%", 0.4275 → "42.75%" (max 2 decimals, no trailing zeros). */
export function formatPercent(fraction: number): string {
  const pct = fraction * 100;
  const rounded = Math.round(pct * 100) / 100;
  return `${currencyFormatter.format(rounded)}%`;
}

/** Percent without the % sign, for showing inside the input. */
export function formatPercentNumber(fraction: number): string {
  const pct = fraction * 100;
  const rounded = Math.round(pct * 100) / 100;
  return currencyFormatter.format(rounded);
}
