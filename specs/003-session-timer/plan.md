# Implementation Plan: Session Timer (003)

**Branch**: `003-session-timer` | **Date**: 2026-02-01 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/003-session-timer/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Add a session timer to the Overcast class view that starts at 00:00 when the user enters a classroom and counts up in MM:SS. The timer is client-side only (simple JavaScript timing), positioned in a corner so it is visible but does not block the video. It resets when the user leaves and re-enters the class view. Implementation uses the existing Next.js setup: a new `SessionTimer` component, `setInterval` (1s) for ticks, and placement in `ClassView` (e.g. top-right or top-left corner).

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20.x (Next.js 16 runtime)  
**Primary Dependencies**: Next.js 16, React 19, @daily-co/daily-react, Tailwind CSS 4 (existing app)  
**Storage**: None. Timer state is in-memory only; no persistence.  
**Testing**: Jest + React Testing Library (or Vitest) for components; E2E optional.  
**Target Platform**: Web (modern browsers); same as Overcast class view.  
**Project Type**: Web application (Next.js single app; existing structure).  
**Performance Goals**: Timer updates roughly every 1s; no impact on video or join flow.  
**Constraints**: Simple JavaScript timing (e.g. `setInterval`); no server-synced room start time; per-user, per-join session.  
**Scale/Scope**: Single timer per class view; sessions may run 99:59+ (display continues or remains readable).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify alignment with `.specify/memory/constitution.md`:

- **Clean & readable**: Timer component and formatting logic use clear names and minimal, focused code.
- **Simplicity & comments**: Use of `setInterval`/cleanup and MM:SS formatting will be commented for newcomers.
- **Newcomer-friendly**: Why timer resets on unmount and how placement avoids blocking video will be documented.
- **Minimal files**: One new component file (`SessionTimer`); integration in existing `ClassView`.
- **Single files where possible**: Timer logic (state, interval, format) stays in one component file unless size justifies a small helper.

## Project Structure

### Documentation (this feature)

```text
specs/003-session-timer/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/            # Phase 1 output (timer display/behavior)
├── checklists/
│   └── requirements.md
└── tasks.md             # Created by /speckit.tasks
```

### Source Code (repository root)

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── lobby/
│   └── page.tsx
├── cohort/[id]/
│   └── page.tsx         # Unchanged; ClassView receives timer via child
components/
├── Header.tsx
├── CohortCard.tsx
├── ClassView.tsx        # Add SessionTimer (e.g. corner; does not block video grid)
├── SessionTimer.tsx     # NEW: elapsed MM:SS, starts on mount, resets on unmount
├── CohortRoomClient.tsx
├── ControlPanel.tsx
├── VideoError.tsx
lib/
├── cohort-config.ts
├── daily-app-messages.ts
```

**Structure Decision**: Single Next.js app; no new routes. `SessionTimer` is a client component rendered inside `ClassView`. When the user navigates to a cohort, `CohortRoomClient` mounts and eventually renders `ClassView`; `ClassView` mounts `SessionTimer`, which starts counting. When the user leaves (Return to Lobby or navigate away), `ClassView` unmounts, `SessionTimer` unmounts (interval cleared), and on re-enter a fresh `SessionTimer` mounts and starts at 00:00. No new lib files unless a shared `formatMMSS` helper is extracted for reuse or tests.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none)    | —          | —                                   |
