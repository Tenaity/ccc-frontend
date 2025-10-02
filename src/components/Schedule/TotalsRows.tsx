// src/components/Schedule/TotalsRows.tsx
import React from "react";
import { getDow, isWeekend } from "@/utils/date";
import type { ExpectedByDay, DayPlaceSummary } from "@/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function TotalsRows({
  year,
  month,
  days,
  perDayByPlace,
  expectedByDay,
}: {
  year: number;
  month: number;
  days: number[];
  perDayByPlace: Record<number, DayPlaceSummary>;
  expectedByDay: ExpectedByDay;
}) {
  const stickyColumnBase =
    "sticky left-0 z-20 min-w-[220px] bg-white/92 px-4 py-2 text-left shadow-[8px_0_28px_-12px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:bg-slate-950/90 dark:shadow-[8px_0_28px_-12px_rgba(0,0,0,0.45)]";
  const weekendClass = (day: number) =>
    isWeekend(getDow(year, month, day)) ? "bg-amber-50/35 dark:bg-amber-900/15" : "";

  const tdTotal = (summary: DayPlaceSummary) =>
    summary.TD.K + summary.TD.CA1 + summary.TD.CA2 + summary.TD.D;
  const pgdTotal = (summary: DayPlaceSummary) =>
    summary.PGD.K + summary.PGD.CA2 + summary.PGD.D;

  const renderDataRow = (
    key: string,
    label: React.ReactNode,
    backgroundClass: string,
    valueAccessor: (
      summary: DayPlaceSummary | undefined,
      day: number,
      index: number
    ) => React.ReactNode,
    options: { italic?: boolean; expected?: boolean } = {}
  ) => (
    <TableRow key={key} className={cn(backgroundClass, "text-sm")}>
      <th
        scope="row"
        className={cn(
          stickyColumnBase,
          "font-medium",
          options.expected && "text-xs italic text-muted-foreground"
        )}
      >
        {label}
      </th>
      {days.map((day, index) => (
        <TableCell
          key={`${key}-${day}`}
          className={cn(
            "px-2 py-1 text-center text-sm",
            weekendClass(day),
            options.expected && "text-xs text-muted-foreground"
          )}
        >
          {valueAccessor(perDayByPlace?.[day], day, index)}
        </TableCell>
      ))}
      <TableCell colSpan={9} className="text-xs text-muted-foreground" />
    </TableRow>
  );

  return (
    <>
      <TableRow className="bg-sky-50/40 text-sm font-semibold backdrop-blur-sm">
        <th
          scope="row"
          className={stickyColumnBase}
        >
          — TỔNG ĐÀI (TD) —
        </th>
        {days.map((day) => (
          <TableCell key={`td-section-${day}`} className={cn("px-2", weekendClass(day))} />
        ))}
        <TableCell colSpan={9} className="text-xs text-muted-foreground">
          Tổng hợp ca tại Tổng đài
        </TableCell>
      </TableRow>

      {renderDataRow(
        "td-leader",
        "TD · K 👑 (trưởng ca · ngày)",
        "bg-emerald-50",
        (summary) => summary?.TD.K ?? 0
      )}
      {renderDataRow(
        "td-leader-expected",
        "Chuẩn · TD · K 👑",
        "bg-muted/30 backdrop-blur-sm",
        (_, day) => expectedByDay?.[day]?.expectedTD?.K ?? "-",
        { expected: true }
      )}

      {renderDataRow(
        "td-ca1",
        "TD · CA1 (ngày)",
        "bg-blue-50/50 backdrop-blur-sm",
        (summary) => summary?.TD.CA1 ?? 0
      )}
      {renderDataRow(
        "td-ca1-expected",
        "Chuẩn · TD · CA1",
        "bg-muted/30 backdrop-blur-sm",
        (_, day) => expectedByDay?.[day]?.expectedTD?.CA1 ?? "-",
        { expected: true }
      )}

      {renderDataRow(
        "td-ca2",
        "TD · CA2 (ngày)",
        "bg-amber-50/55 backdrop-blur-sm",
        (summary) => summary?.TD.CA2 ?? 0
      )}
      {renderDataRow(
        "td-ca2-expected",
        "Chuẩn · TD · CA2",
        "bg-muted/30 backdrop-blur-sm",
        (_, day) => expectedByDay?.[day]?.expectedTD?.CA2 ?? "-",
        { expected: true }
      )}

      {renderDataRow(
        "td-night",
        "TD · Đ (đêm)",
        "bg-rose-50/55 backdrop-blur-sm",
        (summary) => summary?.TD.D ?? 0
      )}
      {renderDataRow(
        "td-night-expected",
        "Chuẩn · TD · Đ",
        "bg-muted/30 backdrop-blur-sm",
        (_, day) => expectedByDay?.[day]?.expectedTD?.D ?? "-",
        { expected: true }
      )}

      <TableRow className="bg-rose-50/45 text-sm font-semibold backdrop-blur-sm">
        <th
          scope="row"
          className={stickyColumnBase}
        >
          — PHÒNG GIAO DỊCH (PGD) —
        </th>
        {days.map((day) => (
          <TableCell key={`pgd-section-${day}`} className={cn("px-2", weekendClass(day))} />
        ))}
        <TableCell colSpan={9} className="text-xs text-muted-foreground">
          Tổng hợp ca tại PGD
        </TableCell>
      </TableRow>

      {renderDataRow(
        "pgd-k",
        "PGD · K (ngày)",
        "bg-rose-100",
        (summary) => summary?.PGD.K ?? 0
      )}
      {renderDataRow(
        "pgd-k-expected",
        "Chuẩn · PGD · K",
        "bg-muted/30 backdrop-blur-sm",
        (_, day) => expectedByDay?.[day]?.expectedPGD?.K ?? "-",
        { expected: true }
      )}

      {renderDataRow(
        "pgd-ca2",
        "PGD · CA2 (ngày)",
        "bg-rose-100/45 backdrop-blur-sm",
        (summary) => summary?.PGD.CA2 ?? 0
      )}
      {renderDataRow(
        "pgd-ca2-expected",
        "Chuẩn · PGD · CA2",
        "bg-muted/30 backdrop-blur-sm",
        (_, day) => expectedByDay?.[day]?.expectedPGD?.CA2 ?? "-",
        { expected: true }
      )}

      {renderDataRow(
        "pgd-d",
        "PGD · Đ (đêm)",
        "bg-rose-200/35 backdrop-blur-sm",
        (summary) => summary?.PGD.D ?? 0
      )}
      {renderDataRow(
        "pgd-d-expected",
        "Chuẩn · PGD · Đ",
        "bg-muted/30 backdrop-blur-sm",
        (_, day) => expectedByDay?.[day]?.expectedPGD?.D ?? "-",
        { expected: true }
      )}

      <TableRow className="bg-blue-100/45 font-semibold backdrop-blur-sm">
        <th
          scope="row"
          className={stickyColumnBase}
        >
          TỔNG TD
        </th>
        {days.map((day) => (
          <TableCell
            key={`total-td-${day}`}
            className={cn("px-2 py-1 text-center", weekendClass(day))}
          >
            {perDayByPlace?.[day] ? tdTotal(perDayByPlace[day]) : 0}
          </TableCell>
        ))}
        <TableCell colSpan={9} className="text-xs text-muted-foreground">
          Tổng nhân sự tại Tổng đài (ngày + đêm)
        </TableCell>
      </TableRow>

      <TableRow className="bg-rose-100/45 font-semibold backdrop-blur-sm">
        <TableCell className={stickyColumnBase}>
          TỔNG PGD
        </TableCell>
        {days.map((day) => (
          <TableCell
            key={`total-pgd-${day}`}
            className={cn("px-2 py-1 text-center", weekendClass(day))}
          >
            {perDayByPlace?.[day] ? pgdTotal(perDayByPlace[day]) : 0}
          </TableCell>
        ))}
        <TableCell colSpan={9} className="text-xs text-muted-foreground">
          Tổng nhân sự tại PGD (ngày + đêm)
        </TableCell>
      </TableRow>

      <TableRow className="bg-muted/40 font-semibold backdrop-blur-sm">
        <TableCell className={stickyColumnBase}>
          TỔNG (TD + PGD)
        </TableCell>
        {days.map((day) => (
          <TableCell
            key={`total-all-${day}`}
            className={cn("px-2 py-1 text-center", weekendClass(day))}
          >
            {perDayByPlace?.[day]
              ? tdTotal(perDayByPlace[day]) + pgdTotal(perDayByPlace[day])
              : 0}
          </TableCell>
        ))}
        <TableCell colSpan={9} className="text-xs text-muted-foreground">
          Tổng nhân sự toàn bộ vị trí
        </TableCell>
      </TableRow>
    </>
  );
}
