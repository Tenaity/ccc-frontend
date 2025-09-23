import React from "react";
import CalendarHeader from "@/components/CalendarHeader";
import Toolbar from "@/components/Toolbar";
import ConflictList from "@/components/ConflictList";
import MatrixTable from "@/components/Matrix/MatrixTable";
import type { Staff, ExpectedByDay, DayPlaceSummary } from "@/types";
import type { Cell } from "@/utils/mergeCellIndex";

interface StaffSummary {
  counts: Record<string, number>;
  credit: number;
  dayCount: number;
  nightCount: number;
}

interface MatrixRouteProps {
  year: number;
  month: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  loadingGen: boolean;
  onGenerate: () => void;
  onShuffle: () => void;
  onSave: () => void;
  onResetSoft: () => void;
  onResetHard: () => void;
  onExport: () => void;
  exporting: boolean;
  fillHC: boolean;
  setFillHC: (value: boolean) => void;
  canGenerate: boolean;
  onValidate: () => Promise<unknown> | unknown;
  onOpenFixedOff: () => void;
  days: number[];
  staff: Staff[];
  assignmentIndex: Map<string, Cell>;
  summariesByStaffId: Map<number, StaffSummary>;
  perDayLeaders: Record<number, number>;
  perDayByPlace: Record<number, DayPlaceSummary>;
  expectedByDay: ExpectedByDay;
  fixedByDayStaff: Map<string, boolean>;
  offByDayStaff: Map<string, boolean>;
  matrixLoading: boolean;
  matrixError: string | null;
  fetchStaff: () => void;
  validationConflicts: any[];
}

export default function MatrixRoute({
  year,
  month,
  setYear,
  setMonth,
  loadingGen,
  onGenerate,
  onShuffle,
  onSave,
  onResetSoft,
  onResetHard,
  onExport,
  exporting,
  fillHC,
  setFillHC,
  canGenerate,
  onValidate,
  onOpenFixedOff,
  days,
  staff,
  assignmentIndex,
  summariesByStaffId,
  perDayLeaders,
  perDayByPlace,
  expectedByDay,
  fixedByDayStaff,
  offByDayStaff,
  matrixLoading,
  matrixError,
  fetchStaff,
  validationConflicts,
}: MatrixRouteProps) {
  return (
    <section id="matrix" aria-labelledby="matrix-heading" className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="matrix-heading" className="text-base font-semibold text-foreground">
            Ma trận phân ca
          </h2>
          <p className="text-sm text-muted-foreground">
            Chỉnh sửa, sinh ca và xuất báo cáo CSV
          </p>
        </div>
      </div>

      <CalendarHeader
        year={year}
        month={month}
        setYear={setYear}
        setMonth={setMonth}
        loading={loadingGen}
        onGenerate={onGenerate}
        onShuffle={onShuffle}
        onSave={onSave}
        onResetSoft={onResetSoft}
        onResetHard={onResetHard}
        onExport={onExport}
        exporting={exporting}
        fillHC={fillHC}
        setFillHC={setFillHC}
        canGenerate={canGenerate}
        onOpenFixedOff={onOpenFixedOff}
      />

      <Toolbar
        onGenerate={onGenerate}
        onValidate={() => onValidate()}
        onExport={onExport}
        onFixedOff={onOpenFixedOff}
        disabled={loadingGen}
        exporting={exporting}
      />

      <div id="conflicts" className="space-y-4">
        <ConflictList conflicts={validationConflicts} />
      </div>

      <div id="matrix-table" className="overflow-x-auto">
        <MatrixTable
          year={year}
          month={month}
          days={days}
          staff={staff}
          assignmentIndex={assignmentIndex}
          summariesByStaffId={summariesByStaffId}
          perDayLeaders={perDayLeaders}
          perDayByPlace={perDayByPlace}
          expectedByDay={expectedByDay}
          fixedByDayStaff={fixedByDayStaff}
          offByDayStaff={offByDayStaff}
          loading={matrixLoading}
          error={matrixError}
          onRetry={fetchStaff}
        />
      </div>
    </section>
  );
}
