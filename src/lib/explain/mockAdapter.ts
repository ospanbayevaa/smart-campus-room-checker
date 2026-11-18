import { minutesToHHMM } from '@/lib/availability';
import {
  validateInput,
  validateOutput,
  FALLBACK_EXPLANATION,
  type ExplainInput,
  type ExplainOutput,
} from './contract';

export type SimulateMode = 'ok' | 'timeout' | 'error' | 'no-key';

const TIMEOUT_MS = 3000;
const OK_DELAY_MS = 400;

function fallback(): ExplainOutput {
  return { explanation: FALLBACK_EXPLANATION };
}

function buildExplanation(input: ExplainInput): ExplainOutput {
  const from = minutesToHHMM(input.start);
  const to = minutesToHHMM(input.end);
  let explanation: string;
  switch (input.reasonCode) {
    case 'AVAILABLE':
      explanation = `${input.roomLabel} is available from ${from} to ${to}. The request meets all booking rules.`;
      break;
    case 'BLOCKED':
      explanation = `${input.roomLabel} is marked as blocked, so it is unavailable at any time.`;
      break;
    case 'OVERLAP':
      explanation = `${input.roomLabel} is unavailable from ${from} to ${to} because the slot overlaps an existing booking.`;
      break;
    case 'TOO_LONG':
      explanation = `${input.roomLabel} is unavailable for ${from} to ${to} because the slot exceeds the 120-minute maximum.`;
      break;
    case 'PAST_TIME':
      explanation = `${input.roomLabel} is unavailable from ${from} because the start is not strictly after "now".`;
      break;
    case 'INVALID_NOW':
      explanation = `${input.roomLabel} cannot be checked because "now" is not a valid whole number from 0 to 1440.`;
      break;
    case 'INVALID_TIME':
    default:
      explanation = `${input.roomLabel} cannot be checked because the requested times are not valid.`;
      break;
  }
  if (!input.isAvailable) {
    explanation = explanation.replace(/\bavailable\b/g, (m) => `un${m}`);
  }
  return { explanation };
}

export async function explainAvailability(
  input: ExplainInput,
  mode: SimulateMode,
): Promise<ExplainOutput> {
  if (mode === 'no-key' || mode === 'error') {
    return fallback();
  }
  if (mode === 'timeout') {
    // The simulated backend never answers; the 3s deadline resolves to the fallback.
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(fallback()), TIMEOUT_MS);
      if (typeof timer.unref === 'function') timer.unref();
    });
  }
  if (!validateInput(input)) {
    return fallback();
  }
  const output = buildExplanation(input);
  if (!validateOutput(output, input.isAvailable)) {
    return fallback();
  }
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(output), OK_DELAY_MS);
    if (typeof timer.unref === 'function') timer.unref();
  });
}
