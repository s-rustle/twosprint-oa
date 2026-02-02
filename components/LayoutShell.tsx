"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Header, type Role } from "./Header";

/**
 * Wraps app content with Header (role from URL) and footer.
 * Role is read from searchParams (role=student|instructor); default student.
 * T019: Role is persisted via URL so /lobby?role=… and /cohort/[id]?role=… preserve it;
 * toggling Students/Instructors updates the URL and keeps role consistent on back-navigation.
 */
export function LayoutShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleParam = searchParams.get("role");
  const role: Role =
    roleParam === "instructor" ? "instructor" : "student";

  const onRoleChange = (newRole: Role) => {
    const path = typeof window !== "undefined" ? window.location.pathname : "/lobby";
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", newRole);
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header role={role} onRoleChange={onRoleChange} />
      <main className="flex-1">{children}</main>
      <footer className="border-t px-6 py-3 text-center text-sm" style={{ borderColor: "var(--border-subtle)" }}>
        <span className="text-[var(--muted)]">Powered by </span>
        <span className="text-[var(--highlight)] font-medium">the Overclock Accelerator</span>
      </footer>
    </div>
  );
}
