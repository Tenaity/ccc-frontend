// src/components/schedule/MatrixRow.tsx
import React from "react";
import type { Staff, Assignment } from "../../types";
import { fmtYMD, getDow, isWeekend } from "../../utils/date";
import Badge from "../Badge";
import { isNightLeader, isDayLeader, isNightTD, isNightPGD } from "../../utils/schedule";

const tdCenter = { borderTop: "1px solid #f0f0f0", padding: "6px 8px", textAlign: "center" as const, whiteSpace: "nowrap" as const };
const tdWeekend = { background: "#FFFDF0" };
const tdStickyLeft = { ...tdCenter, position: "sticky" as const, left: 0, zIndex: 1, background: "#fff", textAlign: "left" as const };

// Parse tiện lợi từ notes: "[CODE:1978][RANK:1]"
function parseMeta(notes?: string | null) {
    if (!notes) return { code: null as string | null, rank: null as 1 | 2 | null };
    const code = notes.match(/\[CODE:(\d+)\]/)?.[1] ?? null;
    const rankStr = notes.match(/\[RANK:(1|2)\]/)?.[1] ?? null;
    const rank = (rankStr === "1" || rankStr === "2") ? (Number(rankStr) as 1 | 2) : null;
    return { code, rank };
}

export default function MatrixRow({
    staff, index, year, month, days,
    assignmentIndex, summariesByStaffId,
    fixedByDayStaff, offByDayStaff,
}: {
    staff: Staff;
    index: number;
    year: number;
    month: number;
    days: number[];
    assignmentIndex: Map<string, { code: Assignment["shift_code"]; position: Assignment["position"] | null }>;
    summariesByStaffId: Map<number, { counts: Record<string, number>, credit: number, dayCount: number, nightCount: number }>;
    fixedByDayStaff: Map<string, boolean>;
    offByDayStaff: Map<string, boolean>;
}) {
    const sum = summariesByStaffId.get(staff.id) || { counts: {}, credit: 0, dayCount: 0, nightCount: 0 };
    const meta = parseMeta(staff.notes);
    const displayId = meta.code ?? String(staff.id);
    console.log("meta", meta.code);

    // chip nhỏ hiển thị rank
    const RankChip = meta.rank ? (
        <span
            title={`Rank ${meta.rank === 1 ? "Pro" : "Amateur"}`}
            style={{
                marginLeft: 6,
                fontSize: 11,
                padding: "1px 6px",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                background: meta.rank === 1 ? "#E8F9F0" : "#FFF4E5",
                color: meta.rank === 1 ? "#0f766e" : "#b45309",
                fontWeight: 600,
            }}
        >
            R{meta.rank}
        </span>
    ) : null;

    return (
        <tr style={{ background: index % 2 ? "#fff" : "#fbfbfd" }}>
            <td className="sticky-col" style={tdStickyLeft}>
                <div style={{ fontWeight: 600 }}>{staff.full_name}</div>
                <div style={{ fontSize: 12, color: "#666", display: "flex", alignItems: "center" }}>
                    {staff.role}
                    <span style={{ color: "#999", marginLeft: 6 }}>#{displayId}</span>
                    {RankChip}
                </div>
            </td>

            {days.map((d) => {
                const dateKey = fmtYMD(year, month, d);
                const cell = assignmentIndex.get(`${staff.id}|${dateKey}`);
                const code = (cell?.code ?? "") as Assignment["shift_code"] | "";
                const pos = (cell?.position ?? null) as Assignment["position"] | null;

                const wk = isWeekend(getDow(year, month, d));

                const marker = { shift_code: code, position: pos, role: staff.role };
                const leaderDay = isDayLeader(marker);     // K @ TD
                const leaderNight = isNightLeader(marker); // Đ @ TD && role=TC
                const tdNight = isNightTD(marker);         // Đ @ TD (non‑leader)
                const pgdNight = isNightPGD(marker);       // Đ @ PGD

                const variant =
                    leaderDay ? "leader-day" :
                        leaderNight ? "leader-night" :
                            tdNight ? "night-white" :
                                pgdNight ? "night-pgd" :
                                    pos === "PGD" ? "pgd" : "td";

                const key = `${staff.id}|${dateKey}`;
                const isFixed = fixedByDayStaff.has(key);
                const isOff = offByDayStaff.has(key);
                return (
                    <td key={d} style={{ ...tdCenter, ...(wk ? tdWeekend : null), position: "relative" }}>
                        {isOff ? <span style={{ position: "absolute", top: 2, right: 2 }}>🚫</span> : null}
                        <Badge code={code || ""} crown={leaderDay || leaderNight} variant={variant} pinned={isFixed} />
                    </td>
                );
            })}

            <td style={tdCenter}>{sum.counts["CA1"] || 0}</td>
            <td style={tdCenter}>{sum.counts["CA2"] || 0}</td>
            <td style={tdCenter}>{sum.counts["K"] || 0}</td>
            <td style={tdCenter}>{sum.counts["HC"] || 0}</td>
            <td style={tdCenter}>{sum.counts["Đ"] || 0}</td>
            <td style={tdCenter}>{sum.counts["P"] || 0}</td>
            <td style={tdCenter}>{sum.dayCount || 0}</td>
            <td style={tdCenter}>{sum.nightCount || 0}</td>
            <td style={{ ...tdCenter, fontWeight: 700, background: "#f9fafb" }}>{sum.credit || 0}</td>
        </tr>
    );
}