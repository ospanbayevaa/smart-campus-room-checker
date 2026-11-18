import type { ReasonCode } from './reasonCode';

export const REASON_CODES: readonly ReasonCode[] = [
  'AVAILABLE',
  'BLOCKED',
  'OVERLAP',
  'TOO_LONG',
  'PAST_TIME',
  'INVALID_TIME',
  'INVALID_NOW',
];

export interface ExplainInput {
  roomLabel: string;
  start: number;
  end: number;
  isAvailable: boolean;
  reasonCode: ReasonCode;
}

export interface ExplainOutput {
  explanation: string;
}

export const FALLBACK_EXPLANATION =
  'Explanation is unavailable right now. The status above is confirmed by the booking rules.';

function isValidTime(start: number, end: number): boolean {
  return (
    Number.isInteger(start) &&
    Number.isInteger(end) &&
    start >= 0 &&
    end <= 1440 &&
    start < end
  );
}

export function validateInput(input: unknown): boolean {
  if (typeof input !== 'object' || input === null) return false;
  const { roomLabel, start, end, isAvailable, reasonCode } = input as Record<string, unknown>;
  if (typeof roomLabel !== 'string') return false;
  const trimmed = roomLabel.trim();
  if (trimmed.length === 0 || trimmed.length > 60) return false;
  if (typeof start !== 'number' || typeof end !== 'number') return false;
  if (!isValidTime(start, end)) return false;
  if (typeof isAvailable !== 'boolean') return false;
  if (typeof reasonCode !== 'string' || !REASON_CODES.includes(reasonCode as ReasonCode)) {
    return false;
  }
  return true;
}

function sentenceCount(text: string): number {
  const body = text.trim().replace(/\.*$/, '');
  if (body.length === 0) return 0;
  return body.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim().length > 0).length;
}

function contradictsStatus(text: string, isAvailable: boolean): boolean {
  const lower = text.toLowerCase();
  if (isAvailable) {
    return /\bunavailable\b/.test(lower) || /\bblocked\b/.test(lower);
  }
  return /\bavailable\b/.test(lower);
}

export function validateOutput(output: unknown, isAvailable: boolean): boolean {
  if (typeof output !== 'object' || output === null) return false;
  const keys = Object.keys(output).sort();
  if (keys.length !== 1 || keys[0] !== 'explanation') return false;
  const { explanation } = output as Record<string, unknown>;
  if (typeof explanation !== 'string') return false;
  if (explanation.length === 0 || explanation.length > 300) return false;
  const sentences = sentenceCount(explanation);
  if (sentences < 1 || sentences > 2) return false;
  if (contradictsStatus(explanation, isAvailable)) return false;
  return true;
}
