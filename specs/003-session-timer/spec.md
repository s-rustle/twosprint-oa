# Feature Specification: Session Timer for Overcast

**Feature Branch**: `003-session-timer`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "Add a session timer to Overcast. The timer should appear on screen when a user joins a classroom. It starts at 00:00 and counts up to show how long the class has been running (minutes and seconds). The timer should be visible but not distracting—maybe in a corner of the screen or near the top."

**Constitution**: Implementations for this feature MUST align with `.specify/memory/constitution.md`
(clean code, simplicity, regular comments, newcomer-friendly, minimal/single files where possible).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See Session Elapsed Time in Class View (Priority: P1)

When a user (student or instructor) joins a classroom, a session timer appears on screen. The timer starts at 00:00 when they join and counts up in minutes and seconds to show how long the current class session has been running. The timer is visible but not distracting—positioned in a corner or near the top so it does not obscure the main video/content.

**Why this priority**: Core value of the feature; without a visible, counting timer the feature does not deliver.

**Independent Test**: Join a cohort (classroom) from the lobby → confirm a timer appears (e.g. in a corner or near the top) → confirm it shows 00:00 initially and counts up (e.g. 00:01, 00:02 … 01:00) in minutes and seconds. Leave and re-join → timer resets to 00:00 and counts up again.

**Acceptance Scenarios**:

1. **Given** the user has joined a classroom (class view), **When** the class view is displayed, **Then** a session timer is visible (in a corner or near the top), showing elapsed time in minutes and seconds (e.g. MM:SS).
2. **Given** the user has just joined a classroom, **When** the timer is first shown, **Then** it displays 00:00 and begins counting up (e.g. 00:01, 00:02, … 01:00, 01:01).
3. **Given** the timer is displayed, **When** the user is viewing the class, **Then** the timer is visible but not distracting (positioned so it does not obscure the main video or primary content).
4. **Given** the user leaves the classroom and joins again (or joins a different cohort), **When** the class view loads, **Then** the timer resets to 00:00 and counts up from the start of that session.

---

### Edge Cases

- What happens if the user joins, then navigates away and back to the same cohort? Timer SHALL reset to 00:00 when they re-enter the class view (each “join” starts a new session for that user’s view).
- How does the timer behave when the tab is in the background? Timer MAY pause or continue; implementation may choose (e.g. continue counting for consistency, or pause to reflect “active” time). Spec does not require server-synced “room start time”; timer is per-user, per-join.
- Very long sessions (e.g. 99:59 and beyond): Timer SHALL continue counting (e.g. 100:00, 100:01) or display in a way that remains readable; no maximum duration required.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST display a session timer when the user is in the class view (after joining a classroom).
- **FR-002**: The timer MUST start at 00:00 (minutes:seconds) when the user enters the class view and MUST count up continuously (e.g. 00:01, 00:02, … 01:00, 01:01).
- **FR-003**: The timer MUST show elapsed time in minutes and seconds (format MM:SS or equivalent).
- **FR-004**: The timer MUST be visible but not distracting; it MUST be placed in a corner of the screen or near the top so that it does not obscure the main video or primary content.
- **FR-005**: When the user leaves the class view and re-enters (same or different cohort), the timer MUST reset to 00:00 and count up from the start of that session.

### Key Entities

- **Session timer (UI)**: A display of elapsed time (minutes and seconds) since the user entered the current class view. No server persistence required; timer is per browser tab/session, starting on enter and resetting on leave/re-enter.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user who has joined a classroom sees a timer within 2 seconds of the class view loading, and the timer shows 00:00 and then increments (e.g. 00:01, 00:02) within the expected interval (roughly 1 second per tick).
- **SC-002**: The timer is readable (correct format, sufficient contrast) and positioned so that the main video/content remains the primary focus (not obscured by the timer).
- **SC-003**: After leaving the class view and joining again, the timer resets to 00:00 and counts up from the new session.

## Assumptions

- Timer is client-side only (no server-synced “room start time”); each user’s timer starts when they enter the class view.
- “Session” means the period from when the user enters the class view until they leave; re-entering starts a new session.
- Placement “in a corner or near the top” is flexible (e.g. top-right, top-left, or just below header) as long as it is visible and not distracting.
- No requirement for pause/reset controls; the timer simply counts up from 00:00 on enter.
