"use client";

import { useEffect } from "react";
import { coerceErrorToMessage } from "@/lib/coerce-error";
import Link from "next/link";

/**
 * App-level error boundary. Coerces plain-object errors to a readable message
 * so Next.js never displays "[object Object]" in the overlay or UI.
 */
export default function Error({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  const message = coerceErrorToMessage(error);

  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-12">
      <h1 className="text-xl font-semibold text-[var(--foreground)]">
        Something went wrong
      </h1>
      <p className="max-w-md text-center text-sm text-white/70">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-[var(--highlight)] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/lobby"
          className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
        >
          Return to lobby
        </Link>
      </div>
    </div>
  );
}
