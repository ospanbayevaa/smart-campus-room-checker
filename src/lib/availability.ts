export function minutesToHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export interface Booking {
  start: number;
  end: number;
}

export type AvailabilityResult = {
  available: boolean;
  reason: string;
  violations: string[];
};

/**
 * AC1 shape check: integers, 0 <= start < end <= 1440.
 * Shared by checkAvailability() and the UI so there is one source of truth.
 */
export function isValidTimeRange(start: number, end: number): boolean {
  return (
    Number.isInteger(start) &&
    Number.isInteger(end) &&
    start >= 0 &&
    end <= 1440 &&
    start < end
  );
}

/**
 * Returns all booking ranges that overlap the requested [start, end) interval.
 * Touching at an endpoint is NOT overlap: [300, 360) and [360, 420) are fine.
 */
export function findOverlaps(start: number, end: number, bookings: Booking[]): Booking[] {
  return bookings.filter((b) => start < b.end && b.start < end);
}

/**
 * Evaluates the full set of acceptance criteria and returns a result.
 * AC1-AC6 are implemented in their exact meaning.
 */
export function checkAvailability(
  start: number,
  end: number,
  now: number,
  blocked: boolean,
  bookings: Booking[]
): AvailabilityResult {
  const violations: string[] = [];

  // AC3: if blocked, always Unavailable — short-circuit everything else.
  if (blocked) {
    return {
      available: false,
      reason: 'Room is marked as blocked. It is unavailable regardless of time.',
      violations: ['Room is blocked'],
    };
  }

  // AC1: integers, 0 <= start < end <= 1440, start strictly after now.
  // isValidTimeRange is the shared shape check; when it fails we still produce
  // the granular violation messages the UI and tests rely on.
  if (!isValidTimeRange(start, end)) {
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      violations.push('Start and end must be whole numbers (integers).');
    }
    if (start < 0 || end > 1440) {
      violations.push('Time must be within 0–1440 minutes (00:00 to 24:00).');
    }
    if (start >= end) {
      violations.push('Start must be before end.');
    }
  }
  if (start <= now) {
    violations.push(`Start must be strictly after "now" (${minutesToHHMM(now)}).`);
  }

  // AC2: duration <= 120 minutes (exactly 120 allowed).
  if (end - start > 120) {
    violations.push(`Duration is ${end - start} min — the maximum is 120 minutes.`);
  }

  // AC4: reject overlap with any booking; touching at an endpoint is NOT overlap.
  if (violations.length === 0) {
    const overlaps = findOverlaps(start, end, bookings);
    if (overlaps.length > 0) {
      const ranges = overlaps
        .map((b) => `${minutesToHHMM(b.start)}–${minutesToHHMM(b.end)}`)
        .join(', ');
      violations.push(`Overlaps existing booking${overlaps.length > 1 ? 's' : ''}: ${ranges}.`);
    }
  }

  if (violations.length > 0) {
    return {
      available: false,
      reason: violations[0],
      violations,
    };
  }

  // AC5: show a clear Available result; never modify the bookings.
 
  return {
    available: true,
    reason: `Available from ${minutesToHHMM(start)} to ${minutesToHHMM(end)} (${end - start} min).`,
    violations: [],
  };
}

export interface DayRange {
  start: number;
  end: number;
}

export const FULL_DAY: DayRange = { start: 0, end: 1440 };

/**
 * Thin wrapper around checkAvailability that pulls blocked and bookings
 * from a Room object so callers don't assemble them by hand.
 */
export function checkRoomAvailability(
  room: { blocked: boolean; bookings: Booking[] },
  start: number,
  end: number,
  now: number,
): AvailabilityResult {
  return checkAvailability(start, end, now, room.blocked, room.bookings);
}
