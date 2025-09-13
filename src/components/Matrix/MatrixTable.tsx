// src/components/schedule/MatrixTable.tsx
import React from "react";
import MatrixHeader from "./MatrixHeader";
import MatrixRow from "./MatrixRow";
import TotalsRows from "./TotalsRows";
import QuickEditDialog from "../QuickEditDialog";
import { fmtYMD } from "../../utils/date";
import type { Staff, Assignment, ExpectedPerDay, DayPlaceSummary } from "../../types";

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
    const [edit, setEdit] = React.useState<{ staff: Staff; day: number } | null>(null);
    const candidates = React.useMemo(() => {
        if (!edit) return [] as Staff[];
        return (staff ?? []).filter((s) => s.role === edit.staff.role);
    }, [edit, staff]);

    return (
        <div className="overflow-auto border border-gray-200 rounded-lg">
            <table className="border-separate border-spacing-0 min-w-[1000px]">
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
                            onEditCell={(st, day) => setEdit({ staff: st, day })}
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
            {edit && (
                <QuickEditDialog
                    open={!!edit}
                    day={fmtYMD(year, month, edit.day)}
                    current={edit.staff}
                    candidates={candidates}
                    fixed={fixedByDayStaff.has(`${edit.staff.id}|${fmtYMD(year, month, edit.day)}`)}
                    onClose={() => setEdit(null)}
                />
            )}
        </div>
    );
}
