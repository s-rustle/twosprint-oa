# Implementation Plan: Overcast Video Classroom

**Branch**: `001-overcast-video-classroom` | **Date**: 2025-02-01 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-overcast-video-classroom/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Overcast is a video-based classroom application: a Main Lobby shows six cohorts; users choose Student or Instructor mode and join a cohort’s live video room. Students see the video feed and can return to the lobby; instructors see the same feed plus a Control Panel to mute participants and begin breakout rooms. Implementation uses the Daily video platform (Daily React + daily-js), Next.js (App Router), Vercel serverless where needed, and Tailwind. No database; six Daily room URLs are supplied via environment/config for local and deployed runs. Visual style: sharp, futuristic, minimal—black background, neon teal (#00FFD1) and yellow/orange (#FFBD17) accents, bold geometric sans-serif, clean grid layout.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20.x (Next.js 16 runtime)  
**Primary Dependencies**: Next.js 16, @daily-co/daily-react, @daily-co/daily-js, jotai, Tailwind CSS 4, React 19  
**Storage**: None. Six Daily room URLs are provided via environment variables or a single config (e.g. `NEXT_PUBLIC_COHORT_ROOM_URLS` JSON or `NEXT_PUBLIC_DAILY_COHORT_1_URL` … `NEXT_PUBLIC_DAILY_COHORT_6_URL`).  
**Testing**: Jest + React Testing Library (or Vitest) for components and flows; E2E optional (Playwright).  
**Target Platform**: Web (modern browsers); deployable on Vercel (serverless API routes if needed).  
**Project Type**: Web application (Next.js single app).  
**Performance Goals**: ~50 participants per room, all six rooms active; join &lt;60s, return-to-lobby &lt;15s, instructor flow &lt;30s (per spec SC-001–SC-006).  
**Constraints**: No database; pre-defined Daily room URLs only. Run locally and on Vercel without persistent storage.  
**Scale/Scope**: 6 fixed cohorts, ~50 users per room, 6 concurrent rooms (from spec clarifications).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify alignment with `.specify/memory/constitution.md`:

- **Clean & readable**: Next.js app and Daily integration will use clear naming, small focused components, and minimal files per feature.
- **Simplicity & comments**: Non-obvious Daily usage (e.g. app messages for mute/breakout) and role-based UI will be commented.
- **Newcomer-friendly**: README and quickstart document setup and cohort URL config; conventions noted in code.
- **Minimal files**: Prefer fewer files (e.g. lobby + class view + control panel in a small number of modules); new files only when clarity or separation demands.
- **Single files where possible**: Cohort config, shared UI constants, and simple hooks can live in single files until size justifies split.

## Project Structure

### Documentation (this feature)

```text
specs/001-overcast-video-classroom/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (config + app message shapes)
├── checklists/
│   └── requirements.md
└── tasks.md             # Created by /speckit.tasks
```

### Source Code (repository root)

```text
app/
├── layout.tsx           # Root layout; global styles, font, Overcast branding
├── page.tsx             # Entry: Main Lobby or redirect
├── globals.css          # Tailwind + design tokens (black, teal, orange)
├── lobby/
│   └── page.tsx         # Main Lobby: 6 cohorts, Students/Instructors toggle
├── cohort/[id]/
│   └── page.tsx         # Class view (Student or Instructor by query/state); DailyProvider for cohort room
├── api/                 # Optional: Vercel serverless (e.g. token endpoint later)
│   └── ...
components/
├── Header.tsx           # Overcast logo + Students/Instructors toggle
├── Footer.tsx          # "Powered by the Overclock Accelerator"
├── CohortCard.tsx      # Single cohort tile for lobby
├── ClassView.tsx       # Wraps Daily meeting UI (video feed + title + Return to Lobby)
├── ControlPanel.tsx    # Instructor-only: mute list, begin breakout button
├── VideoError.tsx      # Error message + Retry + Return to Lobby (FR-011)
lib/
├── cohort-config.ts    # Map cohort id 1–6 → room URL from env
├── daily-app-messages.ts # Types and helpers for mute/breakout app messages (if needed)
public/
└── ...
```

**Structure Decision**: Single Next.js app using App Router. Lobby and cohort class view are distinct routes; role (Student/Instructor) is stored in client state (e.g. React state or URL query) and passed into the class view. Daily is integrated via DailyProvider per cohort page; one active call per browser tab (leave before joining another cohort). No backend DB; cohort URLs from env only.

## Complexity Tracking

No constitution violations. File count kept low; single-file preference applied to config and small utilities.
