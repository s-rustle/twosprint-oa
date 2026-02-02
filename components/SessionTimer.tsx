"use client";

import { useEffect, useState } from "react";

/**
 * Formats elapsed seconds as MM:SS with leading zeros.
 * Minutes may exceed 99 for long sessions (e.g. 100:00).
 */
function formatMMSS(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(minutes >= 100 ? 3 : 2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
}

/**
 * Session timer: shows elapsed time (MM:SS) since mount.
 * Starts at 00:00, ticks every second via setInterval.
 * Resets when the component unmounts (user leaves class view); re-entering mounts a new instance at 00:00.
 * Lifecycle: on mount we start the interval; on unmount we clear it to avoid leaks.
 */
export function SessionTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="absolute right-4 top-4 rounded-md bg-black/60 px-3 py-1.5 font-mono text-sm tabular-nums text-white/90"
      aria-live="polite"
      aria-label={`Session time: ${formatMMSS(elapsedSeconds)}`}
    >
      {formatMMSS(elapsedSeconds)}
    </div>
  );
}
