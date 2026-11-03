// @vitest-environment jsdom
import { afterEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from './App';

afterEach(() => cleanup());

describe('App UI', () => {
  it('UI1 F5: R214 unavailable at 600-630, R101 available', () => {
    render(<App />);

    // Set Start to 600
    const startInput = screen.getByLabelText('Start (min)');
    fireEvent.change(startInput, { target: { value: '600' } });

    // Set End to 630
    const endInput = screen.getByLabelText('End (min)');
    fireEvent.change(endInput, { target: { value: '630' } });

    // R214 is selected by default — should show Unavailable (overlaps booking 600-660)
    const banner1 = screen.getByRole('status');
    expect(within(banner1).getByText('Unavailable')).toBeInTheDocument();

    // Select R101
    const r101Button = screen.getByText('R101').closest('button')!;
    fireEvent.click(r101Button);

    // R101's booking is 720-780, so 600-630 should be Available
    const banner2 = screen.getByRole('status');
    expect(within(banner2).getByText('Available')).toBeInTheDocument();
  });

  it('UI2 F4: attendees 100 shows empty state', () => {
    render(<App />);

    const attendeesInput = screen.getByLabelText('Attendees');
    fireEvent.change(attendeesInput, { target: { value: '100' } });

    expect(screen.getByText('No rooms match your requirements.')).toBeInTheDocument();
  });

  it('UI3 F3: R110 shows blocked and is unavailable', () => {
    render(<App />);

    // Select R110 (Media Studio)
    const r110Button = screen.getByText('R110').closest('button')!;
    fireEvent.click(r110Button);

    // The banner says Unavailable and mentions "blocked"
    const banner = screen.getByRole('status');
    expect(within(banner).getByText('Unavailable')).toBeInTheDocument();
    expect(within(banner).getByText(/blocked/i)).toBeInTheDocument();
    expect(within(banner).queryByText('Available')).not.toBeInTheDocument();
  });
});
