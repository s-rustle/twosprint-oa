"use client";

import { useAppMessage } from "@daily-co/daily-react";
import {
  useParticipantIds,
  useParticipantProperty,
} from "@daily-co/daily-react";
import {
  createMutePayload,
  createStartBreakoutPayload,
} from "@/lib/daily-app-messages";

/**
 * Instructor-only control panel: participant list by display name,
 * mute button per participant, Begin breakout rooms button.
 * Daily: useAppMessage sends payloads (mute targets sessionId; start-breakout broadcast).
 * Rendered only when role=instructor (see CohortRoomContent). Must be inside DailyProvider.
 */
export function ControlPanel() {
  const sendAppMessage = useAppMessage();
  const participantIds = useParticipantIds({
    filter: "remote",
    sort: "user_name",
  });

  const handleMute = (sessionId: string) => {
    sendAppMessage(createMutePayload(sessionId), sessionId);
  };

  const handleStartBreakout = () => {
    sendAppMessage(createStartBreakoutPayload());
  };

  return (
    <div className="rounded-lg border-2 border-[var(--input-border)] bg-[var(--input-bg)] p-4">
      <h2 className="section-heading mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--highlight)]">
        Control Panel
      </h2>
      <div className="mb-4 space-y-2">
        {participantIds.length === 0 ? (
          <p className="text-xs text-[var(--muted)]">No other participants yet.</p>
        ) : (
          participantIds.map((sessionId) => (
            <ParticipantRow
              key={sessionId}
              sessionId={sessionId}
              onMute={() => handleMute(sessionId)}
            />
          ))
        )}
      </div>
      <button
        type="button"
        onClick={handleStartBreakout}
        className="w-full rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
      >
        Begin breakout rooms
      </button>
    </div>
  );
}

function ParticipantRow({
  sessionId,
  onMute,
}: {
  sessionId: string;
  onMute: () => void;
}) {
  const userName = useParticipantProperty(sessionId, "user_name");
  const displayName =
    typeof userName === "string" && userName.trim()
      ? userName.trim()
      : sessionId;

  return (
    <div className="flex items-center justify-between gap-2 rounded bg-[var(--hover-bg)] px-3 py-2">
      <span className="truncate text-sm text-[var(--label)]">{displayName}</span>
      <button
        type="button"
        onClick={onMute}
        className="shrink-0 rounded border border-[var(--input-border)] bg-[var(--input-bg)] px-2 py-1 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--hover-bg)] hover:border-[var(--highlight)]"
      >
        Mute
      </button>
    </div>
  );
}
