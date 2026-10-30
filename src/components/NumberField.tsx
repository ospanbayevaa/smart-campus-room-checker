import { useId } from 'react';
import { minutesToHHMM } from '@/lib/availability';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  hint?: string;
  invalid?: boolean;
}

export function NumberField({ label, value, onChange, min, max, hint, invalid }: NumberFieldProps) {
  const id = useId();
  const display = Number.isNaN(value) ? '' : String(value);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="flex items-stretch gap-2">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={display}
          min={min}
          max={max}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '') {
              onChange(NaN);
            } else {
              const n = Number(raw);
              onChange(Number.isNaN(n) ? NaN : Math.trunc(n));
            }
          }}
          className={`w-20 rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 transition ${
            invalid
              ? 'border-rose-400 focus:ring-rose-400/30 bg-rose-50'
              : 'border-slate-300 focus:ring-sky-400/30 bg-white'
          }`}
        />
        <div className="flex items-center px-3 rounded-lg bg-slate-100 text-slate-600 text-sm font-mono font-semibold min-w-[68px] justify-center">
          {Number.isNaN(value) ? '—' : minutesToHHMM(value)}
        </div>
      </div>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
