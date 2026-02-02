"use client";

import Link from "next/link";
import type { Role } from "./Header";

/**
 * Shown when the live video feed fails (FR-011).
 * Displays error message, Retry button, and "Return to Main Lobby" link.
 * Preserves role in lobby URL so user returns in same mode (student/instructor).
 */
interface VideoErrorProps {
  message?: string;
  onRetry?: () => void;
  role?: Role;
}

export function VideoError({
  message = "The video feed was interrupted. We’re trying to reconnect.",
  onRetry,
  role = "student",
}: VideoErrorProps) {
  const lobbyHref = `/lobby?role=${role}`;
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-lg border border-white/20 bg-white/5 p-8 text-center">
      <p className="text-sm text-white/80">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-[var(--highlight)] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Retry
          </button>
        )}
        <Link
          href={lobbyHref}
          className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
        >
          Return to Main Lobby
        </Link>
      </div>
    </div>
  );
}
