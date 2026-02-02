/**
 * Cohort room configuration: maps cohort id 1–6 to Daily room URLs.
 * No database; URLs from env (NEXT_PUBLIC_COHORT_ROOM_URLS or NEXT_PUBLIC_DAILY_COHORT_*_URL).
 * When env is missing, lobby still shows 6 cohorts; cohort page shows "Configure room URLs" (Vercel / .env.local).
 * See specs/001-overcast-video-classroom/contracts/cohort-config.md.
 */

/** Sentinel used when room URLs are not configured; cohort page shows config instructions instead of joining. */
export const PLACEHOLDER_ROOM_URL = "https://placeholder.daily.co/not-configured";

const COHORT_IDS = [1, 2, 3, 4, 5, 6] as const;
export type CohortId = (typeof COHORT_IDS)[number];

/** Display names for cohorts 1–6 (match room names: 01-clippy, 02-jarvis, …). */
const COHORT_LABELS: Record<CohortId, string> = {
  1: "Clippy",
  2: "Jarvis",
  3: "R2D2",
  4: "Cortana",
  5: "Optimus",
  6: "Robocop",
};

export interface Cohort {
  id: number;
  label: string;
  roomUrl: string;
}

function getUrlsFromEnv(): string[] {
  const json = process.env.NEXT_PUBLIC_COHORT_ROOM_URLS;
  if (json) {
    try {
      const arr = JSON.parse(json) as unknown;
      if (Array.isArray(arr) && arr.length === 6 && arr.every((u) => typeof u === "string")) {
        return arr as string[];
      }
    } catch {
      // fall through to per-cohort env
    }
  }
  // Prefer NEXT_PUBLIC_DAILY_COHORT_1_URL … _6_URL; fallback to NEXT_PUBLIC_DAILY_ROOM_1 … _6
  const urls = COHORT_IDS.map((i) => {
    const cohortUrl = process.env[`NEXT_PUBLIC_DAILY_COHORT_${i}_URL`];
    if (typeof cohortUrl === "string" && cohortUrl.startsWith("https://")) return cohortUrl;
    const roomUrl = process.env[`NEXT_PUBLIC_DAILY_ROOM_${i}`];
    if (typeof roomUrl === "string" && roomUrl.startsWith("https://")) return roomUrl;
    return undefined;
  }).filter((u): u is string => typeof u === "string");
  return urls.length === 6 ? urls : [];
}

let cachedUrls: string[] | null = null;

function getUrls(): string[] {
  if (cachedUrls === null) {
    const fromEnv = getUrlsFromEnv();
    cachedUrls =
      fromEnv.length === 6
        ? fromEnv
        : (COHORT_IDS.map(() => PLACEHOLDER_ROOM_URL) as string[]);
  }
  return cachedUrls;
}

/**
 * Returns the display label for a cohort (e.g. "Clippy", "Jarvis").
 */
export function getCohortLabel(id: CohortId): string {
  return COHORT_LABELS[id];
}

/**
 * Returns the Daily room URL for the given cohort id (1–6).
 * Returns PLACEHOLDER_ROOM_URL when not configured; cohort page should show config UI instead of joining.
 */
export function getCohortRoomUrl(id: CohortId): string {
  const urls = getUrls();
  const url = urls[id - 1];
  if (!url || url === PLACEHOLDER_ROOM_URL) return PLACEHOLDER_ROOM_URL;
  if (!url.startsWith("https://")) return PLACEHOLDER_ROOM_URL;
  return url;
}

/**
 * Returns all six cohorts with id, label (room name: Clippy, Jarvis, …), and roomUrl.
 * When env is missing, roomUrl is PLACEHOLDER_ROOM_URL; cohort page shows config instructions.
 */
export function getAllCohorts(): Cohort[] {
  const urls = getUrls();
  return COHORT_IDS.map((id) => ({
    id,
    label: COHORT_LABELS[id],
    roomUrl: urls[id - 1] ?? PLACEHOLDER_ROOM_URL,
  }));
}
