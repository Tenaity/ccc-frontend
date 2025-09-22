// src/components/schedule/MatrixTable.tsx
import React from "react";
import MatrixHeader from "./MatrixHeader";
import MatrixRow from "./MatrixRow";
import TotalsRows from "./TotalsRows";
import QuickEditDialog from "../QuickEditDialog";
import { fmtYMD } from "@/utils/date";
import type {
  Staff,
  Assignment,
  ExpectedPerDay,
  DayPlaceSummary,
} from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody } from "@/components/ui/table";

export default function MatrixTable({
  year,
  month,
  days,
  staff,
  assignmentIndex,
  summariesByStaffId,
  perDayLeaders,
  perDayByPlace,
  expectedByDay,
  fixedByDayStaff,
  offByDayStaff,
}: {
  year: number;
  month: number;
  days: number[];
  staff: Staff[];
  assignmentIndex: Map<
    string,
    { code: Assignment["shift_code"]; position: Assignment["position"] | null }
  >;
  summariesByStaffId: Map<
    number,
    {
      counts: Record<string, number>;
      credit: number;
      dayCount: number;
      nightCount: number;
    }
  >;
  perDayLeaders: Record<number, number>;
  perDayByPlace: Record<number, DayPlaceSummary>;
  expectedByDay: Record<number, ExpectedPerDay>;
  fixedByDayStaff: Map<string, boolean>;
  offByDayStaff: Map<string, boolean>;
}) {
  const [edit, setEdit] = React.useState<{ staff: Staff; day: number } | null>(
    null
  );
  const candidates = React.useMemo(() => {
    if (!edit) return [] as Staff[];
    return (staff ?? []).filter((s) => s.role === edit.staff.role);
  }, [edit, staff]);

  return (
    <div className="rounded-3xl border border-border/60 bg-card shadow-sm">
      <ScrollArea className="max-h-[70vh] rounded-3xl">
        <div className="min-w-[1100px]">
          <Table className="border-separate border-spacing-0 text-sm">
            <MatrixHeader
              year={year}
              month={month}
              days={days}
              perDayLeaders={perDayLeaders}
            />
            <TableBody>
              {(staff ?? []).map((member, idx) => (
                <MatrixRow
                  key={member.id}
                  staff={member}
                  index={idx}
                  year={year}
                  month={month}
                  days={days}
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
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      {edit && (
        <QuickEditDialog
          open={!!edit}
          day={fmtYMD(year, month, edit.day)}
          current={edit.staff}
          candidates={candidates}
          fixed={fixedByDayStaff.has(
            `${edit.staff.id}|${fmtYMD(year, month, edit.day)}`
          )}
          onClose={() => setEdit(null)}
        />
      )}
    </div>
  );
}
