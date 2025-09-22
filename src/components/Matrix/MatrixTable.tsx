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
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Inbox, RefreshCcw, TriangleAlert } from "lucide-react";

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
  loading = false,
  error = null,
  onRetry,
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
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const [edit, setEdit] = React.useState<{ staff: Staff; day: number } | null>(
    null
  );
  const candidates = React.useMemo(() => {
    if (!edit) return [] as Staff[];
    return (staff ?? []).filter((s) => s.role === edit.staff.role);
  }, [edit, staff]);

  const leaderCountsByDay = React.useMemo(() => {
    const counts = new Map<number, { day: number; night: number }>();
    for (const day of days) {
      counts.set(day, { day: 0, night: 0 });
    }
    assignmentIndex.forEach((value, key) => {
      const [, isoDay] = key.split("|");
      if (!isoDay) return;
      const dayNum = Number(isoDay.split("-")[2]);
      const bucket = counts.get(dayNum);
      if (!bucket) return;
      if (value?.code === "K" && value?.position === "TD") {
        bucket.day += 1;
      }
      if (value?.code === "Đ" && value?.position === "TD") {
        bucket.night += 1;
      }
    });
    return counts;
  }, [assignmentIndex, days]);

  const members = staff ?? [];
  const showEmpty = !loading && !error && members.length === 0;

  return (
    <>
      <Card className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <MatrixSkeleton dayCount={days.length} />
          ) : error ? (
            <div className="p-6">
              <MatrixErrorState message={error} onRetry={onRetry} />
            </div>
          ) : showEmpty ? (
            <div className="p-6">
              <MatrixEmptyState />
            </div>
          ) : (
            <TooltipProvider delayDuration={150}>
              <ScrollArea className="max-h-[70vh]">
                <div className="min-w-[1100px]">
                  <Table
                    className="border-separate border-spacing-0 text-sm text-foreground"
                    stickyHeader
                  >
                    <MatrixHeader
                      year={year}
                      month={month}
                      days={days}
                      perDayLeaders={perDayLeaders}
                    />
                    <TableBody>
                      {members.map((member, idx) => (
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
                          leaderCountsByDay={leaderCountsByDay}
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
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
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
    </>
  );
}

function MatrixSkeleton({ dayCount }: { dayCount: number }) {
  const previewColumns = Math.min(dayCount, 7);
  const rows = Array.from({ length: 6 });

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-3 rounded-2xl border border-dashed border-border/60 p-4">
        {rows.map((_, rowIdx) => (
          <div
            key={`skeleton-row-${rowIdx}`}
            className="flex items-center gap-3"
          >
            <Skeleton className="h-12 w-56" />
            <div className="flex flex-1 flex-wrap gap-2">
              {Array.from({ length: previewColumns }).map((__, colIdx) => (
                <Skeleton
                  key={`skeleton-cell-${rowIdx}-${colIdx}`}
                  className="h-10 w-14 flex-1 min-w-[3.5rem]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatrixEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Inbox className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          Chưa có dữ liệu phân ca
        </h3>
        <p className="text-sm text-muted-foreground">
          Hãy generate lịch hoặc kiểm tra lại cấu hình nguồn dữ liệu.
        </p>
      </div>
    </div>
  );
}

function MatrixErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Alert variant="destructive" className="space-y-3">
      <TriangleAlert className="h-5 w-5" aria-hidden="true" />
      <div>
        <AlertTitle>Không thể tải dữ liệu ma trận</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </div>
      {onRetry ? (
        <div className="pt-2">
          <Button
            variant="outline"
            onClick={() => onRetry()}
            className="inline-flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            Thử lại
          </Button>
        </div>
      ) : null}
    </Alert>
  );
}
