import {
  getCohortLabel,
  getCohortRoomUrl,
  PLACEHOLDER_ROOM_URL,
} from "@/lib/cohort-config";
import { CohortRoomClient } from "@/components/CohortRoomClient";
import type { Role } from "@/components/Header";

/**
 * Cohort class view: reads id and role from URL, wraps with DailyProvider,
 * renders ClassView (student) or ClassView + ControlPanel (instructor, T017).
 * T011: read id and role; DailyProvider + ClassView when role=student.
 * T013: join/leave wired in CohortRoomClient.
 */
export default async function CohortPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const { id } = await params;
  const { role: roleParam } = await searchParams;
  const role: Role =
    roleParam === "instructor" ? "instructor" : "student";

  const cohortId = Math.floor(Number(id));
  if (!Number.isInteger(cohortId) || cohortId < 1 || cohortId > 6) {
    const lobbyHref = `/lobby?role=${role}`;
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <h1 className="text-xl font-semibold text-[var(--foreground)]">Invalid cohort</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Cohort ID must be 1–6.{" "}
          <a href={lobbyHref} className="text-[var(--highlight)] underline">
            Return to lobby
          </a>
        </p>
      </main>
    );
  }

  const cohortIdTyped = cohortId as 1 | 2 | 3 | 4 | 5 | 6;
  const roomUrl = getCohortRoomUrl(cohortIdTyped);
  const cohortLabel = getCohortLabel(cohortIdTyped);

  if (roomUrl === PLACEHOLDER_ROOM_URL) {
    const lobbyHref = `/lobby?role=${role}`;
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12">
        <h1 className="section-heading text-xl font-semibold text-[var(--foreground)]">
          Configure room URLs
        </h1>
        <p className="mt-4 max-w-md text-center text-sm text-[var(--muted)]">
          Cohort room URLs are not set. Add them so this app can join Daily
          rooms.
        </p>
        <div className="mt-6 rounded-lg border-2 border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-left text-sm">
          <p className="font-medium text-[var(--foreground)]">
            Vercel (production / preview)
          </p>
          <p className="mt-1 text-[var(--muted)]">
            Project → Settings → Environment Variables. Add either:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-[var(--muted)]">
            <li>
              <code className="rounded bg-[var(--hover-bg)] px-1 py-0.5 text-[var(--highlight)]">
                NEXT_PUBLIC_COHORT_ROOM_URLS
              </code>{" "}
              — JSON array of 6 Daily room URLs
            </li>
            <li>
              Or{" "}
              <code className="rounded bg-[var(--hover-bg)] px-1 py-0.5 text-[var(--highlight)]">
                NEXT_PUBLIC_DAILY_COHORT_1_URL
              </code>{" "}
              … <code className="text-[var(--highlight)]">_6_URL</code>
            </li>
          </ul>
          <p className="mt-3 text-[var(--muted)]">
            Locally: use <code className="rounded bg-[var(--hover-bg)] px-1 py-0.5 text-[var(--foreground)]">.env.local</code> with the same variable names.
          </p>
        </div>
        <a
          href={lobbyHref}
          className="cta-link mt-6 inline-flex rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
        >
          Return to lobby
        </a>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <CohortRoomClient
        roomUrl={roomUrl}
        cohortId={cohortId}
        cohortLabel={cohortLabel}
        role={role}
      />
    </main>
  );
}
