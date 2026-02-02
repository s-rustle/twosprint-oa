# Data Model: Overcast Video Classroom

**Feature**: 001-overcast-video-classroom  
**Date**: 2025-02-01

No persistent database. All “entities” below are in-memory (client state) or derived from Daily session/participant objects.

## 1. Cohort (Classroom)

| Field      | Type   | Description |
|-----------|--------|-------------|
| id        | 1..6   | Fixed cohort index (Cohort 1–6). |
| label     | string | Display label, e.g. "Cohort 1", "Cohort 2". |
| roomUrl   | string | Daily room URL for this cohort (from env/config). |

**Validation**: id in [1,6]; roomUrl non-empty, HTTPS.  
**Source**: Config (lib/cohort-config.ts) built from environment variables.

## 2. Role (User Mode)

| Value      | Description |
|-----------|-------------|
| student   | User sees Student Class View (video + Return to Lobby). |
| instructor| User sees Instructor Class View (video + Control Panel + Return to Lobby). |

**State**: Client-only (e.g. React state or URL query). Set in lobby; applied when entering cohort. No persistence.

## 3. Participant (Daily Session)

| Field         | Type   | Description |
|---------------|--------|-------------|
| session_id   | string | Daily session id (from Daily). |
| user_name    | string | Display name for list and mute targeting (from Daily join options). |
| tracks.audio.state | string | e.g. "playable", "blocked", "off". |
| tracks.video.state | string | e.g. "playable", "blocked", "off". |

**Source**: Daily participant objects via useParticipantIds / useParticipantProperty (user_name, tracks.video.state, tracks.audio.state). No local persistence.

## 4. App View State (Client)

| Field         | Type    | Description |
|---------------|---------|-------------|
| currentView  | 'lobby' \| 'cohort' | Active screen. |
| activeCohortId | 1..6 \| null | Cohort currently joined (null when in lobby). |
| role         | 'student' \| 'instructor' | Selected in lobby. |
| videoError   | string \| null | Error message when connection/feed fails (FR-011). |

**Transitions**: lobby → cohort (on cohort click); cohort → lobby (Return to Lobby); role change only in lobby. videoError set on Daily connection/track error; cleared on successful (re)join or Return to Lobby.

## 5. Instructor App Message Payloads (In-Band)

Used with Daily useAppMessage for mute and start-breakout (research §3).

| Type           | Payload shape | Description |
|----------------|---------------|-------------|
| mute           | { type: 'mute', sessionId: string } | Instructor requests mute of participant sessionId. |
| start-breakout | { type: 'start-breakout' } | Instructor starts breakout mode (UI only; assign/end out of scope). |

**Sender**: Instructor client. **Receiver**: All participants (or target for mute). No server persistence.

## 6. Relationships

- **Lobby** displays 6 Cohorts (id 1–6, labels, roomUrl from config).
- **User** has one Role (student or instructor) at a time; chosen in lobby.
- **Class view** (Student or Instructor) is for one Cohort (activeCohortId) and one Daily room (roomUrl).
- **Participant** list in that room comes from Daily (useParticipantIds / useParticipantProperty); instructor Control Panel shows them by user_name and allows mute / start-breakout via app messages.
