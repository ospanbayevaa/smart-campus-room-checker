import { Lock, Users } from 'lucide-react';
import type { Room } from '@/data/rooms';

interface RoomListProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelect: (id: string) => void;
}

export function RoomList({ rooms, selectedRoomId, onSelect }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm font-semibold text-slate-500">
            No rooms match your requirements.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Try lowering the number of attendees or removing equipment filters.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">
        Select a room
      </h2>
      <div className="grid gap-3">
        {rooms.map((room) => {
          const isSelected = room.id === selectedRoomId;
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onSelect(room.id)}
              className={`text-left rounded-xl border-2 p-4 transition ${
                isSelected
                  ? 'border-sky-500 bg-sky-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 leading-tight">
                    {room.name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{room.id}</p>
                </div>
                {room.blocked && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[11px] font-bold uppercase tracking-wide flex-shrink-0">
                    <Lock className="w-3 h-3" />
                    Blocked
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Users className="w-3 h-3" />
                  {room.capacity}
                </span>
                <span className="text-slate-300">·</span>
                <div className="flex flex-wrap gap-1">
                  {room.equipment.map((eq) => (
                    <span
                      key={eq}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium capitalize"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
