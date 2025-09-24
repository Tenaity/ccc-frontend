import React from "react";
import { DOW_LABEL } from "@/utils/schedule";
import { getDow, isWeekend } from "@/utils/date";
import { cn } from "@/lib/utils";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MatrixHeader({
  year,
  month,
  days,
  perDayLeaders,
}: {
  year: number;
  month: number;
  days: number[];
  perDayLeaders: Record<number, number>;
}) {
  return (
    <TableHeader sticky className="z-30">
      <TableRow className="bg-muted/80">
        <TableHead
          rowSpan={3}
          scope="col"
          className="sticky left-0 top-0 z-40 min-w-[220px] rounded-tl-2xl border-r border-border bg-background/95 px-4 py-3 text-left text-sm font-semibold text-foreground shadow-[4px_0_12px_-8px_rgba(15,23,42,0.3)] backdrop-blur-[2px] supports-[backdrop-filter]:bg-background/60"
        >
          Nhân viên
        </TableHead>
        {days.map((day) => {
          const dow = getDow(year, month, day);
          const weekend = isWeekend(dow);
          const leaderCount = perDayLeaders[day] ?? 0;
          const ok = leaderCount === 1;
          return (
            <TableHead
              key={`day-${day}`}
              scope="col"
              className={cn(
                "sticky top-0 z-30 min-w-[64px] border-b border-border bg-muted/80 px-3 py-3 text-center text-sm font-semibold",
                weekend && "bg-amber-100/70"
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <span>{day}</span>
                <span
                  className={cn(
                    "inline-flex min-w-[48px] items-center justify-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
                    ok
                      ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                      : "border-destructive/50 bg-destructive/20 text-destructive"
                  )}
                >
                  {ok ? "OK" : `K=${leaderCount}`}
                </span>
              </div>
            </TableHead>
          );
        })}
        {[
          "CA1",
          "CA2",
          "K",
          "HC",
          "Đ",
          "P",
          "Ngày",
          "Đêm",
          "Tổng",
        ].map((label) => (
          <TableHead
            key={label}
            rowSpan={3}
            scope="col"
            className="sticky top-0 z-30 min-w-[72px] border-b border-border/60 bg-muted/70 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {label}
          </TableHead>
        ))}
      </TableRow>
      <TableRow className="bg-muted/70">
        {days.map((day) => {
          const dow = getDow(year, month, day);
          const weekend = isWeekend(dow);
          return (
            <TableHead
              key={`dow-${day}`}
              scope="col"
              className={cn(
                "sticky top-[46px] z-30 border-b border-border bg-muted/70 px-2 py-1 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
                weekend && "bg-amber-100/70"
              )}
            >
              {DOW_LABEL[dow]}
            </TableHead>
          );
        })}
      </TableRow>
      <TableRow className="bg-muted/60">
        {days.map((day) => {
          const weekend = isWeekend(getDow(year, month, day));
          const leaders = perDayLeaders[day] ?? 0;
          return (
            <TableHead
              key={`leaders-${day}`}
              scope="col"
              className={cn(
                "sticky top-[72px] z-30 border-b border-border bg-muted/60 px-2 py-1 text-center text-[11px] text-muted-foreground",
                weekend && "bg-amber-100/60"
              )}
            >
              Leader TD: {leaders}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}
