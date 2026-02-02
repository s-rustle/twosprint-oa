# Feature Specification: Dark Mode Toggle for Overcast

**Feature Branch**: `002-dark-mode-toggle`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "Add a dark mode toggle button to Overcast. The button should appear in the top right corner of the screen. When clicked, the entire app switches between light mode and dark mode. Light mode has a white background with dark text. Dark mode has a dark gray or black background with light text. The app should remember which mode the user chose."

**Constitution**: Implementations for this feature MUST align with `.specify/memory/constitution.md`
(clean code, simplicity, regular comments, newcomer-friendly, minimal/single files where possible).

## Clarifications

### Session 2026-02-02

- Q: On first visit (no stored preference), which default theme should the app use, and should it follow system preference? → A: Default to dark (first-time users see dark until they toggle).
- Q: Should the toggle be keyboard operable and have an accessible name/label? → A: Yes: toggle MUST be keyboard operable and have an accessible name/label (e.g. "Dark mode" / "Light mode").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Toggle Theme and Persist Choice (Priority: P1)

A user can switch the entire app between light and dark mode using a toggle button in the top right corner. The chosen mode is remembered so that when they return or refresh, the app shows the same mode.

**Why this priority**: Core value of the feature; without toggle and persistence, the feature does not deliver.

**Independent Test**: Open the app, click the toggle in the top right, confirm the screen switches between light (white background, dark text) and dark (dark gray or black background, light text). Refresh or reopen the app and confirm the last chosen mode is still applied.

**Acceptance Scenarios**:

1. **Given** the app is open in either mode, **When** the user clicks the dark mode toggle in the top right corner, **Then** the entire app switches to the other mode (light ↔ dark) with appropriate background and text colors.
2. **Given** the user has selected a mode (light or dark), **When** they navigate to another page, refresh, or close and reopen the app, **Then** the app displays in the same mode they last chose.
3. **Given** the app is in light mode, **When** the user views any screen, **Then** the background is white (or near-white) and text is dark.
4. **Given** the app is in dark mode, **When** the user views any screen, **Then** the background is dark gray or black and text is light.

---

### Edge Cases

- What happens when the user has never chosen a mode (first visit)? System SHALL apply dark as the default and then remember any subsequent toggle.
- How does the app handle rapid repeated clicks on the toggle? Toggle SHALL remain consistent (no flicker or inconsistent state).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST display a dark mode toggle control in the top right corner of the screen, visible on all main views (welcome, lobby, class view).
- **FR-002**: When the user activates the toggle, the app MUST switch the entire UI between light mode and dark mode.
- **FR-003**: Light mode MUST use a white (or near-white) background and dark text for readability.
- **FR-004**: Dark mode MUST use a dark gray or black background and light text for readability.
- **FR-005**: The app MUST persist the user’s chosen mode (light or dark) so that it is restored on subsequent visits or after refresh; persistence scope is per browser/device as available (e.g. local storage or equivalent).
- **FR-006**: The dark mode toggle MUST be keyboard operable (focusable and activatable via keyboard) and MUST have an accessible name/label that indicates the current or resulting mode (e.g. "Dark mode" / "Light mode") for screen reader users.

### Key Entities

- **Theme preference**: The user’s selected mode (light or dark). Stored and read for persistence; no server or account required for this feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can change the app theme from light to dark (or vice versa) with a single click on the toggle, and the change is visible across the entire app within one second.
- **SC-002**: After the user selects a mode, that mode remains in effect after page refresh or returning to the app in the same browser session (or as long as stored preference is available).
- **SC-003**: In light mode, text is readable (sufficient contrast) on the light background; in dark mode, text is readable on the dark background, as judged by a simple visual check.

## Assumptions

- Persistence is best-effort per browser (e.g. localStorage); clearing site data may reset to default.
- “Top right corner” means a consistent, accessible position (e.g. in or near the header) across viewports; exact pixel position may adapt for small screens.
- Default theme when no stored preference exists is dark (current Overcast look).
