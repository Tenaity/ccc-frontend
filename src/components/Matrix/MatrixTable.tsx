import React from "react";
import MatrixHeader from "./MatrixHeader";
import MatrixRow from "./MatrixRow";
import TotalsRows from "./TotalsRows";
import type { Staff } from "../../types";

const tableWrap = { overflow: "auto", border: "1px solid #eee", borderRadius: 8 };
const tableCss = { borderCollapse: "separate" as const, borderSpacing: 0, minWidth: 1000 };

export default function MatrixTable({
    year, month, days, staff,
    assignmentIndex, summariesByStaffId,
    perDayCounts, perDayLeaders, perDayDayNight,
}: {
    year: number; month: number; days: number[];
    staff: Staff[];
    assignmentIndex: Map<string, { code: any; position: any }>;
    summariesByStaffId: Map<number, { counts: Record<string, number>, credit: number, dayCount: number, nightCount: number }>;
    perDayCounts: Record<number, Record<string, number>>;
    perDayLeaders: Record<number, number>;
    perDayDayNight: Record<number, { dayCount: number; nightCount: number }>;
}) {
    return (
        <div style={tableWrap}>
            <table style={tableCss}>
                <MatrixHeader year={year} month={month} days={days} perDayLeaders={perDayLeaders} />
                <tbody>
                    {staff.map((s, idx) => (
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
                        year={year} month={month} days={days}
                        perDayCounts={perDayCounts}
                        perDayLeaders={perDayLeaders}
                        perDayDayNight={perDayDayNight}
                    />
                </tbody>
            </table>
        </div>
    );
}
