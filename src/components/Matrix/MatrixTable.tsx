// src/components/schedule/MatrixTable.tsx
import React from "react";
import MatrixHeader from "./MatrixHeader";
import MatrixRow from "./MatrixRow";
import TotalsRows from "./TotalsRows";
import type { Staff, Assignment, ExpectedPerDay, DayPlaceSummary } from "../../types";

const tableWrap = { overflow: "auto", border: "1px solid #eee", borderRadius: 8 };
const tableCss = { borderCollapse: "separate" as const, borderSpacing: 0, minWidth: 1000 };

export default function MatrixTable({
    year, month, days, staff,
    assignmentIndex, summariesByStaffId,
    perDayLeaders,
    perDayByPlace, expectedByDay,
    fixedByDayStaff,
    offByDayStaff,
}: {
    year: number; month: number; days: number[]; staff: Staff[];
    assignmentIndex: Map<string, { code: Assignment["shift_code"]; position: Assignment["position"] | null }>;
    summariesByStaffId: Map<number, { counts: Record<string, number>, credit: number, dayCount: number, nightCount: number }>;
    perDayLeaders: Record<number, number>;
    perDayByPlace: Record<number, DayPlaceSummary>;
    expectedByDay: Record<number, ExpectedPerDay>;
    fixedByDayStaff: Map<string, boolean>;
    offByDayStaff: Map<string, boolean>;
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
                            fixedByDayStaff={fixedByDayStaff}
                            offByDayStaff={offByDayStaff}
                        />
                    ))}
                    <TotalsRows
                        year={year}
                        month={month}
                        days={days}
                        perDayByPlace={perDayByPlace}
                        expectedByDay={expectedByDay}
                    />
                </tbody>
            </table>
        </div>
    );
}