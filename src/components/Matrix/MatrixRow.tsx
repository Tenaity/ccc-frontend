// src/components/schedule/MatrixRow.tsx
import React from "react";
import type { Staff, Assignment } from "../../types";
import { fmtYMD, getDow, isWeekend } from "../../utils/date";
import Badge from "../Badge";
import { isNightLeader, isDayLeader, isNightTD, isNightPGD } from "../../utils/schedule";
import { cn } from "../../lib/utils";

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
    onEditCell,
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
    onEditCell?: (staff: Staff, day: number) => void;
}) {
    const sum = summariesByStaffId.get(staff.id) || { counts: {}, credit: 0, dayCount: 0, nightCount: 0 };
    const meta = parseMeta(staff.notes);
    const displayId = meta.code ?? String(staff.id);

    // chip nhỏ hiển thị rank
    const RankChip = meta.rank ? (
        <span
            title={`Rank ${meta.rank === 1 ? "Pro" : "Amateur"}`}
            className={cn(
                "ml-1 px-1 text-[11px] rounded-full border font-semibold",
                meta.rank === 1
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
            )}
        >
            R{meta.rank}
        </span>
    ) : null;

    return (
        <tr className="odd:bg-gray-50">
            <td className="sticky left-0 z-10 bg-white border-t border-gray-200 p-1.5 text-left whitespace-nowrap shadow-[inset_-1px_0_0_theme(colors.gray.200)]">
                <div className="font-semibold">{staff.full_name}</div>
                <div className="text-xs text-gray-600 flex items-center">
                    {staff.role}
                    <span className="ml-1 text-gray-500">#{displayId}</span>
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
                    <td
                        key={d}
                        className={cn(
                            "relative border-t border-gray-200 p-1.5 text-center whitespace-nowrap",
                            wk && "bg-amber-50",
                            !isFixed && !isOff && onEditCell && "cursor-pointer"
                        )}
                        title={meta.rank ? `Rank ${meta.rank}` : undefined}
                        onClick={() => {
                            if (!isFixed && !isOff && onEditCell) onEditCell(staff, d);
                        }}
                    >
                        {isOff ? <span className="absolute top-0.5 right-0.5">🚫</span> : null}
                        <Badge code={code || ""} crown={leaderDay || leaderNight} variant={variant} pinned={isFixed} rank={meta.rank || undefined} />
                    </td>
                );
            })}

            <td className="border-t border-gray-200 p-1.5 text-center whitespace-nowrap">{sum.counts["CA1"] || 0}</td>
            <td className="border-t border-gray-200 p-1.5 text-center whitespace-nowrap">{sum.counts["CA2"] || 0}</td>
            <td className="border-t border-gray-200 p-1.5 text-center whitespace-nowrap">{sum.counts["K"] || 0}</td>
            <td className="border-t border-gray-200 p-1.5 text-center whitespace-nowrap">{sum.counts["HC"] || 0}</td>
            <td className="border-t border-gray-200 p-1.5 text-center whitespace-nowrap">{sum.counts["Đ"] || 0}</td>
            <td className="border-t border-gray-200 p-1.5 text-center whitespace-nowrap">{sum.counts["P"] || 0}</td>
            <td className="border-t border-gray-200 p-1.5 text-center whitespace-nowrap">{sum.dayCount || 0}</td>
            <td className="border-t border-gray-200 p-1.5 text-center whitespace-nowrap">{sum.nightCount || 0}</td>
            <td className="border-t border-gray-200 p-1.5 text-center font-bold whitespace-nowrap bg-gray-50">{sum.credit || 0}</td>
        </tr>
    );
}