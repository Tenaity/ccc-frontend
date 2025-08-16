// src/components/schedule/MatrixTable.tsx
import React from "react";
import MatrixHeader from "./MatrixHeader";
import MatrixRow from "./MatrixRow";
import TotalsRows, { DayPlaceSummary } from "./TotalsRows";
import type { Staff, Assignment } from "../../types";

const tableWrap = { overflow: "auto", border: "1px solid #eee", borderRadius: 8 };
const tableCss = { borderCollapse: "separate" as const, borderSpacing: 0, minWidth: 1000 };

export default function MatrixTable({
    year, month, days, staff,
    assignmentIndex, summariesByStaffId,
    perDayCounts, perDayLeaders, perDayDayNight,
    perDayByPlace,
}: {
    year: number; month: number; days: number[];
    staff: Staff[];
    assignmentIndex: Map<string, { code: Assignment["shift_code"]; position: Assignment["position"] | null }>;
    summariesByStaffId: Map<number, { counts: Record<string, number>, credit: number, dayCount: number, nightCount: number }>;
    perDayCounts: Record<number, Record<string, number>>;
    perDayLeaders: Record<number, number>;
    perDayDayNight: Record<number, { dayCount: number; nightCount: number }>;
    perDayByPlace: Record<number, DayPlaceSummary>;
}) {
    return (
        <div style={tableWrap}>
            <table style={tableCss}>
                <MatrixHeader year={year} month={month} days={days} perDayLeaders={perDayLeaders} />
                <tbody>
                    {(staff ?? []).map((s, idx) => (
                        <MatrixRow
                            key={s.id}
                            staff={s}
                            index={idx}
                            year={year} month={month} days={days}
                            assignmentIndex={assignmentIndex}
                            summariesByStaffId={summariesByStaffId}
                        />
                    ))}
                    <TotalsRows
                        year={year}
                        month={month}
                        days={days}
                        perDayCounts={perDayCounts}
                        perDayDayNight={perDayDayNight}
                        perDayLeaders={perDayLeaders}
                        perDayByPlace={perDayByPlace}  // ✅ type khớp với TotalsRows
                    />
                </tbody>
            </table>
        </div>
    );
}