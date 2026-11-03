import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { AvailabilityResult } from '@/lib/availability';

interface ResultBannerProps {
  result: AvailabilityResult;
}

export function ResultBanner({ result }: ResultBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`sticky top-0 z-10 mb-5 rounded-2xl border-2 p-4 shadow-sm transition-all ${
        result.available
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-rose-50 border-rose-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {result.available ? (
          <CheckCircle2 className="w-7 h-7 text-emerald-500 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-7 h-7 text-rose-500 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <p
            className={`text-base font-bold ${
              result.available ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {result.available ? 'Available' : 'Unavailable'}
          </p>
          <p className="text-sm text-slate-600 mt-0.5 break-words">{result.reason}</p>
          {result.violations.length > 1 && (
            <ul className="mt-2 space-y-0.5">
              {result.violations.slice(1).map((v, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-rose-600"
                >
                  <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
