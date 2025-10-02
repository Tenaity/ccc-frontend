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
      <TableRow className={cn(
        "bg-white/88 dark:bg-slate-950/90",
        "backdrop-blur-3xl backdrop-saturate-150",
        "shadow-[0_12px_32px_rgba(15,23,42,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      )}>
        <TableHead
          rowSpan={3}
          scope="col"
          className={cn(
            "sticky left-0 top-0 z-40 min-w-[240px] rounded-tl-3xl",
            "bg-white/96 dark:bg-slate-950/96",
            "backdrop-blur-3xl backdrop-saturate-150",
            "px-6 py-4 text-left text-sm font-bold text-foreground",
            "shadow-[12px_0_32px_-12px_rgba(15,23,42,0.2)] dark:shadow-[12px_0_32px_-12px_rgba(0,0,0,0.55)]",
            "transition-all duration-300"
          )}
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
                "sticky top-0 z-30 min-w-[72px]",
                "px-4 py-3 text-center text-sm font-bold",
                "shadow-[inset_0_-1px_0_rgba(148,163,184,0.18)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]",
                weekend
                  ? "bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-2xl"
                  : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl"
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-base">{day}</span>
                <span
                  className={cn(
                    "inline-flex min-w-[52px] items-center justify-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide",
                    "backdrop-blur-sm transition-all duration-200",
                    ok
                      ? "border-0 bg-emerald-500/90 text-white shadow-sm"
                      : "border-0 bg-destructive/90 text-white shadow-sm"
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
            className={cn(
              "sticky top-0 z-30 min-w-[80px]",
              "bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl",
              "px-4 py-3 text-center text-xs font-bold uppercase tracking-wider",
              "text-foreground/80",
              "shadow-[inset_0_-1px_0_rgba(148,163,184,0.14)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]"
            )}
          >
            {label}
          </TableHead>
        ))}
      </TableRow>
      <TableRow className={cn(
        "bg-white/85 dark:bg-slate-950/86",
        "backdrop-blur-2xl",
        "shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
      )}>
        {days.map((day) => {
          const dow = getDow(year, month, day);
          const weekend = isWeekend(dow);
          return (
            <TableHead
              key={`dow-${day}`}
              scope="col"
              className={cn(
                "sticky top-[52px] z-30",
                "px-3 py-2 text-center text-[11px] font-bold uppercase tracking-wider",
                "shadow-[inset_0_-1px_0_rgba(148,163,184,0.12)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.45)]",
                weekend
                  ? "bg-amber-50/70 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 backdrop-blur-xl"
                  : "bg-white/70 dark:bg-slate-900/70 text-muted-foreground backdrop-blur-xl"
              )}
            >
              {DOW_LABEL[dow]}
            </TableHead>
          );
        })}
      </TableRow>
      <TableRow className={cn(
        "bg-white/80 dark:bg-slate-950/82",
        "backdrop-blur-xl",
        "shadow-[0_8px_20px_rgba(15,23,42,0.08)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
      )}>
        {days.map((day) => {
          const weekend = isWeekend(getDow(year, month, day));
          const leaders = perDayLeaders[day] ?? 0;
          return (
            <TableHead
              key={`leaders-${day}`}
              scope="col"
              className={cn(
                "sticky top-[84px] z-30",
                "px-3 py-2 text-center text-[10px] font-semibold",
                "shadow-[inset_0_-1px_0_rgba(148,163,184,0.12)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.45)]",
                weekend
                  ? "bg-amber-50/60 dark:bg-amber-900/15 text-amber-600 dark:text-amber-400 backdrop-blur-lg"
                  : "bg-white/60 dark:bg-slate-900/60 text-muted-foreground backdrop-blur-lg"
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
