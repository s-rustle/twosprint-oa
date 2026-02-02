# Implementation Plan: Dark Mode Toggle for Overcast

**Branch**: `002-dark-mode-toggle` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-dark-mode-toggle/spec.md`

## Summary

Add a dark mode toggle in the top right of the Overcast app. The app already uses CSS variables (`--background`, `--foreground`, `--highlight`, `--accent`) in `app/globals.css`; this feature introduces a light theme by redefining those variables when the user selects light mode, persists the choice in localStorage (default dark on first visit), and exposes a keyboard-accessible toggle with an accessible name on all main views (welcome, lobby, class view).

## Technical Context

**Language/Version**: TypeScript (existing Next.js app)  
**Primary Dependencies**: Next.js (App Router), React, Tailwind CSS (existing)  
**Storage**: Client-only: localStorage key for theme preference (no server or database)  
**Testing**: Manual verification per quickstart; no new test framework for this feature  
**Target Platform**: Web (existing Overcast app in browser)  
**Project Type**: Web (single Next.js app at repo root)  
**Performance Goals**: Theme switch visible within 1 second (SC-001)  
**Constraints**: No flash of wrong theme on load (read preference before paint when possible)  
**Scale/Scope**: Single preference per browser; no multi-user or server state

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean & readable**: Theme logic and toggle placement will use clear names and a minimal number of files.
- **Simplicity & comments**: Approach is simple (CSS variables + one storage key); non-obvious bits (e.g. avoiding FOUC) will be commented.
- **Newcomer-friendly**: Theme key and light/dark variable sets will be documented in quickstart.
- **Minimal files**: No new project structure; add theme handling in existing layout/globals and one small theme module or inline in LayoutShell/Header.
- **Single files where possible**: Prefer one place for theme state and CSS variable definitions (e.g. globals.css for both themes, LayoutShell or Header for toggle + persistence).

## Project Structure

### Documentation (this feature)

```text
specs/002-dark-mode-toggle/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (theme storage contract only)
└── tasks.md             # Phase 2 (/speckit.tasks – not created by plan)
```

### Source Code (repository root)

No new top-level directories. Changes are confined to existing app and shared UI:

```text
app/
├── globals.css          # Add light-theme variable set; optional [data-theme="light"] selector
├── layout.tsx           # Optional: inject theme script or provider for no-FOUC
components/
├── Header.tsx           # Add theme toggle in top right; keyboard + aria-label
├── LayoutShell.tsx       # Optional: theme state + persistence here if not in Header
lib/
└── (optional) theme.ts  # Theme key, type "light"|"dark", get/set from localStorage; keep minimal
```

**Structure Decision**: Reuse existing Next.js app layout. Theme toggle lives in the header (top right) so it is visible on all views. Theme preference is stored in localStorage under a single key; default is `"dark"`. CSS variables for light mode are added in `globals.css` (e.g. under `[data-theme="light"]` or a class on `html`/`body`).

## Complexity Tracking

No constitution violations. No additional table entries.
