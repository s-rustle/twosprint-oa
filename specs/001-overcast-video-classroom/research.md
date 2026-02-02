# Research: Overcast Video Classroom (Phase 0)

**Feature**: 001-overcast-video-classroom  
**Date**: 2025-02-01

## 1. Daily Video Platform Integration

**Decision**: Use Daily (daily.co) for real-time video: @daily-co/daily-react with DailyProvider and hooks (useDaily, useParticipantIds, useParticipantProperty, useAppMessage, useDailyEvent). One room URL per cohort; join with `url` and optional `userName` for participant display names.

**Rationale**: Spec requires live video per classroom, participant identity for mute, and “begin breakout rooms.” Daily provides meeting URLs, participant list (user_name, tracks.audio/video), and app messages. Daily React’s useParticipantProperty(id, ['user_name', 'tracks.audio.state', 'tracks.video.state']) supports Control Panel participant list and mute targeting; useAppMessage supports custom instructor commands (mute, start-breakout) without a backend in MVP.

**Alternatives considered**: Raw WebRTC (too low-level); Twilio Video (extra cost and complexity); LiveKit (viable but Daily docs and React hooks align with Next.js and were referenced in plan input).

## 2. Next.js + Daily Best Practices

**Decision**: Wrap only the active cohort route (e.g. `app/cohort/[id]/page.tsx`) with DailyProvider using that cohort’s room URL. Lobby has no DailyProvider. When user navigates from one cohort to another, leave the current call (daily.leave()) then mount a new DailyProvider with the new cohort URL to avoid multiple simultaneous call instances unless Daily explicitly supports it.

**Rationale**: Daily React expects a single url per provider; one provider per “room” keeps lifecycle simple. Next.js App Router allows dynamic route for cohort id; cohort id → room URL from config (env).

**Alternatives considered**: Single DailyProvider at root with url switching—possible but requires leave/join sequencing; per-route provider keeps join/leave tied to navigation and avoids strictMode/allowMultipleCallInstances issues.

## 3. Mute and Breakout Signaling (No Backend)

**Decision**: Use Daily’s useAppMessage to send instructor-initiated commands (e.g. { type: 'mute', sessionId } or { type: 'start-breakout' }) to participants. Participants listen via onAppMessage and apply mute locally (e.g. disable mic via Daily) or show “breakout started” UI. Mute: instructor sends “mute” with target session_id; client with that session_id calls daily.setLocalAudio(false). Start breakout: broadcast “start-breakout”; all clients show breakout mode (assign/end out of scope).

**Rationale**: Spec says instructor can mute participants and begin breakout rooms; no backend or DB. App messages are in-band and sufficient for MVP; authority is implicit (anyone can toggle Instructor in this feature). If Daily provides server-side participant controls (e.g. REST API to mute), that could replace or complement app messages in a later iteration.

**Alternatives considered**: Backend API to store “muted” state—rejected (no DB). Daily REST API for participant control—use if available and documented; otherwise app-message-driven local mute and breakout UI.

## 4. Visual System (Overcast / Overclock Accelerator)

**Decision**: Implement design tokens in Tailwind/globals.css: black background (#0a0a0a or similar), neon teal (#00FFD1) for primary CTAs and highlights, yellow/orange (#FFBD17) for urgency and key labels. Typography: bold geometric sans-serif for headings (e.g. “Join Your Cohort”), uppercase where specified; body white/gray. Layout: grid for 6 cohort cards; ample spacing; Header (Overcast + Students/Instructors) and Footer (Powered by the Overclock Accelerator) on all views.

**Rationale**: Plan input specified sharp, futuristic, minimal aesthetic with authority and technical expertise; teal + orange on black matches and supports readability and conversion.

**Alternatives considered**: Generic light theme—rejected per input. Additional accent palette—deferred; teal + orange sufficient for MVP.

## 5. Cohort Room URL Configuration

**Decision**: Six fixed cohort IDs (1–6). Room URLs supplied via environment: either one JSON array (e.g. NEXT_PUBLIC_COHORT_ROOM_URLS='["https://…","https://…",…]') or six vars (NEXT_PUBLIC_DAILY_COHORT_1_URL … NEXT_PUBLIC_DAILY_COHORT_6_URL). App reads at build or runtime and exposes a single config (e.g. getCohortRoomUrl(id: 1..6)) used by the cohort page.

**Rationale**: No database; “pre-defined Daily URLs for each of the classes” implies env or static config. Single helper keeps cohort → URL logic in one place and aligns with constitution (minimal files).

**Alternatives considered**: Hardcoded URLs in code—rejected (per-environment flexibility). Database—explicitly out of scope.

## 6. Error and Reconnect Behavior (FR-011)

**Decision**: On Daily connection/network failure or track errors, show an on-screen error component (VideoError): message, “Retry” button (re-join or restart Daily), and “Return to Main Lobby” link. Use Daily’s network/connection events (e.g. useNetwork, useDailyEvent for 'connection-error' or 'track-started'/'track-stopped') to detect failure; optionally trigger automatic reconnection (Daily’s built-in or explicit leave/join) in background while showing the same error UI with Retry.

**Rationale**: Spec clarification: show error message, auto-reconnect in background, and offer Retry; user can always return to lobby. Implementation: one shared VideoError component and event-driven state for “error” vs “connected.”

**Alternatives considered**: Retry-only (no auto-reconnect)—rejected per clarification. Silent auto-reconnect only—rejected; user must see message and have Retry/Lobby.
