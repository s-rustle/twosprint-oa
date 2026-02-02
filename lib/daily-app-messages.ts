/**
 * Types and helpers for Daily app messages (instructor → participants).
 * See specs/001-overcast-video-classroom/contracts/app-messages.md.
 */

export type AppMessageMute = {
  type: "mute";
  sessionId: string;
};

export type AppMessageStartBreakout = {
  type: "start-breakout";
};

export type AppMessagePayload = AppMessageMute | AppMessageStartBreakout;

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

export function isMutePayload(
  data: unknown
): data is AppMessageMute {
  return (
    isObject(data) &&
    data.type === "mute" &&
    typeof data.sessionId === "string"
  );
}

export function isStartBreakoutPayload(
  data: unknown
): data is AppMessageStartBreakout {
  return isObject(data) && data.type === "start-breakout";
}

export function createMutePayload(sessionId: string): AppMessageMute {
  return { type: "mute", sessionId };
}

export function createStartBreakoutPayload(): AppMessageStartBreakout {
  return { type: "start-breakout" };
}
