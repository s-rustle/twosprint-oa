# Tasks: Overcast Video Classroom

**Input**: Design documents from `/specs/001-overcast-video-classroom/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested in the feature specification; no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Next.js app at repository root: `app/`, `components/`, `lib/` (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per plan: app/lobby/, app/cohort/[id]/, components/, lib/
- [x] T002 Install Daily and peer deps: run `npm install @daily-co/daily-react @daily-co/daily-js jotai` in repo root
- [x] T003 [P] Add design tokens to app/globals.css (black background, neon teal #00FFD1, yellow/orange #FFBD17, bold geometric sans-serif base)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement cohort config in lib/cohort-config.ts: getCohortRoomUrl(id), getAllCohorts() from NEXT_PUBLIC_COHORT_ROOM_URLS or NEXT_PUBLIC_DAILY_COHORT_1_URL…6 (per contracts/cohort-config.md)
- [x] T005 Implement root layout in app/layout.tsx (global styles, font, shell with Header + children + Footer)
- [x] T006 Implement app/page.tsx to redirect to /lobby or render lobby as entry
- [x] T007 Implement components/Header.tsx (Overcast logo, Students/Instructors toggle; accept role and onRoleChange or read from URL)
- [x] T008 [P] Implement components/Footer.tsx ("Powered by the Overclock Accelerator")

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Join Lobby and Attend Classroom as Student (Priority: P1) 🎯 MVP

**Goal**: User sees Main Lobby with six cohorts, clicks one as Student, sees live video and cohort title, can return to lobby.

**Independent Test**: Open app → see lobby with 6 classrooms → click one → see live video and cohort title → click "Return to Main Lobby" → see lobby again.

### Implementation for User Story 1

- [x] T009 [P] [US1] Implement components/CohortCard.tsx (single cohort tile; link to /cohort/[id]?role=student with cohort label)
- [x] T010 [US1] Implement app/lobby/page.tsx ("Join Your Cohort" heading, 6 CohortCards via getAllCohorts(), default role Student; Header with role; links to /cohort/[id]?role=student)
- [x] T011 [US1] Implement app/cohort/[id]/page.tsx (read id and role from searchParams; wrap with DailyProvider url={getCohortRoomUrl(Number(id))}; render ClassView when role=student)
- [x] T012 [US1] Implement components/ClassView.tsx (Daily meeting UI: video feed, cohort title "Cohort N: Class Session", "Return to Main Lobby" button linking to /lobby)
- [x] T013 [US1] Wire Daily join in app/cohort/[id]/page.tsx (useDaily url + userName optional; leave on unmount or when user clicks Return to Main Lobby)
- [x] T014 [US1] Implement components/VideoError.tsx (on-screen error message, Retry button, "Return to Main Lobby" link; FR-011); in cohort page handle connection/track error (show VideoError, auto-reconnect in background, Retry re-join)

**Checkpoint**: User Story 1 complete - student can join lobby, pick cohort, view video, return to lobby

---

## Phase 4: User Story 2 - Switch to Instructor Mode and Manage a Classroom (Priority: P2)

**Goal**: User toggles Instructors in lobby, clicks cohort, sees Instructor Class View with Control Panel (mute participants, begin breakout rooms); can return to lobby.

**Independent Test**: Lobby → select "Instructors" → click cohort → see Instructor Class View with video feed and Control Panel → use mute and/or breakout controls → return to Main Lobby.

### Implementation for User Story 2

- [x] T015 [P] [US2] Implement lib/daily-app-messages.ts (types and helpers for mute/start-breakout app message payloads per contracts/app-messages.md)
- [x] T016 [US2] Implement components/ControlPanel.tsx (participant list by display name via useParticipantIds/useParticipantProperty; mute button per participant; "Begin breakout rooms" button; send app messages via useAppMessage)
- [x] T017 [US2] In app/cohort/[id]/page.tsx when role=instructor render ControlPanel below ClassView (instructor-only)
- [x] T018 [US2] Handle incoming app messages in cohort/ClassView: onAppMessage type 'mute' with sessionId → if local session match apply mute (setLocalAudio(false)); type 'start-breakout' → show "Breakout started" UI (minimal; assign/end out of scope)

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: User Story 3 - Consistent Navigation and Role Switching (Priority: P3)

**Goal**: Header and role toggle consistent on all screens; role persists when returning to lobby; changing role in lobby applies to next cohort join.

**Independent Test**: Lobby → student view → lobby → switch to Instructors → instructor view → lobby; confirm header and role state consistent.

### Implementation for User Story 3

- [x] T019 [US3] Ensure Header in app/layout.tsx or lobby/cohort pages shows current role (Students vs Instructors) and toggle updates role; persist role via URL query (/lobby?role=instructor, /cohort/[id]?role=instructor) so cohort page and back-navigation preserve it
- [x] T020 [US3] Ensure "Return to Main Lobby" from app/cohort/[id] links to /lobby with current role in query (or default student); lobby CohortCard links include role param so next cohort join uses selected role

**Checkpoint**: All user stories independently functional; navigation and role consistent

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories. Align with constitution: clean code, comments, newcomer-friendly, minimal/single files where possible.

- [x] T021 [P] Add or update README with setup and cohort URL env vars per specs/001-overcast-video-classroom/quickstart.md
- [x] T022 Code cleanup and add comments for non-obvious Daily usage and role-based UI per constitution
- [x] T023 Run quickstart.md validation (install deps, set env, npm run dev, verify lobby → cohort → return to lobby and instructor flow)
- [x] T024 Review file count; consolidate into single files where coherent per constitution

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3–5)**: All depend on Foundational completion; can proceed sequentially P1→P2→P3 or in parallel if staffed
- **Polish (Phase 6)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: After Foundational - no dependency on US2/US3
- **User Story 2 (P2)**: After Foundational - reuses lobby, cohort route, ClassView; adds ControlPanel and app messages
- **User Story 3 (P3)**: After Foundational - reinforces Header/role/URL consistency across US1/US2

### Within Each User Story

- Shared components (CohortCard, ClassView, ControlPanel, VideoError) before pages that use them
- Cohort page and Daily wiring before error handling (VideoError integration)
- Core implementation before polish

### Parallel Opportunities

- T003 [P] (globals.css) can run with T001/T002
- T008 [P] (Footer) can run with T007 (Header)
- T009 [P] (CohortCard) can run with T010 (lobby page) prep
- T015 [P] (daily-app-messages.ts) can run with T016 (ControlPanel)
- T021 [P] (README) can run with T022–T024

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: User Story 1  
4. **STOP and VALIDATE**: Lobby → pick cohort → video → Return to Main Lobby  
5. Deploy/demo if ready  

### Incremental Delivery

1. Setup + Foundational → foundation ready  
2. Add User Story 1 → test student flow → Deploy/Demo (MVP)  
3. Add User Story 2 → test instructor flow → Deploy/Demo  
4. Add User Story 3 → test navigation/role consistency → Deploy/Demo  
5. Polish → README, comments, quickstart validation  

### Parallel Team Strategy

- Team completes Setup + Foundational together  
- Then: Developer A (US1), Developer B (US2), Developer C (US3) in parallel  
- Integrate and run Phase 6 Polish  

---

## Notes

- [P] tasks = different files, no dependencies  
- [USn] label maps task to user story for traceability  
- Each user story is independently testable via the Independent Test criteria above  
- Commit after each task or logical group  
- Stop at any checkpoint to validate that story independently  
