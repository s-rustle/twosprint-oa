# Research: Session Timer (003)

**Feature**: 003-session-timer  
**Date**: 2026-02-01

## Timing mechanism

**Decision**: Use `setInterval` with 1000 ms to update elapsed time every second. Store elapsed seconds in React state (or a ref for the value used by the interval); on mount start the interval, on unmount clear it with `clearInterval`.

**Rationale**: Spec asks for “simple JavaScript timing functions” and display in minutes and seconds (MM:SS). One-second granularity is sufficient and avoids unnecessary re-renders. `setInterval` is well-understood and easy to clean up in a `useEffect` cleanup. No need for `requestAnimationFrame` (that would be for smooth animation, not a once-per-second tick).

**Alternatives considered**: (1) `requestAnimationFrame` — overkill for 1s updates and harder to reason about for “elapsed seconds”. (2) `setTimeout` recursive — equivalent to setInterval for this use case; setInterval is more direct for “every N ms”. (3) Server-synced “room start time” — spec explicitly says client-side only, no server; per-user, per-join.

## Display format

**Decision**: Display elapsed time as `MM:SS` (e.g. 00:00, 05:23, 99:59). Pad minutes and seconds with leading zeros (two digits each). For 100+ minutes, display as 100:00, 100:01, etc. (no cap).

**Rationale**: Spec requires “minutes and seconds (e.g. MM:SS)”. Two-digit padding keeps the layout stable and readable. No maximum duration; spec allows continuing past 99:59.

**Alternatives considered**: (1) HH:MM:SS for very long sessions — spec does not require hours; MM:SS with 3+ digit minutes is acceptable. (2) No leading zeros — spec example “05:23” implies leading zeros.

## Placement

**Decision**: Position the timer in a corner of the class view so it is visible but does not obscure the main video grid. Prefer top-right or top-left with absolute (or fixed within the class view container) positioning, small font, and semi-transparent or subtle background so it does not distract.

**Rationale**: Spec says “in a corner or near the top” and “does not obscure the main video or primary content”. Placing it inside `ClassView` in a corner (e.g. top-right) keeps it scoped to the class view and avoids overlapping the participant video grid in the center.

**Alternatives considered**: (1) Below header, full width — could work but “corner” is more out-of-the-way. (2) Overlay on video — risk of obscuring content; corner with padding is safer.

## Lifecycle and reset

**Decision**: Timer starts when `SessionTimer` mounts (i.e. when the user is in class view). Timer resets when the component unmounts (user leaves class view). Re-entering the same or another cohort mounts a new `SessionTimer`, which starts at 00:00 again.

**Rationale**: Spec: “When the user leaves the class view and re-enters (same or different cohort), the timer MUST reset to 00:00.” Mount = enter, unmount = leave; no need for explicit “session id” or server. Cleanup in `useEffect` return clears the interval so no leaks.

**Alternatives considered**: (1) Persist “session start” in sessionStorage — spec says timer resets on re-enter; persistence would contradict that. (2) Sync with “room start” from server — spec says no server-synced room start time; client-only.

## Tab in background

**Decision**: Do not change behavior when the tab is in the background: keep the interval running so the displayed time continues to advance (wall-clock elapsed time).

**Rationale**: Spec says “Timer MAY pause or continue; implementation may choose.” Continuing is simpler (one code path) and matches “how long the class has been running” in wall-clock terms. If the product later wants “active time only”, that can be a separate change (e.g. visibility API).

**Alternatives considered**: Pause when tab is hidden (Page Visibility API) — would require extra state and logic; not required by spec.

## Summary table

| Topic        | Decision                          | Rationale / note                          |
|-------------|------------------------------------|-------------------------------------------|
| Timing      | `setInterval(1000)` in useEffect   | Simple; 1s granularity; cleanup on unmount |
| Format      | MM:SS, leading zeros, no cap       | Spec; readable; 100:00+ allowed           |
| Placement   | Corner of class view (e.g. top-right) | Visible, does not block video             |
| Lifecycle   | Start on mount, reset on unmount   | Matches “leave/re-enter resets”            |
| Background  | Keep counting                     | Simpler; wall-clock elapsed                |
