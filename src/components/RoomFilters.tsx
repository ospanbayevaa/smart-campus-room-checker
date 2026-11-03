import { Users } from 'lucide-react';

interface RoomFiltersProps {
  attendees: number;
  onAttendeesChange: (v: number) => void;
  equipmentOptions: string[];
  selectedEquipment: string[];
  onToggleEquipment: (item: string) => void;
}

export function RoomFilters({
  attendees,
  onAttendeesChange,
  equipmentOptions,
  selectedEquipment,
  onToggleEquipment,
}: RoomFiltersProps) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
        <Users className="w-4 h-4 text-slate-400" />
        Filter rooms
      </h2>

      <div>
        <label htmlFor="attendees" className="text-sm font-semibold text-slate-700 mb-1 block">
          Attendees
        </label>
        <input
          id="attendees"
          type="number"
          inputMode="numeric"
          min={0}
          value={Number.isNaN(attendees) ? '' : String(attendees)}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '') {
              onAttendeesChange(NaN);
            } else {
              const n = Number(raw);
              onAttendeesChange(Number.isNaN(n) ? NaN : Math.max(0, Math.trunc(n)));
            }
          }}
          className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/30"
        />
      </div>

      <div className="mt-4">
        <span className="text-sm font-semibold text-slate-700 mb-2 block">Equipment</span>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map((item) => {
            const checked = selectedEquipment.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => onToggleEquipment(item)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium capitalize transition ${
                  checked
                    ? 'bg-sky-600 border-sky-600 text-white'
                    : 'bg-white border-slate-300 text-slate-600 hover:border-sky-300'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
