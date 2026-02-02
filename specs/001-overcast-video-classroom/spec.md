# Feature Specification: Overcast Video Classroom

**Feature Branch**: `001-overcast-video-classroom`  
**Created**: 2025-02-01  
**Status**: Draft  
**Input**: User description: "We are looking to build a video based classroom application called Overcast. The application provides a main lobby that displays 6 potential classrooms that the user can drop into. When they click on one of the classrooms they are taken to a live video feed of the classroom. They can, at any point, return to the lobby to attend a different classroom. Alternatively if a user clicks the instructor option from the lobby they enter into Instructor mode. When the user clicks a room from instructor mode they are given additional instructor privileges such as the ability to mute participants and begin breakout rooms. You should reference the image provided for the functional flow."

**Constitution**: Implementations for this feature MUST align with `.specify/memory/constitution.md`
(clean code, simplicity, regular comments, newcomer-friendly, minimal/single files where possible).

**Functional flow reference**: The specification aligns with the three-panel flow: Main Lobby → Student Class View or Instructor Class View, with role toggle (Students / Instructors) in the header and consistent "Return to Main Lobby" from both class views.

## Clarifications

### Session 2025-02-01

- Q: Can any user switch to Instructor mode from the lobby, or only authorized users? → A: Any user can switch to Instructor mode from the lobby (no access control in this feature).
- Q: Are participants in a classroom anonymous or identified (e.g. display name)? → A: Each participant has a display name (or identifier) visible to the instructor for mute and breakout targeting.
- Q: When the video feed fails, how does retry work—explicit button only or also auto-reconnect? → A: Show an error message and automatically attempt to reconnect in the background; also offer a "Retry" button.
- Q: Any target for how many participants per classroom or how many classrooms active at once? → A: Target up to dozens per classroom (e.g. ~50) and all six classrooms can be active simultaneously.
- Q: For "begin breakout rooms" in this feature, is the scope only start/begin, or also assign participants / end breakouts? → A: Instructor can only start/begin breakout rooms (create rooms, put class into breakout mode); assigning participants to rooms and ending breakouts are out of scope for this feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Join Lobby and Attend Classroom as Student (Priority: P1)

A user opens Overcast and lands in the Main Lobby. The lobby shows six classrooms (cohorts) under a "Join Your Cohort" heading. The user can click any cohort to enter that classroom’s live video feed as a student. In the Student Class View they see the cohort title (e.g. "Cohort 1: Class Session"), the live video feed, and a "Return to Main Lobby" control. At any time they can return to the lobby and choose a different classroom.

**Why this priority**: Core value is students viewing live classrooms and switching between them; this is the primary user journey.

**Independent Test**: Open app → see lobby with 6 classrooms → click one → see live video and cohort title → click "Return to Main Lobby" → see lobby again. Delivers: verifiable student flow and navigation.

**Acceptance Scenarios**:

1. **Given** the user is in the Main Lobby, **When** they click a cohort (e.g. Cohort 1), **Then** they are taken to the Student Class View for that cohort with a live video feed and cohort title displayed.
2. **Given** the user is in a Student Class View, **When** they use "Return to Main Lobby", **Then** they are taken back to the Main Lobby and can select another cohort.
3. **Given** the user is in the Main Lobby with "Students" selected (default), **When** they click a cohort, **Then** they enter as a student (no instructor controls).

---

### User Story 2 - Switch to Instructor Mode and Manage a Classroom (Priority: P2)

A user in the Main Lobby can switch to Instructor mode via the header option (e.g. "Instructors" toggle). With Instructor mode active, clicking a cohort takes them to the Instructor Class View for that cohort. This view shows the same live video feed and cohort title as the student view, plus an instructor-only Control Panel. From the Control Panel the instructor can mute participants and begin breakout rooms. The instructor can return to the lobby at any time to choose another room or switch back to student view.

**Why this priority**: Instructor capabilities depend on the student flow; both roles share lobby and class view structure.

**Independent Test**: From lobby → select "Instructors" → click a cohort → see Instructor Class View with video feed and Control Panel → use mute and/or breakout room controls → return to Main Lobby. Delivers: verifiable instructor flow and privileges.

**Acceptance Scenarios**:

1. **Given** the user is in the Main Lobby, **When** they select the Instructor option (e.g. "Instructors" in header), **Then** they are in Instructor mode and the next cohort they click opens in Instructor Class View.
2. **Given** the user is in Instructor Class View for a cohort, **When** they use the Control Panel, **Then** they can mute participants and begin breakout rooms for that classroom.
3. **Given** the user is in Instructor Class View, **When** they use "Return to Main Lobby", **Then** they are taken back to the Main Lobby and can select another cohort or switch to Students.

---

### User Story 3 - Consistent Navigation and Role Switching (Priority: P3)

Users experience a consistent header (e.g. Overcast branding and Students / Instructors toggle) across Main Lobby, Student Class View, and Instructor Class View. Role is indicated by which toggle is active. Users can move between lobby and class views without losing the ability to switch role from the lobby.

**Why this priority**: Ensures predictable navigation and role clarity across the app.

**Independent Test**: Navigate lobby → student view → lobby → switch to Instructors → instructor view → lobby; confirm header and role state are consistent. Delivers: verifiable navigation and role UX.

**Acceptance Scenarios**:

1. **Given** the user is on any screen, **When** they view the header, **Then** they see Overcast branding and the Students / Instructors toggle with the current mode indicated.
2. **Given** the user returns to the Main Lobby from a class view, **When** they change the role toggle and then click a cohort, **Then** they enter the class in the selected role (Student or Instructor).

---

### Edge Cases

- What happens when the user tries to open a classroom that is unavailable or has failed?  
  System should indicate unavailability or failure and allow return to lobby or retry without leaving the app flow.
- How does the system behave if the live video feed is interrupted (e.g. network or source failure)?  
  System shows an on-screen error message, automatically attempts to reconnect in the background, and offers a "Retry" button; user retains the ability to return to the Main Lobby at any time.
- What happens when an instructor mutes a participant or starts a breakout while the participant is in a fragile state (e.g. joining)?  
  System should apply or queue the action in a predictable way and surface clear feedback to instructor and participants.
- How is the "current" cohort identified when returning to the lobby (e.g. for re-entry or deep links)?  
  Scope: re-entry from lobby is by explicit user choice; deep links / persistence can be defined in a later spec if needed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Main Lobby that displays exactly six classrooms (cohorts) that the user can select.
- **FR-002**: System MUST show a "Join Your Cohort" (or equivalent) area in the lobby listing the six classrooms.
- **FR-003**: When a user selects a classroom from the lobby in Student mode, the system MUST show the Student Class View with the live video feed for that classroom and the cohort title (e.g. "Cohort N: Class Session").
- **FR-004**: System MUST provide a "Return to Main Lobby" control in both Student Class View and Instructor Class View so the user can return to the lobby at any time.
- **FR-005**: System MUST provide an Instructor option in the lobby (e.g. "Instructors" in the header) that, when selected, puts the user in Instructor mode for subsequent classroom entry.
- **FR-006**: When a user in Instructor mode selects a classroom from the lobby, the system MUST show the Instructor Class View with the live video feed and an instructor Control Panel.
- **FR-007**: The instructor Control Panel MUST allow the instructor to mute participants in that classroom; participants are shown by display name (or identifier) so the instructor can target specific individuals.
- **FR-008**: The instructor Control Panel MUST allow the instructor to begin breakout rooms for that classroom (create rooms and put the class into breakout mode). Assigning participants to rooms and ending breakouts are out of scope for this feature.
- **FR-009**: System MUST display a consistent header across Main Lobby, Student Class View, and Instructor Class View (e.g. Overcast branding and Students / Instructors toggle) with the current role clearly indicated.
- **FR-010**: System MUST allow the user to switch between Students and Instructors from the Main Lobby and then enter a classroom in the selected role.
- **FR-011**: When the live video feed is interrupted (e.g. network or source failure), the system MUST show an on-screen error message, automatically attempt to reconnect in the background, and offer a "Retry" button; the user MUST retain the ability to return to the Main Lobby at any time.

### Key Entities

- **Lobby**: The main entry screen showing six classrooms (cohorts) and the role toggle; entry point for both student and instructor flows.
- **Classroom (Cohort)**: A single live classroom (one of six), identified by a label (e.g. Cohort 1–6); has one live video feed and, when viewed as instructor, an associated Control Panel.
- **Student Class View**: Screen for one classroom when the user is in Student mode; shows cohort title, live video feed, and "Return to Main Lobby".
- **Instructor Class View**: Screen for one classroom when the user is in Instructor mode; shows cohort title, live video feed, Control Panel (mute, breakout rooms), and "Return to Main Lobby".
- **Control Panel**: Instructor-only area in Instructor Class View providing mute participants and begin breakout rooms for that classroom.
- **Participant**: A user in a classroom; has a display name (or identifier) visible to the instructor. Can be muted by an instructor in that classroom and can be assigned to breakout rooms.

## Assumptions

- The six classrooms are fixed for this feature (no dynamic add/remove of cohorts in scope).
- "Live video feed" means real-time or near-real-time video of the classroom session; delivery mechanism is out of scope for this spec.
- Role (Student vs Instructor) is selected per session from the lobby; any user can choose Instructor mode (no access control or permission check in this feature).
- Breakout rooms: only "begin breakout rooms" (create rooms, put class into breakout mode) is in scope; assigning participants to rooms and ending breakouts are explicitly out of scope and may be specified in a follow-on feature.
- Header and footer (e.g. "Powered by the Overclock Accelerator") are consistent across the three panels as in the provided flow.
- Scale target: up to dozens of participants per classroom (e.g. ~50) with all six classrooms able to be active simultaneously.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can go from opening the app to watching a chosen classroom’s live video in under 60 seconds.
- **SC-002**: A user can return from any class view to the Main Lobby and select a different classroom in under 15 seconds.
- **SC-003**: An instructor can switch to Instructor mode from the lobby and open a classroom with the Control Panel (mute and start breakout rooms) in under 30 seconds.
- **SC-004**: At least 95% of users who attempt the primary flow (lobby → select cohort → view video → return to lobby) complete it without abandoning the flow due to navigation confusion.
- **SC-005**: Instructor actions (mute participant, begin breakout rooms) are reflected for participants in that classroom within a defined, acceptable delay (e.g. within 5 seconds under normal conditions).
- **SC-006**: System supports up to ~50 participants per classroom and all six classrooms active simultaneously without degradation of core flows (join, view video, return to lobby, instructor controls).
