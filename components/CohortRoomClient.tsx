"use client";

import { Component, useCallback, useEffect, useState } from "react";
import {
  DailyProvider,
  useDaily,
  useDailyEvent,
  useMeetingState,
  useDailyError,
} from "@daily-co/daily-react";
import { ClassView } from "./ClassView";
import { ControlPanel } from "./ControlPanel";
import { VideoError } from "./VideoError";
import { OVERCAST_USER_NAME_KEY } from "./WelcomeScreen";
import type { Role } from "./Header";
import { coerceErrorToMessage } from "@/lib/coerce-error";

function getStoredUserName(): string {
  if (typeof window === "undefined") return "Guest";
  return sessionStorage.getItem(OVERCAST_USER_NAME_KEY)?.trim() || "Guest";
}

/** Coerce Daily error event or useDailyError object to a display string. Avoids [object Object] in UI. */
export function dailyErrorToMessage(ev: unknown): string {
  const msg = coerceErrorToMessage(ev);
  return msg === "Something went wrong. Please try again." ? "Connection failed. Please try again." : msg;
}

/** Catches thrown errors (e.g. from Daily) and shows VideoError with a readable message instead of [object Object]. */
class CohortRoomErrorBoundary extends Component<
  { children: React.ReactNode; role: Role },
  { message: string | null }
> {
  state = { message: null as string | null };

  static getDerivedStateFromError(error: unknown) {
    return { message: dailyErrorToMessage(error) };
  }

  render() {
    if (this.state.message) {
      return (
        <VideoError
          message={this.state.message}
          role={this.props.role}
          onRetry={() => this.setState({ message: null })}
        />
      );
    }
    return this.props.children;
  }
}

/**
 * Inner content: joins Daily call, handles errors, shows ClassView or VideoError.
 * Must be inside DailyProvider.
 * Daily: join on mount / leave on unmount; connection errors trigger auto-reconnect
 * and VideoError (Retry + Return to Lobby). Role gates ControlPanel (instructor only).
 */
function CohortRoomContent({
  cohortId,
  cohortLabel,
  role,
  roomUrl,
}: {
  cohortId: number;
  cohortLabel: string;
  role: Role;
  roomUrl: string;
}) {
  const daily = useDaily();
  const meetingState = useMeetingState();
  const { meetingError, nonFatalError } = useDailyError();
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const leave = useCallback(() => {
    if (daily && !daily.isDestroyed()) {
      daily.leave();
    }
    setConnectionError(null);
  }, [daily]);

  const join = useCallback(() => {
    if (!daily || daily.isDestroyed()) return;
    setConnectionError(null);
    daily.join({ url: roomUrl, userName: getStoredUserName() });
  }, [daily, roomUrl]);

  // Join on mount; leave on unmount (use name from welcome screen if set)
  useEffect(() => {
    if (!daily || daily.isDestroyed()) return;
    daily.join({ url: roomUrl, userName: getStoredUserName() });
    return () => {
      if (!daily.isDestroyed()) daily.leave();
    };
  }, [daily, roomUrl]);

  // Listen for fatal/connection errors (FR-011). Always set a string to avoid [object Object].
  useDailyEvent(
    "error",
    useCallback((ev: unknown) => {
      setConnectionError(dailyErrorToMessage(ev) || "Connection failed. Reconnecting…");
    }, [])
  );

  // Auto-reconnect in background (spec: show error + auto-reconnect + Retry button)
  useEffect(() => {
    if (!connectionError || !daily || daily.isDestroyed()) return;
    const t = setTimeout(() => {
      daily.leave().then(() => {
        daily.join({ url: roomUrl, userName: getStoredUserName() });
        setConnectionError(null);
      });
    }, 3000);
    return () => clearTimeout(t);
  }, [connectionError, daily, roomUrl]);

  const fatalError = meetingError ?? nonFatalError;
  const errMsg = fatalError ? dailyErrorToMessage(fatalError) : null;
  const errorMessage = connectionError ?? errMsg;

  // When Daily says the room doesn't exist, show a hint so users create rooms in the dashboard
  const roomNotFoundHint =
    errorMessage && /does not exist|not exist|room not found/i.test(errorMessage)
      ? " Create the room at dashboard.daily.co and use its exact URL in .env.local (NEXT_PUBLIC_DAILY_ROOM_1 … _6), then restart the dev server."
      : "";

  if (errorMessage) {
    return (
      <VideoError
        message={errorMessage + roomNotFoundHint}
        onRetry={() => {
          leave();
          setTimeout(join, 100);
        }}
        role={role}
      />
    );
  }

  if (meetingState === "joined-meeting") {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <ClassView cohortId={cohortId} cohortLabel={cohortLabel} role={role} />
        {role === "instructor" && <ControlPanel />}
      </div>
    );
  }

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 p-8">
      <p className="text-sm text-white/70">
        {meetingState === "joining-meeting"
          ? "Joining…"
          : "Connecting…"}
      </p>
    </div>
  );
}

/**
 * Client wrapper: DailyProvider + CohortRoomContent.
 * Handles join/leave and error state for the cohort class view.
 */
export function CohortRoomClient({
  roomUrl,
  cohortId,
  cohortLabel,
  role,
}: {
  roomUrl: string;
  cohortId: number;
  cohortLabel: string;
  role: Role;
}) {
  return (
    <CohortRoomErrorBoundary role={role}>
      <DailyProvider url={roomUrl}>
        <CohortRoomContent
          roomUrl={roomUrl}
          cohortId={cohortId}
          cohortLabel={cohortLabel}
          role={role}
        />
      </DailyProvider>
    </CohortRoomErrorBoundary>
  );
}
