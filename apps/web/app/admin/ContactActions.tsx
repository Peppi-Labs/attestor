"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ContactActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const set = async (next: string) => {
    setBusy(true);
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  };

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {status !== "READ" && (
        <button className="btn-mini" disabled={busy} onClick={() => set("READ")}>
          Mark read
        </button>
      )}
      {status !== "ARCHIVED" && (
        <button className="btn-mini" disabled={busy} onClick={() => set("ARCHIVED")}>
          Archive
        </button>
      )}
      {status === "ARCHIVED" && (
        <button className="btn-mini" disabled={busy} onClick={() => set("NEW")}>
          Restore
        </button>
      )}
    </div>
  );
}
