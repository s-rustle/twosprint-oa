# Data Model: Dark Mode Toggle (002)

**Feature**: 002-dark-mode-toggle  
**Date**: 2026-02-02

No server or database is used. The only persisted data is the user’s theme preference in the browser.

## Entities

### Theme preference (client-only)

| Attribute | Type    | Description |
|----------|---------|-------------|
| value    | `"light"` \| `"dark"` | The selected theme. |
| storage  | localStorage | Key: e.g. `overcast-theme`. Per browser/device; best-effort (clearing site data resets to default). |

**Validation**: Only `"light"` and `"dark"` are valid. Any other value (or missing key) is treated as default `"dark"`.

**Lifecycle**: Set when the user toggles theme; read on load and when restoring UI. No server sync or account binding.

**Relationships**: None. Standalone preference.

## State

- **Default (first visit or invalid/missing)**: `"dark"`.
- **After user toggle**: Value is `"light"` or `"dark"` and is written to localStorage and applied to the root element (`data-theme`).

No other entities or tables. No API; no backend model.
