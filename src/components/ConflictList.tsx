import React from "react";

export default function ConflictList({ conflicts }: { conflicts: any[] }) {
  if (!conflicts || conflicts.length === 0) return null;
  return (
    <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", padding: 12, marginBottom: 12, borderRadius: 8 }}>
      <strong>Conflicts:</strong>
      <ul style={{ margin: "8px 0 0 16px" }}>
        {conflicts.map((c, idx) => (
          <li key={idx} style={{ marginBottom: 4 }}>
            {c.day}: {c.type}
          </li>
        ))}
      </ul>
    </div>
  );
}
