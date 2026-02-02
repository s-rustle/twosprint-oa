/**
 * Cohort room configuration: maps cohort id 1–6 to Daily room URLs.
 * No database; URLs from env (NEXT_PUBLIC_COHORT_ROOM_URLS or NEXT_PUBLIC_DAILY_COHORT_*_URL).
 * See specs/001-overcast-video-classroom/contracts/cohort-config.md.
 */

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
    cachedUrls = getUrlsFromEnv();
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
 * Throws if env is missing or invalid.
 */
export function getCohortRoomUrl(id: CohortId): string {
  const urls = getUrls();
  if (urls.length !== 6) {
    throw new Error(
      "Cohort room URLs not configured. Set NEXT_PUBLIC_COHORT_ROOM_URLS (JSON array of 6 URLs) or NEXT_PUBLIC_DAILY_COHORT_1_URL … _6_URL."
    );
  }
  const url = urls[id - 1];
  if (!url || !url.startsWith("https://")) {
    throw new Error(`Invalid or missing room URL for cohort ${id}.`);
  }
  return url;
}

/**
 * Returns all six cohorts with id, label (room name: Clippy, Jarvis, …), and roomUrl.
 */
export function getAllCohorts(): Cohort[] {
  const urls = getUrls();
  if (urls.length !== 6) {
    throw new Error(
      "Cohort room URLs not configured. Set NEXT_PUBLIC_COHORT_ROOM_URLS or NEXT_PUBLIC_DAILY_COHORT_1_URL … _6_URL."
    );
  }
  return COHORT_IDS.map((id) => ({
    id,
    label: COHORT_LABELS[id],
    roomUrl: urls[id - 1],
  }));
}
