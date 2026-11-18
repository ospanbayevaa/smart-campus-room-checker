# Project memory

## Product intent & audience

- Smart Campus room booking availability checker; users check whether a room can be booked for a time range.
- Optional AI-style explanation feature (mock-only) decoratively explains the deterministic result; the checker remains the single source of truth.
- No login, database, real personal data, or client-side API secrets.

## Brand personality & voice

- Practical, campus-tool tone; explanations are short (1–2 sentences), factual, and never override the authoritative status.
- Explanations are labelled clearly as mock/non-decision to avoid implying they affect booking rules.

## Visual design & UX direction

- Vite + React + Tailwind CSS; icons via lucide-react; `@/` path alias for imports.
- Aim for production-worthy, non-cookie-cutter UI.
- Result shown via a green/red `ResultBanner` that must never change; explanation appears in a separate grey box below.
- Explanation UI: "Explain availability" button, "Simulate" select (OK / Timeout / API error / No key), and a labelled grey box; shows "Explaining…" state during the 3s timeout.
- Room labels styled like "R214 — Seminar Room A".

## Decisions, constraints & rationale

- `checkAvailability` in `src/lib/availability.ts` is authoritative and untouched; booking rules preserved.
- Booking rules inferred: blocked rooms short-circuit; times are integer minutes 0–1440; max duration 120; start must be after "now"; booking conflicts detected.
- Reason codes: AVAILABLE | BLOCKED | OVERLAP | TOO_LONG | PAST_TIME | INVALID_TIME | INVALID_NOW, derived deterministically from the result's violations in array order.
- `validateInput` enforces non-empty roomLabel ≤ 60 chars, integer/in-range times, known reasonCode.
- `validateOutput` enforces exactly `{ explanation }`, 1–2 sentences, ≤300 chars, and status agreement (text must not contradict `isAvailable`).
- `explainAvailability(input, mode)` modes: "ok" | "timeout" | "error" | "no-key"; all failure paths return a fixed fallback and never throw; no network/keys.
- AGENTS.md defines a review gate: present plan and changed files, await approval before editing.
- Existing tests (39) in `availability.test.ts`, `filters.test.ts`, `App.test.tsx` stay unchanged; new tests in `src/lib/explain/explain.test.ts`.

## Open questions & assumptions

- Approval pending to implement the planned explanation feature.
- Assumption: existing `checkAvailability` result exposes `available`, `violations`, and enough structure to derive reason codes; confirmed against plan mapping.
- Assumption: fixture data and `App.tsx` result shape support deriving roomLabel, start, end, isAvailable without modifying the checker.