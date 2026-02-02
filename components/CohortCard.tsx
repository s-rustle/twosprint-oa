import Link from "next/link";
import type { Role } from "./Header";

/**
 * Single cohort tile for the lobby. Links to class view with current role (student or instructor).
 */
interface CohortCardProps {
  id: number;
  label: string;
  role: Role;
}

export function CohortCard({ id, label, role }: CohortCardProps) {
  const href = `/cohort/${id}?role=${role}`;
  return (
    <Link
      href={href}
      className="flex min-h-[120px] flex-col justify-center rounded-lg border-2 border-[var(--input-border)] bg-[var(--input-bg)] px-6 py-4 text-left shadow-sm transition-[border-color,background-color,box-shadow] hover:border-[var(--highlight)] hover:bg-[var(--hover-bg)] hover:shadow-[inset_4px_0_0_var(--highlight)] focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
    >
      <span className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
        {label}
      </span>
      <span className="mt-1 text-lg font-semibold text-[var(--foreground)]">
        Join class
      </span>
    </Link>
  );
}
