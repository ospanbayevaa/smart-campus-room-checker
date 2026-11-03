import { Clock } from 'lucide-react';
import { NumberField } from '@/components/NumberField';

interface RequestFormProps {
  start: number;
  end: number;
  now: number;
  onStartChange: (v: number) => void;
  onEndChange: (v: number) => void;
  onNowChange: (v: number) => void;
}

export function RequestForm({
  start,
  end,
  now,
  onStartChange,
  onEndChange,
  onNowChange,
}: RequestFormProps) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-slate-400" />
        Request a time slot
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <NumberField
          label="Start (min)"
          value={start}
          onChange={onStartChange}
          min={0}
          max={1440}
          hint="Minutes after midnight"
          invalid={!Number.isNaN(start) && start > end}
        />
        <NumberField
          label="End (min)"
          value={end}
          onChange={onEndChange}
          min={0}
          max={1440}
          hint="Minutes after midnight"
          invalid={!Number.isNaN(end) && end < start}
        />
      </div>

      <div className="mt-4">
        <NumberField
          label="Now (min)"
          value={now}
          onChange={onNowChange}
          min={0}
          max={1440}
          hint="Simulated current time — defaults to 540 (09:00)"
        />
      </div>
    </section>
  );
}
