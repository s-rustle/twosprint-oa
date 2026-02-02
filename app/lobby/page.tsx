import type { Role } from "@/components/Header";
import { CohortCard } from "@/components/CohortCard";
import { getAllCohorts } from "@/lib/cohort-config";

/**
 * Main Lobby: "Join Your Cohort" with six cohort tiles.
 * Role comes from URL (?role=student|instructor); default student.
 * Header is in root layout; links to cohort include current role.
 */
export default async function LobbyPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role: Role =
    params.role === "instructor" ? "instructor" : "student";

  let cohorts;
  try {
    cohorts = getAllCohorts();
  } catch (err) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12">
        <h1 className="text-xl font-semibold text-[var(--foreground)]">
          Join Your Cohort
        </h1>
        <p className="mt-4 max-w-md text-center text-sm text-[var(--muted)]">
          Cohort room URLs are not configured. Set{" "}
          <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-[var(--highlight)]">
            NEXT_PUBLIC_COHORT_ROOM_URLS
          </code>{" "}
          (JSON array of 6 Daily room URLs) or{" "}
          <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-[var(--highlight)]">
            NEXT_PUBLIC_DAILY_COHORT_1_URL
          </code>{" "}
          … <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-[var(--highlight)]">_6_URL</code> in{" "}
          <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-[var(--foreground)]">.env.local</code>.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-8">
      <h1 className="section-heading mb-2 text-2xl font-bold uppercase tracking-tight text-[var(--foreground)]">
        Join Your Cohort
      </h1>
      <p className="mb-8 text-sm text-[var(--muted)]">
        Choose a classroom to join as {role === "student" ? "student" : "instructor"}.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cohorts.map((cohort) => (
          <CohortCard
            key={cohort.id}
            id={cohort.id}
            label={cohort.label}
            role={role}
          />
        ))}
      </div>
    </main>
  );
}
