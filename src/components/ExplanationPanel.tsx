import { useEffect, useRef, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  explainAvailability,
  type SimulateMode,
} from '@/lib/explain/mockAdapter';
import {
  FALLBACK_EXPLANATION,
  type ExplainInput,
} from '@/lib/explain/contract';

interface ExplanationPanelProps {
  input: ExplainInput;
}

const SIMULATE_OPTIONS: Array<{ value: SimulateMode; label: string }> = [
  { value: 'ok', label: 'OK' },
  { value: 'timeout', label: 'Timeout' },
  { value: 'error', label: 'API error' },
  { value: 'no-key', label: 'No key' },
];

export function ExplanationPanel({ input }: ExplanationPanelProps) {
  const [mode, setMode] = useState<SimulateMode>('ok');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const requestSeq = useRef(0);

  // When inputs change, drop the shown explanation and invalidate any
  // in-flight request so it can never write its old text afterwards.
  useEffect(() => {
    requestSeq.current++;
    setExplanation(null);
    setPending(false);
  }, [input.roomLabel, input.start, input.end, input.isAvailable, input.reasonCode]);

  const handleExplain = async () => {
    const seq = ++requestSeq.current;
    setPending(true);
    setExplanation(null);
    const output = await explainAvailability(input, mode);
    if (seq !== requestSeq.current) return; // superseded by a newer request
    setExplanation(output.explanation);
    setPending(false);
  };

  return (
    <section className="bg-slate-100 rounded-2xl border border-slate-200 p-4 mb-5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleExplain}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {pending ? 'Explaining…' : 'Explain availability'}
        </button>
        <label className="inline-flex items-center gap-2 text-xs text-slate-500">
          Simulate
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as SimulateMode)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700"
          >
            {SIMULATE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {(pending || explanation !== null) && (
        <div
          data-testid="explanation-box"
          className="mt-3 rounded-xl bg-slate-200/70 border border-slate-300 p-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
            AI-generated explanation (mock) — not a booking decision
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {pending ? 'Explaining…' : explanation ?? FALLBACK_EXPLANATION}
          </p>
        </div>
      )}
    </section>
  );
}
