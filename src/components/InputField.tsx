import { ChangeEvent } from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  helper?: string;
  prefix?: string;
  suffix?: string;
  value: string;
  placeholder?: string;
  /** True when this field's value is being auto-calculated. */
  derived: boolean;
  error?: string | null;
  onChange: (raw: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export default function InputField({
  id,
  label,
  helper,
  prefix,
  suffix,
  value,
  placeholder,
  derived,
  error,
  onChange,
  onFocus,
  onBlur,
}: InputFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {derived && (
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent-strong">
            auto
          </span>
        )}
      </div>
      <div
        className={`flex items-center rounded-xl border bg-white transition-colors focus-within:border-accent ${
          error ? 'border-warn' : derived ? 'border-accent/40 bg-accent-soft/40' : 'border-line'
        }`}
      >
        {prefix && (
          <span aria-hidden="true" className="pl-3 text-muted">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          className="tnum w-full bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-muted/50"
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        />
        {suffix && (
          <span aria-hidden="true" className="pr-3 text-muted">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-warn">
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="mt-1.5 text-xs text-muted">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
