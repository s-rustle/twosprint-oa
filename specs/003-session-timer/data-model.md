# Data Model: Session Timer (003)

**Feature**: 003-session-timer  
**Date**: 2026-02-01

No server or database is used. Timer state is in-memory only and exists only while the user is in the class view.

## Entities

### Session timer (client-only, in-memory)

| Attribute    | Type     | Description |
|-------------|----------|-------------|
| elapsedSeconds | number | Seconds since the component mounted (0, 1, 2, …). |
| (implicit)  | —        | “Started at” can be derived from mount time if needed; for display only elapsed seconds are required. |

**Validation**: Non-negative integer. No upper bound (spec allows 99:59+).

**Lifecycle**: Created when `SessionTimer` mounts (user enters class view). Updated every second by an interval. Destroyed when the component unmounts (user leaves class view). No persistence.

**Relationships**: None. Standalone UI state.

## State

- **On mount**: `elapsedSeconds = 0`; start a 1s interval that increments state.
- **On each tick**: `elapsedSeconds += 1`; display as `formatMMSS(elapsedSeconds)` (e.g. 00:00, 00:01, …, 05:23).
- **On unmount**: Clear the interval; state is discarded. Next mount starts again at 0.

No other entities. No API; no backend model.
