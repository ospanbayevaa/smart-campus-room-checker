import type { Room } from '@/data/rooms';

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
