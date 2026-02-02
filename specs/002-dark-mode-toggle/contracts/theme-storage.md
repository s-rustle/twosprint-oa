# Contract: Theme Preference Storage

**Feature**: 002-dark-mode-toggle  
**Type**: Client-only storage (no API)

## Purpose

Define how the app reads and writes the user’s theme preference so that persistence and default behavior are consistent and testable.

## Storage

- **Medium**: `localStorage` (browser).
- **Key**: `overcast-theme` (single key; exact name is implementation choice but must be documented).

## Values

- **Allowed**: `"light"` | `"dark"`.
- **Default**: If the key is missing or contains any other value, the app MUST treat the theme as `"dark"`.

## Operations

- **Read**: On app load (and when applying theme), read `localStorage.getItem("overcast-theme")`. If result is `"light"`, apply light theme; otherwise apply dark theme.
- **Write**: When the user toggles theme, set `localStorage.setItem("overcast-theme", "light")` or `"dark")` and update the root element’s `data-theme` (or equivalent) so the UI reflects the new theme immediately.

## Validation

- Before applying, coerce invalid or missing values to `"dark"`.
- No server round-trip; no authentication; per-origin, per-device.

## Notes

- Clearing site data or using private browsing may reset to default; this is acceptable per spec (best-effort persistence).
