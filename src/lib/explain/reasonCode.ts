import type { AvailabilityResult } from '@/lib/availability';

export type ReasonCode =
  | 'AVAILABLE'
  | 'BLOCKED'
  | 'OVERLAP'
  | 'TOO_LONG'
  | 'PAST_TIME'
  | 'INVALID_TIME'
  | 'INVALID_NOW';

const CODE_ORDER: Array<{ code: ReasonCode; test: (reason: string) => boolean }> = [
  { code: 'BLOCKED', test: (r) => /blocked/i.test(r) },
  { code: 'INVALID_TIME', test: (r) => /whole numbers|integers/i.test(r) },
  { code: 'INVALID_TIME', test: (r) => /before end/i.test(r) },
  { code: 'INVALID_NOW', test: (r) => /whole number from 0 to 1440/i.test(r) || /current time/i.test(r) },
  { code: 'PAST_TIME', test: (r) => /strictly after/i.test(r) },
  { code: 'TOO_LONG', test: (r) => /maximum is 120/i.test(r) },
  { code: 'OVERLAP', test: (r) => /overlaps existing booking/i.test(r) },
];

/**
 * Pure mapping from a checkAvailability result to a reason code.
 * The checker's first violation is authoritative; unrecognized
 * unavailable reasons fall back to INVALID_TIME.
 */
export function getReasonCode(result: AvailabilityResult): ReasonCode {
  if (result.available) return 'AVAILABLE';
  if (result.violations.length === 0) return 'INVALID_TIME';
  const reason = result.violations[0];
  for (const entry of CODE_ORDER) {
    if (entry.test(reason)) return entry.code;
  }
  return 'INVALID_TIME';
}
