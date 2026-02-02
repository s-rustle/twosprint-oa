# Quickstart: Dark Mode Toggle (002)

**Feature**: 002-dark-mode-toggle  
**Date**: 2026-02-02

## Prerequisites

- Existing Overcast app running (Next.js, see repo root README and `specs/001-overcast-video-classroom/quickstart.md` if needed).
- No new dependencies required; theme uses CSS variables and localStorage.

## 1. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port in use).

## 2. Verify dark mode toggle

1. **Placement**: A theme toggle appears in the **top right** of the screen (in or next to the header), on the welcome screen, lobby, and class view.
2. **Default**: On first visit (or after clearing site data), the app is in **dark** mode (dark background, light text).
3. **Switch**: Click the toggle. The entire app switches to **light** mode (white or near-white background, dark text). Click again to switch back to dark.
4. **Persistence**: Refresh the page or close and reopen the tab. The last chosen mode (light or dark) is still applied.
5. **Keyboard**: Focus the toggle (Tab) and activate with Enter or Space. The theme switches.
6. **Accessibility**: The toggle has an accessible name (e.g. “Switch to light mode” / “Switch to dark mode”) so screen readers announce the action.

## 3. Storage (optional check)

In DevTools → Application → Local Storage, you should see a key (e.g. `overcast-theme`) with value `"light"` or `"dark"` after toggling. Deleting it and refreshing should restore default dark mode.

## 4. Build

```bash
npm run build
npm start
```

Theme preference is client-only; no env vars or server config needed for this feature.

## Troubleshooting

- **Toggle not visible**: Ensure you are on a page that includes the header (welcome, lobby, or cohort).
- **Theme resets on refresh**: Check that localStorage is allowed for the site and not cleared by browser/extensions.
- **Flash of wrong theme**: If the app briefly shows dark then switches to light, the theme script may be running after first paint; see `research.md` (FOUC) and ensure theme is applied as early as possible (e.g. inline script in layout head).
