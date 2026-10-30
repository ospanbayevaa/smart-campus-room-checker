import { describe, it, expect } from 'vitest';
import { checkAvailability, type Booking } from './availability';

interface Fixture {
  now: number;
  blocked: boolean;
  bookings: Booking[];
}

const DEFAULT_FIXTURE: Fixture = {
  now: 540,
  blocked: false,
  bookings: [{ start: 600, end: 660 }],
};

function makeFixture(overrides?: Partial<Fixture>): Fixture {
  return {
    now: overrides?.now ?? DEFAULT_FIXTURE.now,
    blocked: overrides?.blocked ?? DEFAULT_FIXTURE.blocked,
    bookings: overrides?.bookings
      ? overrides.bookings.map((b) => ({ ...b }))
      : DEFAULT_FIXTURE.bookings.map((b) => ({ ...b })),
  };
}

describe('checkAvailability — AC1–AC6', () => {
  // ──────────────────────────────────────────────
  //  AC1: integers, 0 <= start < end <= 1440, start strictly after now
  // ──────────────────────────────────────────────

  it('T02 AC1: start == now is not strictly after now — false', () => {
    const f = makeFixture();
    const result = checkAvailability(540, 570, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T03 AC1: start == end — false', () => {
    const f = makeFixture();
    const result = checkAvailability(720, 720, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T04 AC1: start > end — false', () => {
    const f = makeFixture();
    const result = checkAvailability(750, 720, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T05 AC1: end > 1440 — false', () => {
    const f = makeFixture();
    const result = checkAvailability(1380, 1441, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T16 AC1: end exactly at 1440 is valid — true', () => {
    const f = makeFixture();
    const result = checkAvailability(1380, 1440, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(true);
    expect(result.violations).toHaveLength(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T17 AC1: start one minute after now is strictly after — true', () => {
    const f = makeFixture();
    const result = checkAvailability(541, 600, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(true);
    expect(result.violations).toHaveLength(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T18 AC1: non-integer start is rejected — false', () => {
    const f = makeFixture();
    const result = checkAvailability(660.5, 720, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T19 AC1: negative start is rejected — false', () => {
    const f = makeFixture();
    const result = checkAvailability(-1, 60, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────
  //  AC2: duration <= 120 minutes (exactly 120 allowed)
  // ──────────────────────────────────────────────

  it('T06 AC2: exactly 120 minutes is allowed — true', () => {
    const f = makeFixture();
    const result = checkAvailability(720, 840, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(true);
    expect(result.violations).toHaveLength(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T07 AC2: 121 minutes exceeds the limit — false', () => {
    const f = makeFixture();
    const result = checkAvailability(720, 841, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────
  //  AC3: if blocked, always Unavailable
  // ──────────────────────────────────────────────

  it('T13 AC3: blocked is always unavailable even with a valid slot — false', () => {
    const f = makeFixture({ blocked: true });
    const result = checkAvailability(660, 720, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────
  //  AC4: reject overlap; touching at an endpoint is NOT overlap
  // ──────────────────────────────────────────────

  it('T01 AC4: touching after a booking (start == booking end) — true', () => {
    const f = makeFixture();
    const result = checkAvailability(660, 720, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(true);
    expect(result.violations).toHaveLength(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T08 AC4: touching before a booking (end == booking start) — true', () => {
    const f = makeFixture();
    const result = checkAvailability(570, 600, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(true);
    expect(result.violations).toHaveLength(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T09 AC4: partial overlap from the left — false', () => {
    const f = makeFixture();
    const result = checkAvailability(630, 690, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T10 AC4: full overlap enclosing the booking — false', () => {
    const f = makeFixture();
    const result = checkAvailability(570, 690, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T11 AC4: slot entirely inside the booking — false', () => {
    const f = makeFixture();
    const result = checkAvailability(615, 645, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T12 AC4: exact same interval as booking — false', () => {
    const f = makeFixture();
    const result = checkAvailability(600, 660, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  it('T14 AC4: no bookings means no overlap possible — true', () => {
    const f = makeFixture({ bookings: [] });
    const result = checkAvailability(630, 690, f.now, f.blocked, f.bookings);
    expect(result.available).toBe(true);
    expect(result.violations).toHaveLength(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────
  //  AC5: clear Available/Unavailable result; never modify the bookings
  // ──────────────────────────────────────────────

  it('T15 AC5: bookings array is unchanged after the call', () => {
    const f = makeFixture();
    const before = JSON.stringify(f.bookings);
    const result = checkAvailability(660, 720, f.now, f.blocked, f.bookings);
    const after = JSON.stringify(f.bookings);
    expect(result.available).toBe(true);
    expect(after).toBe(before);
  });
});
