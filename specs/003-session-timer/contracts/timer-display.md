# Contract: Session Timer Display (003)

**Feature**: 003-session-timer  
**Date**: 2026-02-01

## Scope

Client-side only. No API. This contract defines the behavior and display of the `SessionTimer` component.

## Display

- **Format**: Elapsed time as `MM:SS` (e.g. 00:00, 05:23, 99:59, 100:00).
- **Padding**: Minutes and seconds each two digits; leading zeros (00–99 for each; minutes may exceed 99 for long sessions).
- **Update interval**: Approximately every 1 second (e.g. via `setInterval(1000)`).

## When to show

- **Visible**: When the user is in the class view (i.e. `SessionTimer` is mounted inside `ClassView`).
- **Hidden**: When the user is not in the class view (lobby, welcome, or left cohort page).

## When to start / reset

- **Start**: When the component mounts (user has entered the class view). Initial display: 00:00; first tick after ~1s: 00:01.
- **Reset**: When the component unmounts (user leaves the class view). Re-entering (same or different cohort) mounts a new instance, which starts at 00:00 again.

## Placement

- **Position**: Corner of the class view (e.g. top-right or top-left) so the timer is visible but does not obscure the main video grid.
- **Styling**: Readable (sufficient contrast); minimal so it does not distract (e.g. small font, subtle background).

## Implementation notes

- **Timing**: Use simple JavaScript (e.g. `setInterval`); clear interval in React `useEffect` cleanup on unmount.
- **State**: In-memory only (e.g. `elapsedSeconds` in component state); no persistence or server.
