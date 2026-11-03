import { Info } from 'lucide-react';
import { minutesToHHMM, type Booking } from '@/lib/availability';

interface BookingListProps {
  bookings: Booking[];
}

export function BookingList({ bookings }: BookingListProps) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
        <Info className="w-4 h-4 text-slate-400" />
        Existing bookings <span className="text-slate-400 normal-case font-normal">(read-only)</span>
      </h2>
      <div className="flex flex-col gap-2">
        {bookings.map((b, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5"
          >
            <span className="text-sm font-semibold text-slate-600">
              Booking {i + 1}
            </span>
            <span className="text-sm font-mono font-semibold text-slate-700">
              {minutesToHHMM(b.start)} – {minutesToHHMM(b.end)}
            </span>
            <span className="text-xs text-slate-400">
              ({b.end - b.start} min)
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
