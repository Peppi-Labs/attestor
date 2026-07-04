"use client";

import { useRouter } from "next/navigation";

export function OrgSwitcher({
  orgs,
  currentId,
}: {
  orgs: { id: string; name: string; role: string }[];
  currentId: string;
}) {
  const router = useRouter();
  if (orgs.length <= 1) {
    return <span className="org-name">{orgs[0]?.name}</span>;
  }
  return (
    <select
      className="org-select"
      value={currentId}
      onChange={async (e) => {
        await fetch("/api/orgs/switch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orgId: e.target.value }),
        });
        router.refresh();
      }}
    >
      {orgs.map((o) => (
        <option key={o.id} value={o.id}>{o.name}</option>
      ))}
    </select>
  );
}
