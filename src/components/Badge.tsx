import React from "react";
import { pickBg } from "../utils/schedule";
import type { ShiftCode } from "../types";

type Variant = "td" | "pgd" | "k-white" | "leader-day" | "leader-night";

export default function Badge({
    code, variant = "td", crown = false
}: { code?: ShiftCode | ""; variant?: Variant; crown?: boolean }) {
    if (!code) return <span style={{ color: "#aaa" }}>—</span>;

    const base: React.CSSProperties = {
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "2px 6px", borderRadius: 6, border: "1px solid #e5e7eb",
        fontSize: 12, background: pickBg(code), fontWeight: 500,
    };
    if (variant === "pgd") { base.background = "#F7D1D1"; base.border = "1px solid #e06b6b"; }
    if (variant === "k-white") { base.background = "#FFFFFF"; base.border = "1.5px dashed #999"; }
    if (variant === "leader-day") { base.border = "1.5px solid #16a34a"; base.boxShadow = "0 0 0 1px rgba(22,163,74,.12) inset"; }
    if (variant === "leader-night") { base.border = "1.5px solid #7c3aed"; base.boxShadow = "0 0 0 1px rgba(124,58,237,.12) inset"; }

    return <span style={base}>{code}{crown ? <span title="Trưởng ca">{" "}👑</span> : null}</span>;
}
