import type { Booking } from '@/lib/availability';

export type BookingSet = 'base' | 'multiple';

export const BOOKING_SETS: Record<BookingSet, Booking[]> = {
  base: [{ start: 600, end: 660 }],
  multiple: [
    { start: 600, end: 660 },
    { start: 780, end: 840 },
  ],
};

export const BOOKING_SET_LABELS: Record<BookingSet, string> = {
  base: 'Base: 600-660',
  multiple: 'Multiple: 600-660, 780-840',
};
