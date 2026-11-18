// @vitest-environment jsdom
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ExplanationPanel } from './ExplanationPanel';
import type { ExplainInput } from '@/lib/explain/contract';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const availableInput: ExplainInput = {
  roomLabel: 'R214 — Smart Campus Lab',
  start: 660,
  end: 720,
  isAvailable: true,
  reasonCode: 'AVAILABLE',
};

const unavailableInput: ExplainInput = {
  ...availableInput,
  roomLabel: 'R110 — Media Studio',
  isAvailable: false,
  reasonCode: 'BLOCKED',
};

describe('ExplanationPanel stale-result guard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('clears the shown explanation when the input changes after it resolved', async () => {
    const { rerender } = render(<ExplanationPanel input={availableInput} />);
    fireEvent.click(screen.getByRole('button', { name: /explain availability/i }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    expect(screen.getByText(/is available from 11:00 to 12:00/i)).toBeInTheDocument();

    rerender(<ExplanationPanel input={unavailableInput} />);

    expect(
      screen.queryByText(/is available from 11:00 to 12:00/i),
    ).not.toBeInTheDocument();
  });

  it('race: an explanation resolving after the input changed never renders', async () => {
    const { rerender } = render(<ExplanationPanel input={availableInput} />);
    fireEvent.click(screen.getByRole('button', { name: /explain availability/i }));

    // Change inputs BEFORE the request resolves.
    rerender(<ExplanationPanel input={unavailableInput} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    expect(
      screen.queryByText(/is available from 11:00 to 12:00/i),
    ).not.toBeInTheDocument();
  });
});
