# Research: Dark Mode Toggle (002)

**Feature**: 002-dark-mode-toggle  
**Date**: 2026-02-02

## Theme implementation (CSS)

**Decision**: Use the same CSS variable names already in `app/globals.css` (`--background`, `--foreground`, `--highlight`, `--accent`) and define a second set of values for light mode. Apply theme via a `data-theme` attribute on the root element (e.g. `<html data-theme="light">` or `data-theme="dark">`).

**Rationale**: The app already uses `var(--background)` and `var(--foreground)` everywhere. Adding a scoped override (e.g. `[data-theme="light"] { --background: #ffffff; --foreground: #1a1a1a; … }`) keeps one source of truth and avoids duplicating component classes. No new design tokens beyond the existing four; light mode reuses the same semantic names with different hex values.

**Alternatives considered**: (1) Separate class names per component for light/dark — rejected because it would touch many files and duplicate styles. (2) Tailwind dark: variant only — acceptable but the app does not currently use `dark:`; introducing `data-theme` is minimal and keeps theme logic in one place (globals.css + one attribute).

## Persistence and default

**Decision**: Store theme in `localStorage` under a single key (e.g. `overcast-theme`). Values: `"light"` or `"dark"`. Default when missing or invalid: `"dark"` (per spec clarification).

**Rationale**: Spec requires “remember which mode the user chose” and “per browser/device as available”. localStorage is standard, survives refresh and return visits, and requires no server. Default dark matches current Overcast look and clarified product choice.

**Alternatives considered**: sessionStorage — would not persist across closing the tab. Cookie — unnecessary and would add server handling.

## Avoiding flash of wrong theme (FOUC)

**Decision**: Apply theme as early as possible by running a small inline script in the document head (before first paint) that reads `localStorage` and sets `document.documentElement.setAttribute('data-theme', …)` before React hydrates. If no script is used, at least set theme in the root layout so the first client render uses the stored value.

**Rationale**: If theme is applied only after React mount, the user may briefly see the default (dark) then switch, or see a flash when the stored value is light. A blocking script in `<head>` is the most reliable way to avoid FOUC with client-stored preferences.

**Alternatives considered**: CSS-only (e.g. `@media (prefers-color-scheme: light)` with a fallback) — does not persist user choice. Deferring theme to after hydration — acceptable if FOUC is minimal; document the tradeoff.

## Toggle placement and accessibility

**Decision**: Add the theme toggle in the existing `Header` component (top right), alongside or near the Students/Instructors nav. Use a `<button>` with an accessible name that reflects the action (e.g. “Switch to light mode” when current is dark, “Switch to dark mode” when current is light). Ensure the button is focusable and activatable via keyboard (Enter/Space).

**Rationale**: Spec requires “top right corner” and “visible on all main views”; the header is already visible on welcome, lobby, and class view. FR-006 requires keyboard operability and an accessible name/label; a button with dynamic `aria-label` (or visible text) satisfies this.

**Alternatives considered**: Icon-only button with `aria-label` — acceptable. Separate “theme” dropdown — more than spec asks for; keep a single toggle.

## Summary table

| Topic           | Decision                                      | Rationale / note                    |
|----------------|-----------------------------------------------|--------------------------------------|
| CSS approach   | `data-theme` on root + same variable names    | One place to change; no class sprawl |
| Storage        | localStorage, key e.g. `overcast-theme`      | Persists across refresh/return       |
| Default        | `"dark"` when missing or invalid              | Per spec clarification              |
| FOUC           | Inline script in head or earliest layout      | Avoid flash of wrong theme           |
| Toggle UI      | Button in Header, top right; keyboard + label  | Meets FR-001, FR-006                 |
