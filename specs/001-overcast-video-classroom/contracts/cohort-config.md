# Contract: Cohort Room Configuration

**Feature**: 001-overcast-video-classroom  
**Type**: Configuration (no API; env → app)

## Purpose

Six fixed cohorts (1–6) each map to one Daily room URL. No database; URLs come from environment at build or runtime.

## Shape

- **Cohort id**: integer 1–6.
- **Room URL**: string, HTTPS, Daily meeting URL (e.g. `https://<team>.daily.co/<room>`).

## Source

Either:

1. **Single JSON env**: `NEXT_PUBLIC_COHORT_ROOM_URLS` = JSON array of 6 strings, order [Cohort 1, …, Cohort 6].  
   Example: `["https://a.daily.co/room1","https://a.daily.co/room2",…]`

2. **Six env vars**: `NEXT_PUBLIC_DAILY_COHORT_1_URL` … `NEXT_PUBLIC_DAILY_COHORT_6_URL`.

## Accessor (app)

- `getCohortRoomUrl(id: 1 | 2 | 3 | 4 | 5 | 6): string`
- `getAllCohorts(): { id: number; label: string; roomUrl: string }[]`  
  Labels: "Cohort 1" … "Cohort 6".

## Validation

- Exactly 6 URLs; all non-empty, HTTPS.
- Missing or invalid env: fail at startup or first access (e.g. throw or show config error in UI).
