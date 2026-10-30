import { minutesToHHMM } from '@/lib/availability';

interface TimelineProps {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
  available: boolean;
  hasValidRequest: boolean;
}

const TRACK_HEIGHT = 56;

export function Timeline({ start, end, now, blocked, bookings, available, hasValidRequest }: TimelineProps) {
  const totalMinutes = 1440;
  const pct = (m: number) => `${(m / totalMinutes) * 100}%`;

  // Hour ticks: 0, 2, 4, ... 24
  const ticks = Array.from({ length: 25 }, (_, i) => i * 60);

  return (
    <div className="w-full select-none">
      {/* Hour labels — every 6h on narrow screens, every 3h on sm+ */}
      <div className="relative h-5 mb-1">
        {[0, 360, 720, 1080, 1440].map((m) => (
          <div
            key={m}
            className="absolute -translate-x-1/2 text-[10px] font-medium text-slate-400"
            style={{ left: pct(m) }}
          >
            {minutesToHHMM(m)}
          </div>
        ))}
        {[180, 540, 900, 1260].map((m) => (
          <div
            key={m}
            className="absolute -translate-x-1/2 text-[10px] font-medium text-slate-400 hidden sm:block"
            style={{ left: pct(m) }}
          >
            {minutesToHHMM(m)}
          </div>
        ))}
      </div>

      {/* Track */}
      <div
        className="relative rounded-xl bg-slate-100 border border-slate-200 overflow-hidden"
        style={{ height: TRACK_HEIGHT }}
      >
        {/* Hour grid lines */}
        {ticks.map((m) => (
          <div
            key={m}
            className={`absolute top-0 bottom-0 ${m % 120 === 0 ? 'bg-slate-200' : 'bg-slate-200/40'}`}
            style={{ left: pct(m), width: 1 }}
          />
        ))}

        {/* Existing bookings */}
        {bookings.map((b, i) => (
          <div
            key={i}
            title={`Booking ${i + 1}: ${minutesToHHMM(b.start)}–${minutesToHHMM(b.end)}`}
            className="absolute top-1.5 bottom-1.5 rounded-md bg-slate-300 border border-slate-400/40"
            style={{ left: pct(b.start), width: `calc(${pct(b.end - b.start)})` }}
          />
        ))}

        {/* "Now" marker */}
        {now >= 0 && now <= 1440 && (
          <div
            className="absolute top-0 bottom-0"
            style={{ left: pct(now) }}
          >
            <div className="w-px h-full bg-amber-500" />
            <div className="absolute top-0 -translate-x-1/2 text-[9px] font-bold text-amber-600 bg-amber-50 px-1 rounded-b">
              now
            </div>
          </div>
        )}

        {/* Requested interval — only render if it's a sane range */}
        {hasValidRequest && start >= 0 && end <= 1440 && start < end && (
          <div
            className={`absolute bottom-1 rounded-md border-2 flex items-center justify-center overflow-hidden ${
              available
                ? 'bg-emerald-200 border-emerald-500 text-emerald-700'
                : 'bg-rose-200 border-rose-500 text-rose-700'
            } ${blocked ? 'opacity-60' : ''}`}
            title={`Request: ${minutesToHHMM(start)}–${minutesToHHMM(end)}`}
            style={{
              left: pct(start),
              width: `calc(${pct(end - start)})`,
              top: TRACK_HEIGHT - 18,
              height: 14,
            }}
          />
        )}

        {/* Blocked overlay */}
        {blocked && (
          <div className="absolute inset-0 bg-rose-50/60 flex items-center justify-center">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">
              Room Blocked
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-slate-300 border border-slate-400/40 inline-block" />
          Booking
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-200 border-2 border-emerald-500 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-rose-200 border-2 border-rose-500 inline-block" />
          Unavailable
        </span>
        <span className="flex items-center gap-1">
          <span className="w-px h-3 bg-amber-500 inline-block" />
          Now
        </span>
      </div>
    </div>
  );
}
