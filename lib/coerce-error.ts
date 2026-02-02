/**
 * Coerce any thrown value to a readable string for UI and error boundaries.
 * Prevents "[object Object]" when Next.js or React receive plain error objects.
 */
export function coerceErrorToMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error != null && typeof error === "object") {
    const o = error as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
    if (typeof o.errorMsg === "string") return o.errorMsg;
    if (typeof o.msg === "string") return o.msg;
    if (o.error && typeof o.error === "object" && typeof (o.error as Record<string, unknown>).msg === "string")
      return (o.error as Record<string, unknown>).msg as string;
    try {
      const s = JSON.stringify(o, null, 0);
      if (s !== "{}") return s;
    } catch {
      // ignore
    }
  }
  return "Something went wrong. Please try again.";
}
