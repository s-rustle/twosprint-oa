import { getCohortLabel, getCohortRoomUrl } from "@/lib/cohort-config";
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
        <h1 className="text-xl font-semibold text-white">Invalid cohort</h1>
        <p className="mt-2 text-sm text-white/70">
          Cohort ID must be 1–6.{" "}
          <a href={lobbyHref} className="text-[var(--highlight)] underline">
            Return to lobby
          </a>
        </p>
      </main>
    );
  }

  let roomUrl: string;
  try {
    roomUrl = getCohortRoomUrl(
      cohortId as 1 | 2 | 3 | 4 | 5 | 6
    );
  } catch {
    const lobbyHref = `/lobby?role=${role}`;
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <h1 className="text-xl font-semibold text-white">
          Room not configured
        </h1>
        <p className="mt-2 text-center text-sm text-white/70">
          Cohort {cohortId} has no room URL. Set env vars and try again.{" "}
          <a href={lobbyHref} className="text-[var(--highlight)] underline">
            Return to lobby
          </a>
        </p>
      </main>
    );
  }

  const cohortLabel = getCohortLabel(cohortId as 1 | 2 | 3 | 4 | 5 | 6);

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
