"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Role } from "./Header";

export const OVERCAST_USER_NAME_KEY = "overcastUserName";

/**
 * First screen when opening the app: asks for display name and role,
 * then stores them and navigates to the main lobby.
 */
export function WelcomeScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = name.trim() || "Guest";
    if (typeof window !== "undefined") {
      sessionStorage.setItem(OVERCAST_USER_NAME_KEY, displayName);
    }
    router.push(`/lobby?role=${role}`);
  };

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold uppercase tracking-tight text-[var(--foreground)]">
        Welcome to Overcast
      </h1>
      <p className="mb-8 text-sm" style={{ color: "var(--muted)" }}>
        Enter your name and role to join the lobby.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium" style={{ color: "var(--label)" }}>
            Your name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            className="rounded-lg border px-4 py-2.5 text-[var(--foreground)] focus:border-[var(--highlight)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight)]"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--input-border)",
            }}
            autoComplete="name"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium" style={{ color: "var(--label)" }}>
            I am a
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={
                role === "student"
                  ? "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium bg-[var(--highlight)] text-black transition-opacity hover:opacity-90"
                  : "btn-inactive flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
              }
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("instructor")}
              className={
                role === "instructor"
                  ? "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium bg-[var(--highlight)] text-black transition-opacity hover:opacity-90"
                  : "btn-inactive flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
              }
            >
              Instructor
            </button>
          </div>
        </label>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-[var(--highlight)] px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          Enter Lobby
        </button>
      </form>
    </main>
  );
}
