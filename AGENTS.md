## Project
Smart Campus room availability checker; fictional bookings, fixed simulated current time.
Scope note: the course baseline is one room; the catalog was deliberately extended to four fictional rooms in Assignment #04 (filters F1–F5). Do not add or remove rooms.
## Structure
- src/data/rooms.ts: fixture data only
- src/lib/availability.ts: pure booking rules
- src/lib/filters.ts: pure room filtering
- src/components/: UI components; src/App.tsx: state and composition
## Acceptance criteria (preserve)
AC1 integer minutes, 0 <= start < end <= 1440, start strictly after now
AC2 duration <= 120 minutes (exactly 120 allowed)
AC3 a blocked room is always unavailable
AC4 reject overlaps; touching endpoints are allowed
AC5 clear Available/Unavailable result; booking data is never changed
AC6 clear feedback with a reason on desktop and mobile (checked manually)
F1–F5 room filters as described in README.md
## Constraints
No backend, login, database or booking creation. No secrets or real personal data.
No deployments or publishing by the agent; only the human publishes.
Do not add dependencies without approval. Do not change UI layout, texts or fixture data.
## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns.
No Singleton, Factory or class hierarchies without a concrete need.
## Commands
Install: npm install · Run: npm run dev · Test: npm test
Lint: npm run lint · Types: npm run typecheck · Build: npm run build
## Review gate
Show the plan and the files to change first; wait for approval before editing.
After editing, show the diff, run npm test, and report the real output.
Never delete or weaken assertions. Do not claim tests passed unless they were run.
