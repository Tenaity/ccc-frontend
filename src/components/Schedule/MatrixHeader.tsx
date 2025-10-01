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
        "bg-white/90 dark:bg-slate-900/90",
        "backdrop-blur-2xl backdrop-saturate-150"
      )}>
        <TableHead
          rowSpan={3}
          scope="col"
          className={cn(
            "sticky left-0 top-0 z-40 min-w-[240px] rounded-tl-3xl",
            "border-r-0 border-b border-white/20 dark:border-white/10",
            "bg-white/95 dark:bg-slate-900/95",
            "backdrop-blur-3xl backdrop-saturate-150",
            "px-6 py-4 text-left text-sm font-bold text-foreground",
            "shadow-[8px_0_24px_-8px_rgba(0,0,0,0.12)] dark:shadow-[8px_0_24px_-8px_rgba(0,0,0,0.4)]",
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
                "border-b border-white/20 dark:border-white/10",
                "px-4 py-3 text-center text-sm font-bold",
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
              "border-b border-white/20 dark:border-white/10",
              "bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl",
              "px-4 py-3 text-center text-xs font-bold uppercase tracking-wider",
              "text-foreground/80"
            )}
          >
            {label}
          </TableHead>
        ))}
      </TableRow>
      <TableRow className={cn(
        "bg-white/85 dark:bg-slate-900/85",
        "backdrop-blur-2xl"
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
                "border-b border-white/20 dark:border-white/10",
                "px-3 py-2 text-center text-[11px] font-bold uppercase tracking-wider",
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
        "bg-white/80 dark:bg-slate-900/80",
        "backdrop-blur-xl"
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
                "border-b border-white/20 dark:border-white/10",
                "px-3 py-2 text-center text-[10px] font-semibold",
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
