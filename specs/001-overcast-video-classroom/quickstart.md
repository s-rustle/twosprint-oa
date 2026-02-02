# Quickstart: Overcast Video Classroom

**Feature**: 001-overcast-video-classroom  
**Date**: 2025-02-01

## Prerequisites

- Node 20+
- npm or yarn
- Six Daily room URLs (create at [daily.co](https://www.daily.co) or use Daily dashboard)

## 1. Install dependencies

```bash
npm install
npm install @daily-co/daily-react @daily-co/daily-js jotai
```

Existing Next.js, React, and Tailwind are already in the project; add Daily and jotai as above.

## 2. Configure cohort room URLs

No database. Supply six Daily room URLs via environment variables.

**Option A – Single JSON variable (recommended for Vercel)**

Create `.env.local` in repo root:

```bash
NEXT_PUBLIC_COHORT_ROOM_URLS='["https://your-team.daily.co/cohort-1","https://your-team.daily.co/cohort-2","https://your-team.daily.co/cohort-3","https://your-team.daily.co/cohort-4","https://your-team.daily.co/cohort-5","https://your-team.daily.co/cohort-6"]'
```

Replace with your real Daily room URLs.

**Option B – Six separate variables**

```bash
NEXT_PUBLIC_DAILY_COHORT_1_URL=https://your-team.daily.co/cohort-1
NEXT_PUBLIC_DAILY_COHORT_2_URL=https://your-team.daily.co/cohort-2
# … through COHORT_6
```

## 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the Main Lobby with six cohorts and the Students/Instructors toggle.

## 4. Verify flows

1. **Student**: Click a cohort → Class view with Daily video feed and “Return to Main Lobby.”
2. **Instructor**: Toggle “Instructors” in the header, click a cohort → Class view with Control Panel (mute, begin breakout) and “Return to Main Lobby.”
3. **Video error**: If the feed fails, you should see an error message, Retry, and “Return to Main Lobby” (FR-011).

## 5. Build for production

```bash
npm run build
npm start
```

Set the same env vars in your hosting (e.g. Vercel project settings) when deploying.

## 6. Getting Daily room URLs

- Sign up at [daily.co](https://www.daily.co).
- Create six meeting rooms (or use recurring rooms) and copy each room URL.
- Use token-based rooms if you add auth later; for this feature, room URLs alone are sufficient for local/pre-defined setup.

## Troubleshooting

- **Blank lobby or missing cohorts**: Ensure `NEXT_PUBLIC_COHORT_ROOM_URLS` (or all six `NEXT_PUBLIC_DAILY_COHORT_*_URL`) are set and valid HTTPS URLs.
- **“Failed to join” in class view**: Check Daily room URL and network; ensure room exists and is not expired.
- **No video/audio**: Grant browser camera/mic permissions; check Daily dashboard for room limits and status.
