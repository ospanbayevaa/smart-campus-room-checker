import { useMemo, useState } from 'react';
import { Building2 } from 'lucide-react';
import { checkRoomAvailability, isValidTimeRange } from '@/lib/availability';
import { filterRooms, getEquipmentOptions } from '@/lib/filters';
import { ROOMS, type Room } from '@/data/rooms';
import { RoomFilters } from '@/components/RoomFilters';
import { RoomList } from '@/components/RoomList';
import { ResultBanner } from '@/components/ResultBanner';
import { RequestForm } from '@/components/RequestForm';
import { BookingList } from '@/components/BookingList';
import { Timeline } from '@/components/Timeline';

const EQUIPMENT_OPTIONS = getEquipmentOptions(ROOMS);

export default function App() {
  const [start, setStart] = useState(660);
  const [end, setEnd] = useState(720);
  const [now, setNow] = useState(540);
  const [attendees, setAttendees] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('R214');

  const filteredRooms = useMemo(
    () => filterRooms(ROOMS, attendees, selectedEquipment),
    [attendees, selectedEquipment],
  );

  const selectedRoom: Room | null = useMemo(() => {
    const found = ROOMS.find((r) => r.id === selectedRoomId);
    if (found && filteredRooms.some((r) => r.id === found.id)) return found;
    return filteredRooms.length > 0 ? filteredRooms[0] : null;
  }, [selectedRoomId, filteredRooms]);

  const effectiveRoomId = selectedRoom?.id ?? selectedRoomId;

  const result = useMemo(() => {
    if (!selectedRoom) return null;
    return checkRoomAvailability(selectedRoom, start, end, now);
  }, [selectedRoom, start, end, now]);

  const hasValidRequest = isValidTimeRange(start, end);

  const handleToggleEquipment = (item: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-sky-600 text-white shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight truncate">
                {selectedRoom ? `${selectedRoom.id} — ${selectedRoom.name}` : 'Smart Campus'}
              </h1>
              <p className="text-sm text-slate-500">Availability Checker</p>
            </div>
          </div>
        </header>

        {/* Result banner */}
        {result && <ResultBanner result={result} />}

        {/* Filters */}
        <RoomFilters
          attendees={attendees}
          onAttendeesChange={setAttendees}
          equipmentOptions={EQUIPMENT_OPTIONS}
          selectedEquipment={selectedEquipment}
          onToggleEquipment={handleToggleEquipment}
        />

        {/* Room catalog */}
        <RoomList
          rooms={filteredRooms}
          selectedRoomId={effectiveRoomId}
          onSelect={setSelectedRoomId}
        />

        {/* Request form + timeline + bookings only when a room is selected */}
        {selectedRoom && (
          <>
            <RequestForm
              start={start}
              end={end}
              now={now}
              onStartChange={setStart}
              onEndChange={setEnd}
              onNowChange={setNow}
            />

            {/* Timeline */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">
                Timeline
              </h2>
              <Timeline
                start={start}
                end={end}
                now={now}
                blocked={selectedRoom.blocked}
                bookings={selectedRoom.bookings}
                available={result?.available ?? false}
                hasValidRequest={hasValidRequest}
              />
            </section>

            {/* Existing bookings */}
            <BookingList bookings={selectedRoom.bookings} />
          </>
        )}

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
