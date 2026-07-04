"use client";

import { useRouter } from "next/navigation";

export function AppLogout() {
  const router = useRouter();
  return (
    <button
      className="btn-mini"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
