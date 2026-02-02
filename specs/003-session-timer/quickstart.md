# Quickstart: Session Timer (003)

**Feature**: 003-session-timer  
**Date**: 2026-02-01

## Prerequisites

- Existing Overcast app running (Next.js; see repo root README and `specs/001-overcast-video-classroom/quickstart.md` if needed).
- Cohort room URLs configured (e.g. `.env.local` with `NEXT_PUBLIC_DAILY_ROOM_1` … or equivalent) so you can join a classroom.
- No new dependencies required; timer uses React state and `setInterval`.

## 1. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port in use).

## 2. Verify session timer

1. **Lobby**: From the welcome screen, go to the Main Lobby. Select Student or Instructor and choose a cohort; join the classroom.
2. **Visibility**: Once in the class view, a **session timer** appears (e.g. in a corner—top-right or top-left). It should not cover the main video grid.
3. **Start**: The timer shows **00:00** when you first enter and then counts up every second (00:01, 00:02, … 01:00, 01:01).
4. **Format**: Time is displayed as **MM:SS** (e.g. 05:23) with leading zeros.
5. **Reset**: Click “Return to Main Lobby” (or navigate away), then join the same or another cohort again. The timer should show **00:00** again and count up from the start of the new session.

## 3. Build

```bash
npm run build
npm start
```

Timer is client-side only; no env vars or server config needed for this feature.

## Troubleshooting

- **Timer not visible**: Ensure you are on the class view (cohort room) and not on the lobby or welcome screen.
- **Timer doesn’t tick**: Check that the interval is started on mount and that the component is not unmounting/remounting unexpectedly (e.g. key or parent re-render).
- **Timer doesn’t reset**: Leaving the class view should unmount the timer component; re-entering mounts a new instance. If you stay on the same route without unmounting (e.g. in-app navigation quirk), the timer will not reset—design is “reset on leave/re-enter”.
