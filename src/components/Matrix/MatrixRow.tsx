// src/components/schedule/MatrixRow.tsx
import React from "react";
import type { Staff, Assignment } from "../../types";
import { fmtYMD, getDow, isWeekend } from "../../utils/date";
import Badge from "../Badge";
// Nếu utils/schedule còn dùng – OK, nhưng không cần night-white/night-pgd nữa
import { isNightLeader, isDayLeader, isNightTD, isNightPGD } from "../../utils/schedule";

const tdCenter = { borderTop: "1px solid #f0f0f0", padding: "6px 8px", textAlign: "center" as const, whiteSpace: "nowrap" as const };
const tdWeekend = { background: "#FFFDF0" };
const tdStickyLeft = { ...tdCenter, position: "sticky" as const, left: 0, zIndex: 1, background: "#fff", textAlign: "left" as const };

export default function MatrixRow({
    staff, index, year, month, days,
    assignmentIndex, summariesByStaffId,
}: {
    staff: Staff;
    index: number;
    year: number;
    month: number;
    days: number[];
    assignmentIndex: Map<string, { code: Assignment["shift_code"]; position: Assignment["position"] | null }>;
    summariesByStaffId: Map<number, { counts: Record<string, number>, credit: number, dayCount: number, nightCount: number }>;
}) {
    const sum = summariesByStaffId.get(staff.id) || { counts: {}, credit: 0, dayCount: 0, nightCount: 0 };

    return (
        <tr style={{ background: index % 2 ? "#fff" : "#fbfbfd" }}>
            <td className="sticky-col" style={tdStickyLeft}>
                <div style={{ fontWeight: 600 }}>{staff.full_name}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                    {staff.role} <span style={{ color: "#999" }}>#{staff.id}</span>
                </div>
            </td>

            {days.map((d) => {
                const dateKey = fmtYMD(year, month, d);
                const cell = assignmentIndex.get(`${staff.id}|${dateKey}`);
                const code = (cell?.code ?? "") as Assignment["shift_code"] | "";
                const pos = (cell?.position ?? null) as Assignment["position"] | null;

                const dow = getDow(year, month, d);
                const wk = isWeekend(dow);

                // Tạo object cho helper
                const marker = { shift_code: code, position: pos, role: staff.role };

                // Leader flags
                const leaderDay = isDayLeader(marker);   // K @ TD (trưởng ca ngày)
                const leaderNight = isNightLeader(marker); // Đ @ TD && role=TC (trưởng ca đêm)
                const tdNight = isNightTD(marker);
                const pgdNight = isNightPGD(marker);

                // Map về các variant sẵn có trong <Badge />
                const variant =
                    leaderDay ? "leader-day" :
                        leaderNight ? "leader-night" : tdNight ? "night-white" : pgdNight ?
                            "night-pgd" :
                            code === "K" && pos === "TD" ? "k-white" :
                                code === "Đ" &&
                                    pos === "PGD" ? "pgd" :
                                    "td"; // còn lại: TD ngày hoặc Đ@TD non-leader

                return (
                    <td key={d} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>
                        <Badge
                            code={code || ""}
                            crown={leaderDay || leaderNight}
                            variant={variant}
                        />
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