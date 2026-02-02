# Overcast — Video-based Classroom

A video classroom app with a main lobby, six cohort rooms, and student/instructor modes. Built with Next.js and [Daily](https://www.daily.co) for real-time video.

## Quick start

1. **Install dependencies**

   ```bash
   npm install
   npm install @daily-co/daily-react @daily-co/daily-js jotai
   ```

2. **Configure cohort room URLs**

   No database. Supply six Daily room URLs via environment variables.

   Create `.env.local` in the repo root:

   **Option A – JSON (recommended)**

   ```bash
   NEXT_PUBLIC_COHORT_ROOM_URLS='["https://your-team.daily.co/cohort-1","https://your-team.daily.co/cohort-2","https://your-team.daily.co/cohort-3","https://your-team.daily.co/cohort-4","https://your-team.daily.co/cohort-5","https://your-team.daily.co/cohort-6"]'
   ```

   **Option B – Six variables**

   ```bash
   NEXT_PUBLIC_DAILY_COHORT_1_URL=https://your-team.daily.co/cohort-1
   NEXT_PUBLIC_DAILY_COHORT_2_URL=https://your-team.daily.co/cohort-2
   # … through COHORT_6
   ```

   Replace with your real Daily room URLs from [daily.co](https://www.daily.co).

3. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You’ll see the Main Lobby with six cohorts and a Students/Instructors toggle.

4. **Verify flows**

   - **Student**: Click a cohort → class view with video feed → “Return to Main Lobby.”
   - **Instructor**: Toggle “Instructors” in the header, click a cohort → class view with Control Panel (mute, begin breakout) and “Return to Main Lobby.”
   - **Video error**: If the feed fails, you see an error message, Retry, and “Return to Main Lobby.”

For full setup, troubleshooting, and production build steps, see **[specs/001-overcast-video-classroom/quickstart.md](specs/001-overcast-video-classroom/quickstart.md)**.

## Tech stack

- Next.js (App Router), TypeScript, React
- [Daily](https://www.daily.co) for video/audio and app messages
- Tailwind CSS, Jotai

## Project structure

- `app/lobby` — Main lobby with six cohort tiles
- `app/cohort/[id]` — Class view (student or instructor) for a cohort
- `components/` — Header, LayoutShell (includes footer), CohortCard, ClassView, ControlPanel, VideoError, CohortRoomClient
- `lib/` — cohort-config (room URLs), daily-app-messages (mute/breakout payloads)

## Deploy

Run `npm run build` and `npm start`. Set the same env vars in your host (e.g. Vercel project settings).
