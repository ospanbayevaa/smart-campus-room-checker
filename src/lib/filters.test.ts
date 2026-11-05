import { describe, it, expect } from 'vitest';
import { filterRooms, getEquipmentOptions } from './filters';
import { checkRoomAvailability } from './availability';
import { ROOMS, type Room } from '@/data/rooms';

function freshRooms(): Room[] {
  return ROOMS.map((r) => ({
    ...r,
    equipment: [...r.equipment],
    bookings: r.bookings.map((b) => ({ ...b })),
  }));
}

describe('filterRooms and checkRoomAvailability', () => {
  it('F01 F1: attendees 20 -> R214 is included (exact capacity)', () => {
    const rooms = freshRooms();
    const result = filterRooms(rooms, 20, []);
    expect(result.some((r) => r.id === 'R214')).toBe(true);
  });

  it('F02 F1: attendees 21 -> R214 is not included (insufficient capacity)', () => {
    const rooms = freshRooms();
    const result = filterRooms(rooms, 21, []);
    expect(result.some((r) => r.id === 'R214')).toBe(false);
  });

  it('F03 F2: [projector, whiteboard] -> only R214', () => {
    const rooms = freshRooms();
    const result = filterRooms(rooms, 0, ['projector', 'whiteboard']);
    expect(result.map((r) => r.id)).toEqual(['R214']);
  });

  it('F04 F2: [projector] -> R214, R305, R110 (not R101)', () => {
    const rooms = freshRooms();
    const result = filterRooms(rooms, 0, ['projector']);
    expect(result.map((r) => r.id)).toEqual(['R214', 'R305', 'R110']);
  });

  it('F05 F3: checkRoomAvailability(R110, 660, 720, 540) -> available false (blocked)', () => {
    const rooms = freshRooms();
    const r110 = rooms.find((r) => r.id === 'R110')!;
    const result = checkRoomAvailability(r110, 660, 720, 540);
    expect(result.available).toBe(false);
  });

  it('F06 F4: attendees 100 -> empty array', () => {
    const rooms = freshRooms();
    const result = filterRooms(rooms, 100, []);
    expect(result).toEqual([]);
  });

  it('F07 F5: 600-630 at now 540 -> R214 available false, R101 available true (each room uses its own bookings)', () => {
    const rooms = freshRooms();
    const r214 = rooms.find((r) => r.id === 'R214')!;
    const r101 = rooms.find((r) => r.id === 'R101')!;
    const result214 = checkRoomAvailability(r214, 600, 630, 540);
    const result101 = checkRoomAvailability(r101, 600, 630, 540);
    expect(result214.available).toBe(false);
    expect(result101.available).toBe(true);
  });

  it('F08 AC5: ROOMS is unchanged after filterRooms and checkRoomAvailability (compare JSON before/after)', () => {
    const before = JSON.stringify(ROOMS);
    filterRooms(ROOMS, 10, ['projector']);
    checkRoomAvailability(ROOMS[0], 660, 720, 540);
    const after = JSON.stringify(ROOMS);
    expect(after).toBe(before);
  });
});

describe('getEquipmentOptions', () => {
  it('E01: returns unique equipment from ROOMS in first-seen order', () => {
    expect(getEquipmentOptions(ROOMS)).toEqual(['projector', 'whiteboard', 'microphone', 'video']);
  });

  it('E02: removes duplicate equipment across rooms', () => {
    const rooms: Room[] = [
      { id: 'A', name: 'A', capacity: 1, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
      { id: 'B', name: 'B', capacity: 1, equipment: ['projector', 'microphone'], blocked: false, bookings: [] },
      { id: 'C', name: 'C', capacity: 1, equipment: ['whiteboard', 'microphone'], blocked: false, bookings: [] },
    ];
    expect(getEquipmentOptions(rooms)).toEqual(['projector', 'whiteboard', 'microphone']);
  });

  it('E03: returns an empty array for an empty room list', () => {
    expect(getEquipmentOptions([])).toEqual([]);
  });

  it('E04: does not mutate the rooms array or its equipment entries', () => {
    const rooms = freshRooms();
    const before = JSON.stringify(rooms);
    getEquipmentOptions(rooms);
    expect(JSON.stringify(rooms)).toBe(before);
  });
});
