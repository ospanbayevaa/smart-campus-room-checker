## Project
Smart Campus room availability checker; four fictional rooms, fictional bookings, fixed simulated current time.

## Structure
- src/data/rooms.ts: fixture data only
- src/lib/availability.ts: pure booking rules
- src/lib/filters.ts: pure room filtering
- src/components/: UI components; src/App.tsx: state and composition

## Constraints
Preserve AC1–AC6 and filters F1–F5; no backend, login, database or booking creation.
Do not change the UI layout, texts or fixture data.

## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns.
No Singleton, Factory or class hierarchies without a concrete need.
Do not mutate booking fixtures; keep responsive UI feedback.

## Commands
Install: npm install · Run: npm run dev · Test: npm test

## Verification
Run existing tests and add focused regression tests; never delete or weaken assertions.
Report changed files, rationale and test evidence. Do not claim tests passed unless they were run.