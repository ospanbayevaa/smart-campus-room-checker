import type { Booking } from '@/lib/availability';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
}

export const ROOMS: Room[] = [
  {
    id: 'R214',
    name: 'Smart Campus Lab',
    capacity: 20,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'R101',
    name: 'Seminar Room',
    capacity: 8,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [{ start: 720, end: 780 }],
  },
  {
    id: 'R305',
    name: 'Lecture Hall',
    capacity: 60,
    equipment: ['projector', 'microphone', 'video'],
    blocked: false,
    bookings: [
      { start: 540, end: 600 },
      { start: 840, end: 900 },
    ],
  },
  {
    id: 'R110',
    name: 'Media Studio',
    capacity: 12,
    equipment: ['projector', 'video'],
    blocked: true,
    bookings: [],
  },
];
