# Smart Campus Room Availability Checker

A frontend prototype that lets users check whether a meeting room is available for a requested time slot. Users filter rooms by attendee count and equipment, pick a room, enter a start/end time, and see an Available/Unavailable result with a visual timeline of existing bookings. All data is fictional and hardcoded — there is no login, database, or external API.

## Features

### Availability rules (AC1–AC6)

- **AC1** — Times are integers in minutes after midnight: `0 <= start < end <= 1440`, and `start` must be strictly after "now".
- **AC2** — Maximum slot length is 120 minutes (exactly 120 is allowed).
- **AC3** — If the room is blocked, it is always unavailable.
- **AC4** — The request must not overlap any existing booking; touching at an endpoint is fine.
- **AC5** — A clear Available/Unavailable result is shown; bookings are never modified.
- **AC6** — Clear Available/Unavailable feedback with a reason, usable on desktop and mobile
  (checked manually at 402px width; not covered by unit tests).

### Room filters (F1–F5)

- **F1** — Keep a room only if its capacity is at least the requested number of attendees.
- **F2** — Keep a room only if it has all the required equipment items.
- **F3** — Each room's blocked status comes from its own data and drives the availability result.
- **F4** — When nothing matches, an empty state is shown ("No rooms match your requirements.").
- **F5** — Availability, timeline, and the bookings list all use the selected room's own bookings via `checkRoomAvailability()`.

## Project structure

```
src/data/rooms.ts        — Room type and the hardcoded ROOMS catalog (fictional data).
src/lib/availability.ts — checkAvailability(), checkRoomAvailability(), isValidTimeRange().
src/lib/filters.ts      — filterRooms() by attendees and required equipment.
src/components/*        — RoomFilters, RoomList, ResultBanner, RequestForm, BookingList, Timeline (presentational).
src/App.tsx             — App state and composition of the components above.
```

## Setup and run

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

Test suite runs on Vitest:

- `src/lib/availability.test.ts` — 19 tests covering AC1–AC6.
- `src/lib/filters.test.ts` — 8 tests covering F1–F5.
- `src/App.test.tsx` — 3 UI tests (jsdom + React Testing Library) covering the integrated availability flow, the empty filter state, and the blocked-room badge.

## Live demo

https://smart-campus-room-av-aerp.bolt.host
