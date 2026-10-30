import { useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Lock,
  Unlock,
  Info,
} from 'lucide-react';
import {
  BOOKING_SETS,
  BOOKING_SET_LABELS,
  checkAvailability,
  minutesToHHMM,
  type BookingSet,
} from '@/lib/availability';
import { NumberField } from '@/components/NumberField';
import { Timeline } from '@/components/Timeline';

const ROOM_NAME = 'Room 214 — Smart Campus Lab';

const VALID_RANGE = (n: number) => Number.isInteger(n) && n >= 0 && n <= 1440;

export default function App() {
  const [start, setStart] = useState(660);
  const [end, setEnd] = useState(720);
  const [now, setNow] = useState(540);
  const [blocked, setBlocked] = useState(false);
  const [bookingSet, setBookingSet] = useState<BookingSet>('base');

  const bookings = useMemo(() => BOOKING_SETS[bookingSet], [bookingSet]);

  const result = useMemo(
    () => checkAvailability(start, end, now, blocked, bookings),
    [start, end, now, blocked, bookings]
  );

  const hasValidRequest = VALID_RANGE(start) && VALID_RANGE(end) && start < end;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-sky-600 text-white shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">
                {ROOM_NAME}
              </h1>
              <p className="text-sm text-slate-500">Availability Checker</p>
            </div>
          </div>
        </header>

        {/* Result banner (top, sticky on mobile) */}
        <div
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

        {/* Inputs card */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Request a time slot
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Start (min)"
              value={start}
              onChange={setStart}
              min={0}
              max={1440}
              hint="Minutes after midnight"
              invalid={!Number.isNaN(start) && start > end}
            />
            <NumberField
              label="End (min)"
              value={end}
              onChange={setEnd}
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
              onChange={setNow}
              min={0}
              max={1440}
              hint="Simulated current time — defaults to 540 (09:00)"
            />
          </div>

          {/* Blocked toggle */}
          <button
            type="button"
            onClick={() => setBlocked(!blocked)}
            className={`mt-4 w-full flex items-center justify-between rounded-xl border px-4 py-3 transition ${
              blocked
                ? 'bg-rose-50 border-rose-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              {blocked ? (
                <Lock className="w-4 h-4 text-rose-500" />
              ) : (
                <Unlock className="w-4 h-4 text-slate-400" />
              )}
              Room blocked
            </span>
            <span
              className={`relative w-11 h-6 rounded-full transition-colors ${
                blocked ? 'bg-rose-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  blocked ? 'translate-x-5' : ''
                }`}
              />
            </span>
          </button>

          {/* Booking set selector */}
          <div className="mt-4">
            <label
              htmlFor="booking-set"
              className="text-sm font-semibold text-slate-700 mb-1 block"
            >
              Booking set
            </label>
            <select
              id="booking-set"
              value={bookingSet}
              onChange={(e) => setBookingSet(e.target.value as BookingSet)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/30"
            >
              {(Object.keys(BOOKING_SET_LABELS) as BookingSet[]).map((k) => (
                <option key={k} value={k}>
                  {BOOKING_SET_LABELS[k]}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">
            Timeline
          </h2>
          <Timeline
            start={start}
            end={end}
            now={now}
            blocked={blocked}
            bookings={bookings}
            available={result.available}
            hasValidRequest={hasValidRequest}
          />
        </section>

        {/* Existing bookings (read-only) */}
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

        {/* Rules summary */}
        <section className="bg-slate-50 rounded-2xl border border-slate-200 p-5 mb-2">
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">
            Rules
          </h2>
          <ul className="text-xs text-slate-500 space-y-1.5 leading-relaxed">
            <li>• Times are in minutes after midnight (0–1440). Start must be before end, and start must be strictly after "now".</li>
            <li>• Maximum slot length is 120 minutes (exactly 120 is allowed).</li>
            <li>• If the room is blocked, it is always unavailable.</li>
            <li>• The request must not overlap any existing booking. Touching at an endpoint is fine.</li>
            <li>• Bookings are never modified — this page only checks availability.</li>
          </ul>
        </section>

        <p className="text-center text-[11px] text-slate-400 mt-4">
          Frontend prototype · No data is sent or stored
        </p>
      </div>
    </div>
  );
}
