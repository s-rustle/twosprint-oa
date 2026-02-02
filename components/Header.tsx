"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "overcast-theme"; // contracts/theme-storage.md
type Theme = "light" | "dark";

/**
 * Overcast header: logo, theme toggle (002-dark-mode-toggle), Students/Instructors toggle.
 * Theme: default dark per spec clarification; persisted in localStorage; inline script in layout sets data-theme before paint to avoid FOUC.
 * Role is passed from LayoutShell (read from URL); onRoleChange navigates to current path with ?role=…
 * so role persists across lobby and cohort pages (US3).
 */
export type Role = "student" | "instructor";

interface HeaderProps {
  role: Role;
  onRoleChange?: (role: Role) => void;
}

function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const t = document.documentElement.getAttribute("data-theme");
  return t === "light" ? "light" : "dark";
}

export function Header({ role, onRoleChange }: HeaderProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  // Keep DOM in sync with theme state (React may not render data-theme on html, so we set it here).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // best-effort per spec
    }
    setTheme(next);
  };

  const themeLabel =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <header className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--border-subtle)' }}>
      <span className="text-lg font-bold tracking-tight text-[var(--highlight)]">
        Overcast
      </span>
      <nav className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={themeLabel}
          title={themeLabel}
          className="theme-toggle rounded p-1.5 text-[var(--foreground)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
        >
          {theme === "dark" ? (
            <span aria-hidden>☀️</span>
          ) : (
            <span aria-hidden>🌙</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => onRoleChange?.("student")}
          className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
            role === "student"
              ? "bg-[var(--highlight)] text-black"
              : ""
          }`}
          style={role !== "student" ? { color: 'var(--nav-inactive)' } : undefined}
          onMouseEnter={(e) => { if (role !== "student") e.currentTarget.style.color = 'var(--foreground)'; }}
          onMouseLeave={(e) => { if (role !== "student") e.currentTarget.style.color = 'var(--nav-inactive)'; }}
        >
          Students
        </button>
        <button
          type="button"
          onClick={() => onRoleChange?.("instructor")}
          className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
            role === "instructor"
              ? "bg-[var(--highlight)] text-black"
              : ""
          }`}
          style={role !== "instructor" ? { color: 'var(--nav-inactive)' } : undefined}
          onMouseEnter={(e) => { if (role !== "instructor") e.currentTarget.style.color = 'var(--foreground)'; }}
          onMouseLeave={(e) => { if (role !== "instructor") e.currentTarget.style.color = 'var(--nav-inactive)'; }}
        >
          Instructors
        </button>
      </nav>
    </header>
  );
}
