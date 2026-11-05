import type { Room } from '@/data/rooms';

/**
 * Derive the unique equipment options from the room catalog in first-seen order.
 * Single source of truth so the filter toggles cannot drift from the fixture data.
 */
export function getEquipmentOptions(rooms: Room[]): string[] {
  const seen = new Set<string>();
  const options: string[] = [];
  for (const room of rooms) {
    for (const item of room.equipment) {
      if (!seen.has(item)) {
        seen.add(item);
        options.push(item);
      }
    }
  }
  return options;
}

/**
 * F1: keep a room only if capacity >= attendees
 * F2: keep a room only if it has ALL required equipment items
 * F4: return an empty array when nothing matches
 * Does not mutate the input array or the room objects.
 */
export function filterRooms(
  rooms: Room[],
  attendees: number,
  requiredEquipment: string[],
): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= attendees &&
      requiredEquipment.every((item) => room.equipment.includes(item)),
  );
}
