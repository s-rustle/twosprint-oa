# Tasks: Dark Mode Toggle for Overcast

**Input**: Design documents from `/specs/002-dark-mode-toggle/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested in the feature specification; no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1)
- Include exact file paths in descriptions

## Path Conventions

- Next.js app at repository root: `app/`, `components/`, `lib/` (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing app structure; no new project initialization (app already exists).

- [x] T001 Confirm app structure per plan: app/globals.css, app/layout.tsx, components/Header.tsx exist; no new top-level dirs required for this feature

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Theme CSS and load-time behavior that MUST be in place before the toggle can work correctly.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Add light-theme CSS variables in app/globals.css under a selector for light mode (e.g. `[data-theme="light"]` on root) so that --background, --foreground, --highlight, --accent use white/near-white background and dark text per FR-003 and research.md
- [x] T003 Add inline script in app/layout.tsx (or earliest safe point) to read localStorage key `overcast-theme` and set `document.documentElement.setAttribute('data-theme', …)` before first paint; default to `"dark"` when missing or invalid per contracts/theme-storage.md and research.md (avoid FOUC)

**Checkpoint**: Foundation ready — theme can be applied via data-theme; default dark on first load.

---

## Phase 3: User Story 1 - Toggle Theme and Persist Choice (Priority: P1) 🎯 MVP

**Goal**: User sees a toggle in the top right, clicks it to switch between light and dark mode; choice is persisted and restored on refresh/return.

**Independent Test**: Open app → see toggle in top right → click → entire app switches light ↔ dark → refresh → same mode still applied. Keyboard: focus toggle, Enter/Space → theme switches. Screen reader: toggle has accessible name (e.g. "Switch to light mode" / "Switch to dark mode").

### Implementation for User Story 1

- [x] T004 [US1] Add theme toggle control in components/Header.tsx in the top right (visible on welcome, lobby, class view); button MUST be keyboard focusable and activatable (Enter/Space) and MUST have an accessible name/label indicating current or resulting mode per FR-001 and FR-006
- [x] T005 [US1] Wire toggle in components/Header.tsx to read current theme from document.documentElement or state, flip to the other mode, call document.documentElement.setAttribute('data-theme', 'light'|'dark') and localStorage.setItem('overcast-theme', …) per contracts/theme-storage.md; ensure rapid clicks do not cause flicker or inconsistent state (edge case)

**Checkpoint**: User Story 1 complete — toggle works, theme persists, keyboard and a11y satisfied.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Align with constitution: clean code, comments, newcomer-friendly, minimal files.

- [x] T006 Code cleanup and add comments for theme logic (why default dark, why inline script for FOUC) in app/layout.tsx and components/Header.tsx per constitution
- [x] T007 Run quickstart.md validation (npm run dev, verify toggle placement, default dark, switch, persistence, keyboard, optional DevTools localStorage check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS user story
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **Polish (Phase 4)**: Depends on User Story 1 complete

### User Story Dependencies

- **User Story 1 (P1)**: Only story; depends on Phase 2 (theme CSS + load script).

### Within User Story 1

- T004 (toggle UI) before T005 (wire toggle to theme + storage); both in Header.tsx.

### Parallel Opportunities

- T002 and T003 touch different files (globals.css vs layout.tsx) but T003 may depend on T002 being present so that applying data-theme has effect; run T002 then T003. No [P] in Phase 2 for this feature.
- T006 and T007 can be done in either order; T007 validates the full flow.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (confirm structure)
2. Complete Phase 2: Foundational (theme CSS + load script)
3. Complete Phase 3: User Story 1 (toggle in Header + wire to theme and localStorage)
4. **STOP and VALIDATE**: Toggle, persistence, keyboard, a11y per Independent Test
5. Complete Phase 4: Polish and quickstart validation

### Incremental Delivery

- Single user story (US1) covers the full feature; no P2/P3 stories. Deliver after Phase 3 then polish.

### Notes

- [P] tasks = different files, no dependencies
- [US1] label maps task to User Story 1 for traceability
- Commit after each task or logical group
- Theme storage contract: key `overcast-theme`, values `"light"` | `"dark"`, default `"dark"`
