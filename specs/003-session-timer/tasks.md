# Tasks: Session Timer (003)

**Input**: Design documents from `/specs/003-session-timer/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in the feature specification; no test tasks included.

**Organization**: Single user story (P1). Setup → Foundational → User Story 1 → Polish.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1) for Phase 3 tasks only
- Include exact file paths in descriptions

## Path Conventions

- Next.js app at repository root: `app/`, `components/`, `lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing app structure; no new dependencies per plan.

- [x] T001 Confirm app structure and that no new dependencies are required for the session timer (see specs/003-session-timer/plan.md)
- [x] T002 Confirm ClassView exists and is the integration point for SessionTimer (components/ClassView.tsx)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Ensure the class view is ready to host the timer. No shared DB or API for this feature.

**Checkpoint**: ClassView is the confirmed mount point; SessionTimer can be added in Phase 3.

*(No additional foundational tasks; T002 covers the integration point.)*

---

## Phase 3: User Story 1 - See Session Elapsed Time in Class View (Priority: P1) 🎯 MVP

**Goal**: When a user joins a classroom, a session timer appears (e.g. in a corner), starts at 00:00, counts up in MM:SS, and resets when they leave and re-enter.

**Independent Test**: Join a cohort from the lobby → timer appears in a corner → shows 00:00 then counts up (00:01, 00:02, …) → leave and re-join → timer resets to 00:00 and counts up again.

### Implementation for User Story 1

- [x] T003 [P] [US1] Create SessionTimer component with elapsed state, setInterval(1000), MM:SS display (leading zeros), and cleanup on unmount in components/SessionTimer.tsx
- [x] T004 [US1] Render SessionTimer inside ClassView positioned in a corner (e.g. top-right) so it does not obscure the video grid in components/ClassView.tsx
- [x] T005 [US1] Add comments for timer lifecycle (mount/interval/cleanup) and placement in components/SessionTimer.tsx and components/ClassView.tsx

**Checkpoint**: Join a classroom → timer visible in corner, 00:00 → counts up; leave and re-join → timer resets to 00:00.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Align with constitution; validate per quickstart.

- [x] T006 Run quickstart validation (npm run build) and verify session timer per specs/003-session-timer/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational**: Covered by T002 (ClassView as integration point).
- **User Story 1 (Phase 3)**: Depends on T001–T002.
- **Polish (Phase 4)**: Depends on Phase 3 completion.

### Within User Story 1

- T003 (SessionTimer component) before T004 (integrate in ClassView).
- T004 before T005 (comments reference final placement).

### Parallel Opportunities

- T001 and T002 can be done in parallel (both are confirmation/read-only).
- After T003, T004 and T005 are sequential (same file ClassView.tsx for T004/T005).

---

## Parallel Example: Setup

```bash
# Confirm structure and integration point in parallel:
Task T001: Confirm app structure and no new deps (plan.md)
Task T002: Confirm ClassView exists (components/ClassView.tsx)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001, T002).
2. Complete Phase 3: User Story 1 (T003 → T004 → T005).
3. **STOP and VALIDATE**: Join classroom, confirm timer in corner, 00:00 → count up; leave and re-join, confirm reset.
4. Complete Phase 4: Polish (T006).

### Task Summary

| Phase   | Task IDs | Count | Description                    |
|---------|----------|-------|--------------------------------|
| Setup   | T001–T002| 2     | Confirm structure & ClassView  |
| US1 (P1)| T003–T005| 3     | SessionTimer + ClassView + comments |
| Polish  | T006     | 1     | Quickstart validation          |
| **Total** | **6**  |        |                                |

### Format Validation

- All tasks use checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`.
- US1 tasks labeled [US1]; Setup and Polish have no story label.
- T003 marked [P]; T004/T005 sequential (integration + comments in ClassView).
