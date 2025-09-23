import type { ReactNode } from "react"

import CalendarHeader from "@/components/CalendarHeader"
import ConflictList from "@/components/ConflictList"
import Toolbar from "@/components/Toolbar"
import MatrixTable from "@/components/schedule/MatrixTable"
import { Card, CardContent } from "@/components/ui/card"
import type { DayPlaceSummary, ExpectedByDay, Staff } from "@/types"
import type { Cell } from "@/utils/mergeCellIndex"

interface StaffSummary {
  counts: Record<string, number>
  credit: number
  dayCount: number
  nightCount: number
}

export interface SchedulePageProps {
  year: number
  month: number
  setYear: (year: number) => void
  setMonth: (month: number) => void
  loadingGen: boolean
  onGenerate: () => Promise<{ ok: boolean; conflicts: any[] } | void> | void
  onValidate: () => Promise<unknown> | unknown
  onExport: () => void
  onFixedOff: () => void
  onShuffle: () => void
  onSave: () => void
  onResetSoft: () => void
  onResetHard: () => void
  exporting: boolean
  fillHC: boolean
  setFillHC: (value: boolean) => void
  canGenerate: boolean
  days: number[]
  staff: Staff[]
  assignmentIndex: Map<string, Cell>
  summariesByStaffId: Map<number, StaffSummary>
  perDayLeaders: Record<number, number>
  perDayByPlace: Record<number, DayPlaceSummary>
  expectedByDay: ExpectedByDay
  fixedByDayStaff: Map<string, boolean>
  offByDayStaff: Map<string, boolean>
  matrixLoading: boolean
  matrixError: string | null
  fetchStaff: () => void
  validationConflicts: any[]
  toolbarActions?: ReactNode
}

export default function SchedulePage({
  year,
  month,
  setYear,
  setMonth,
  loadingGen,
  onGenerate,
  onValidate,
  onExport,
  onFixedOff,
  onShuffle,
  onSave,
  onResetSoft,
  onResetHard,
  exporting,
  fillHC,
  setFillHC,
  canGenerate,
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
  toolbarActions,
}: SchedulePageProps) {
  return (
    <div className="flex flex-col gap-6 px-4 pb-16 lg:px-6">
      <section id="schedule" aria-labelledby="schedule-heading" className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 id="schedule-heading" className="text-base font-semibold text-foreground">
            Monthly schedule
          </h2>
          <p className="text-sm text-muted-foreground">
            Quản lý ma trận phân ca, rà soát xung đột và xuất báo cáo CSV.
          </p>
        </div>

        <CalendarHeader
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
          loading={loadingGen}
          onGenerate={() => {
            void onGenerate()
          }}
          onShuffle={onShuffle}
          onSave={onSave}
          onResetSoft={onResetSoft}
          onResetHard={onResetHard}
          onExport={onExport}
          exporting={exporting}
          fillHC={fillHC}
          setFillHC={setFillHC}
          canGenerate={canGenerate}
          onOpenFixedOff={onFixedOff}
        />

        <Card className="border-border/60 shadow-sm">
          <CardContent className="space-y-6 p-6">
            <Toolbar
              onGenerate={() => {
                void onGenerate()
              }}
              onValidate={() => {
                void onValidate()
              }}
              onExport={onExport}
              onFixedOff={onFixedOff}
              disabled={loadingGen}
              exporting={exporting}
            />
            {toolbarActions}
            <div id="conflicts" className="space-y-4">
              <ConflictList conflicts={validationConflicts} />
            </div>
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
              withCard={false}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
