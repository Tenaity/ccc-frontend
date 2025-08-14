import React from "react";
import Badge from "../Badge";
import type { ShiftCode, Staff, Position } from "../../types";
import { fmtYMD, getDow, isWeekend } from "../../utils/date";

const tdCenter = { borderTop: "1px solid #f0f0f0", padding: "6px 8px", textAlign: "center" as const, whiteSpace: "nowrap" as const };
const tdWeekend = { background: "#FFFDF0" };
const tdStickyLeft = { ...tdCenter, position: "sticky" as const, left: 0, zIndex: 1, background: "#fff", textAlign: "left" as const };
type Cell = { code: ShiftCode; position: Position | null };

export default function MatrixRow({
    staff, index, year, month, days,
    assignmentIndex, summariesByStaffId
}: {
    staff: Staff; index: number; year: number; month: number; days: number[];
    assignmentIndex: Map<string, Cell>;
    summariesByStaffId: Map<number, { counts: Record<string, number>, credit: number, dayCount: number, nightCount: number }>;
}) {
    const sum = summariesByStaffId.get(staff.id) || { counts: {}, credit: 0, dayCount: 0, nightCount: 0 };

    return (
        <tr style={{ background: index % 2 ? "#fff" : "#fbfbfd" }}>
            <td className="sticky-col" style={tdStickyLeft}>
                <div style={{ fontWeight: 600 }}>{staff.full_name}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{staff.role} {staff.can_night ? "" : "· không đêm"}</div>
            </td>

            {days.map(d => {
                const dateKey = fmtYMD(year, month, d);
                const cell = assignmentIndex.get(`${staff.id}|${dateKey}`);
                const code = cell?.code ?? "";
                const pos = cell?.position ?? null;
                const wk = isWeekend(getDow(year, month, d));

                const isLeaderDay = code === "K" && pos === "TD";
                const isLeaderNight = code === "Đ" && pos === "TD" && staff.role === "TC";

                return (
                    <td key={d} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>
                        <Badge
                            code={code}
                            crown={isLeaderDay || isLeaderNight}
                            variant={
                                pos === "K_WHITE" ? "k-white" :
                                    pos === "PGD" ? "pgd" :
                                        isLeaderDay ? "leader-day" :
                                            isLeaderNight ? "leader-night" : "td"
                            }
                        />
                    </td>
                );
            })}

            <td style={tdCenter}>{sum.counts?.CA1 || 0}</td>
            <td style={tdCenter}>{sum.counts?.CA2 || 0}</td>
            <td style={tdCenter}>{sum.counts?.K || 0}</td>
            <td style={tdCenter}>{sum.counts?.HC || 0}</td>
            <td style={tdCenter}>{sum.counts?.Đ || 0}</td>
            <td style={tdCenter}>{sum.counts?.P || 0}</td>
            <td style={tdCenter}>{sum.dayCount}</td>
            <td style={tdCenter}>{sum.nightCount}</td>
            <td style={{ ...tdCenter, fontWeight: 700, background: "#f9fafb" }}>{sum.credit}</td>
        </tr>
    );
}
