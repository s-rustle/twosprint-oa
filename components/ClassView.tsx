"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  DailyVideo,
  useDaily,
  useParticipantIds,
  useLocalSessionId,
  useAppMessage,
} from "@daily-co/daily-react";
import { isMutePayload, isStartBreakoutPayload } from "@/lib/daily-app-messages";
import type { Role } from "./Header";
import { SessionTimer } from "./SessionTimer";

/**
 * Class view: cohort title, live video feed (participant tiles), and "Return to Main Lobby".
 * Role comes from URL (?role=student|instructor); "Return to Main Lobby" link preserves it.
 * Handles Daily app messages: mute → if target is local session, setLocalAudio(false);
 * start-breakout → show "Breakout started" banner (assign/end out of scope). Must be inside DailyProvider.
 * Session timer is rendered in the top-right corner so it is visible but does not obscure the video grid;
 * it starts at 00:00 on mount and resets when the user leaves (unmount) and re-enters (new mount).
 */
interface ClassViewProps {
  cohortId: number;
  cohortLabel: string;
  role: Role;
}

export function ClassView({ cohortId, cohortLabel, role }: ClassViewProps) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const participantIds = useParticipantIds({ sort: "user_name" });
  const [breakoutStarted, setBreakoutStarted] = useState(false);

  useAppMessage({
    onAppMessage: useCallback(
      (ev: { data?: unknown }) => {
        const data = ev?.data;
        if (isMutePayload(data) && data.sessionId === localSessionId && daily && !daily.isDestroyed()) {
          daily.setLocalAudio(false);
        }
        if (isStartBreakoutPayload(data)) {
          setBreakoutStarted(true);
        }
      },
      [localSessionId, daily]
    ),
  });

  const lobbyHref = `/lobby?role=${role}`;

  return (
    <div className="relative flex flex-1 flex-col gap-6">
      <SessionTimer />
      <h1 className="section-heading text-xl font-bold uppercase tracking-tight text-[var(--foreground)]">
        {cohortLabel}: Class Session
      </h1>

      {breakoutStarted && (
        <div className="rounded-lg border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-4 py-2 text-sm text-[var(--accent)]">
          Breakout started
        </div>
      )}

      <div className="min-h-[320px] rounded-lg border-2 border-[var(--input-border)] bg-[var(--input-bg)] p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {participantIds.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-[var(--muted)]">
              Waiting for participants…
            </p>
          ) : (
            participantIds.map((sessionId) => (
              <div
                key={sessionId}
                className="flex flex-col overflow-hidden rounded-lg bg-[var(--hover-bg)]"
              >
                <DailyVideo
                  sessionId={sessionId}
                  type="video"
                  fit="contain"
                  className="aspect-video w-full object-contain"
                />
                <span className="truncate px-2 py-1 text-xs text-[var(--label)]">
                  {sessionId === localSessionId ? "You" : sessionId}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <Link
        href={lobbyHref}
        className="cta-link inline-flex w-fit items-center justify-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
      >
        Return to Main Lobby
      </Link>
    </div>
  );
}
