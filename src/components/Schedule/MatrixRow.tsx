// src/components/Schedule/MatrixRow.tsx
import React from "react";
import type { Staff, Assignment } from "@/types";
import { fmtYMD, getDow, isWeekend } from "@/utils/date";
import Badge from "@/components/Badge";
import {
  isNightLeader,
  isDayLeader,
  isNightTD,
  isNightPGD,
} from "@/utils/schedule";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ShieldCheck } from "lucide-react";

// Parse tiện lợi từ notes: "[CODE:1978][RANK:1]"
function parseMeta(notes?: string | null) {
    if (!notes) return { code: null as string | null, rank: null as 1 | 2 | null };
    const code = notes.match(/\[CODE:(\d+)\]/)?.[1] ?? null;
    const rankStr = notes.match(/\[RANK:(1|2)\]/)?.[1] ?? null;
    const rank = (rankStr === "1" || rankStr === "2") ? (Number(rankStr) as 1 | 2) : null;
    return { code, rank };
}

export default function MatrixRow({
  staff,
  index,
  year,
  month,
  days,
  assignmentIndex,
  summariesByStaffId,
  fixedByDayStaff,
  offByDayStaff,
  leaderCountsByDay,
  onEditCell,
}: {
  staff: Staff;
  index: number;
  year: number;
  month: number;
  days: number[];
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
  fixedByDayStaff: Map<string, boolean>;
  offByDayStaff: Map<string, boolean>;
  leaderCountsByDay: Map<number, { day: number; night: number }>;
  onEditCell?: (staff: Staff, day: number) => void;
}) {
  const sum =
    summariesByStaffId.get(staff.id) ||
    { counts: {}, credit: 0, dayCount: 0, nightCount: 0 };
  const meta = parseMeta(staff.notes);
  const displayId = meta.code ?? String(staff.id);

  const stripeClass = index % 2 === 0
    ? "bg-white/55 dark:bg-slate-900/45"
    : "bg-white/40 dark:bg-slate-900/35";

  const RankChip = meta.rank ? (
    <span
      className={cn(
        "ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold",
        "backdrop-blur-sm transition-all duration-200",
        meta.rank === 1
          ? "border border-primary bg-primary text-primary-foreground shadow-sm"
          : "border border-primary/70 bg-primary/80 text-primary-foreground shadow-sm"
      )}
    >
      Rank {meta.rank}
    </span>
  ) : null;

  return (
    <TableRow
      className={cn(
        "transition-all duration-200 backdrop-blur-md",
        "hover:bg-primary/15 dark:hover:bg-primary/10",
        stripeClass,
      )}
    >
      <th
        scope="row"
        className={cn(
          "sticky left-0 z-20 min-w-[240px]",
          "bg-white/92 dark:bg-slate-950/92",
          "backdrop-blur-3xl backdrop-saturate-150",
          "px-6 py-4 text-left",
          "shadow-[8px_0_28px_-12px_rgba(15,23,42,0.22)] dark:shadow-[8px_0_28px_-12px_rgba(0,0,0,0.5)]",
          "transition-all duration-300"
        )}
      >
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-foreground">
              {staff.full_name}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/90">
              <span className="font-medium">{staff.role}</span>
              <span className="rounded-lg border-0 bg-primary/10 px-2 py-1 font-bold text-primary backdrop-blur-sm dark:bg-primary/20">
                #{displayId}
              </span>
              {RankChip}
            </div>
          </div>
          {meta.rank === 1 ? (
            <ShieldCheck className="h-5 w-5 text-primary drop-shadow-sm" aria-hidden="true" />
          ) : null}
        </div>
      </th>

      {days.map((day) => {
        const dateKey = fmtYMD(year, month, day);
        const cell = assignmentIndex.get(`${staff.id}|${dateKey}`);
        const code = (cell?.code ?? "") as Assignment["shift_code"] | "";
        const position =
          (cell?.position ?? null) as Assignment["position"] | null;
        const weekend = isWeekend(getDow(year, month, day));

        const marker = { shift_code: code, position, role: staff.role };
        const leaderDay = isDayLeader(marker);
        const leaderNight = isNightLeader(marker);
        const tdNight = isNightTD(marker);
        const pgdNight = isNightPGD(marker);

        const leaderBucket = leaderCountsByDay.get(day);
        const duplicateDayLeader = leaderDay && (leaderBucket?.day ?? 0) > 1;
        const duplicateNightLeader = leaderNight && (leaderBucket?.night ?? 0) > 1;

        let badgeVariant: React.ComponentProps<typeof Badge>["variant"] = "default";
        if (leaderDay) badgeVariant = duplicateDayLeader ? "duplicate" : "leader";
        else if (leaderNight)
          badgeVariant = duplicateNightLeader ? "duplicate" : "night";
        else if (tdNight) badgeVariant = "night";
        else if (pgdNight) badgeVariant = "pgd";
        else if (position === "PGD") badgeVariant = "pgd";

        const key = `${staff.id}|${dateKey}`;
        const isFixed = fixedByDayStaff.has(key);
        const isOff = offByDayStaff.has(key);

        const tooltipSource = isOff
          ? "Nguồn: Off"
          : isFixed
            ? "Nguồn: Fixed"
            : "Nguồn: Engine";

        const displayCode = isOff ? "OFF" : code || "Trống";

        return (
          <TableCell
            key={day}
            className={cn(
              "relative h-16 min-w-[72px]",
              "px-2 py-2 text-center",
              "transition-all duration-200",
              "shadow-[inset_0_-1px_0_rgba(148,163,184,0.16)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]",
              weekend && "bg-amber-50/35 dark:bg-amber-900/15",
              !isFixed && !isOff && onEditCell && "cursor-pointer hover:bg-primary/20 hover:shadow-[inset_0_-1px_0_rgba(79,70,229,0.35)]"
            )}
            onClick={() => {
              if (!isFixed && !isOff && onEditCell) {
                onEditCell(staff, day);
              }
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-full w-full items-center justify-center">
                  {isOff ? (
                    <Badge code="OFF" variant="off" />
                  ) : (
                    <Badge
                      code={code || ""}
                      crown={leaderDay || leaderNight}
                      variant={isFixed ? "fixed" : badgeVariant}
                      pinned={isFixed}
                      rank={meta.rank || undefined}
                    />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-left">
                <p className="font-semibold">{staff.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {dateKey} · {displayCode}
                </p>
                {position ? (
                  <p className="text-xs">Vị trí: {position}</p>
                ) : null}
                <p className="text-xs">{tooltipSource}</p>
                <p className="text-xs">Credit tháng: {sum.credit}</p>
              </TooltipContent>
            </Tooltip>
          </TableCell>
        );
      })}

      <TableCell className={cn(
        "text-center text-sm font-semibold text-foreground",
        "shadow-[inset_0_-1px_0_rgba(148,163,184,0.16)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]"
      )}>
        {sum.counts["CA1"] || 0}
      </TableCell>
      <TableCell className={cn(
        "text-center text-sm font-semibold text-foreground",
        "shadow-[inset_0_-1px_0_rgba(148,163,184,0.16)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]"
      )}>
        {sum.counts["CA2"] || 0}
      </TableCell>
      <TableCell className={cn(
        "text-center text-sm font-semibold text-foreground",
        "shadow-[inset_0_-1px_0_rgba(148,163,184,0.16)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]"
      )}>
        {sum.counts["K"] || 0}
      </TableCell>
      <TableCell className={cn(
        "text-center text-sm font-semibold text-foreground",
        "shadow-[inset_0_-1px_0_rgba(148,163,184,0.16)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]"
      )}>
        {sum.counts["HC"] || 0}
      </TableCell>
      <TableCell className={cn(
        "text-center text-sm font-semibold text-foreground",
        "shadow-[inset_0_-1px_0_rgba(148,163,184,0.16)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]"
      )}>
        {sum.counts["Đ"] || 0}
      </TableCell>
      <TableCell className={cn(
        "text-center text-sm font-semibold text-foreground",
        "shadow-[inset_0_-1px_0_rgba(148,163,184,0.16)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]"
      )}>
        {sum.counts["P"] || 0}
      </TableCell>
      <TableCell className={cn(
        "text-center text-sm font-bold text-foreground",
        "shadow-[inset_0_-1px_0_rgba(148,163,184,0.2)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]",
        "bg-white/25 dark:bg-slate-900/30 backdrop-blur-sm"
      )}>
        {sum.dayCount || 0}
      </TableCell>
      <TableCell className={cn(
        "text-center text-sm font-bold text-foreground",
        "shadow-[inset_0_-1px_0_rgba(148,163,184,0.2)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]",
        "bg-white/25 dark:bg-slate-900/30 backdrop-blur-sm"
      )}>
        {sum.nightCount || 0}
      </TableCell>
      <TableCell className={cn(
        "text-center text-sm font-extrabold text-foreground",
        "shadow-[inset_0_-1px_0_rgba(148,163,184,0.24)] dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.55)]",
        "bg-white/45 dark:bg-slate-900/45 backdrop-blur-md"
      )}>
        {sum.credit || 0}
      </TableCell>
    </TableRow>
  );
}
