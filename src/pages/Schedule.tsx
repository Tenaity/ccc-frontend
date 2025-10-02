import { useCallback, useMemo, useState, type ReactNode } from "react"
import { Calendar } from "lucide-react"

import ScheduleMatrixRoute from "@/routes/ScheduleMatrixRoute"
import FixedOffHolidayBtn from "@/components/Schedule/FixedOffHolidayBtn"
import { PageHeader } from "@/components/PageHeader"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { DayPlaceSummary, ExpectedByDay, Staff } from "@/types"
import type { Cell } from "@/utils/mergeCellIndex"

type StaffSummary = {
  counts: Record<string, number>
  credit: number
  dayCount: number
  nightCount: number
}

export interface SchedulePageProps {
  year: number
  month: number
  loadingGen: boolean
  onGenerate: () => Promise<unknown> | unknown
  onValidate: () => Promise<unknown> | unknown
  onExport: () => void
  exporting: boolean
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
  legend?: ReactNode
  staffLoading?: boolean
  fillHC: boolean
  onToggleFillHC: (checked: boolean) => void
  onRefreshFixedData: () => Promise<void> | void
  conflictCount: number
  hasLeaderDup: boolean
  leaderErrorsCount: number
  // Merged features from CalendarHeader
  onYearChange?: (year: number) => void
  onMonthChange?: (month: number) => void
  onShuffle?: () => void
  onSave?: () => void
  onResetSoft?: () => void
  onResetHard?: () => void
}

export default function SchedulePage({
  year,
  month,
  loadingGen,
  onGenerate,
  onValidate,
  onExport,
  exporting,
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
  legend,
  staffLoading = false,
  fillHC,
  onToggleFillHC,
  onRefreshFixedData,
  conflictCount,
  hasLeaderDup,
  leaderErrorsCount,
  onYearChange,
  onMonthChange,
  onShuffle,
  onSave,
  onResetSoft,
  onResetHard,
}: SchedulePageProps) {
  const [isValidating, setIsValidating] = useState(false)

  const handleGenerate = useCallback(() => {
    if (loadingGen) {
      return
    }
    void onGenerate()
  }, [loadingGen, onGenerate])

  const handleValidate = useCallback(async () => {
    if (loadingGen || isValidating) {
      return
    }
    try {
      setIsValidating(true)
      await Promise.resolve(onValidate())
    } finally {
      setIsValidating(false)
    }
  }, [isValidating, loadingGen, onValidate])

  const handleExport = useCallback(() => {
    if (exporting) {
      return
    }
    onExport()
  }, [exporting, onExport])

  const autoFillHintId = "schedule-auto-fill-hc"

  const primaryActions = useMemo(
    () => (
      <FixedOffHolidayBtn
        year={year}
        month={month}
        aria-label="Fixed / Off / Holiday"
        onRefresh={async () => {
          await Promise.resolve(onRefreshFixedData())
        }}
      />
    ),
    [month, onRefreshFixedData, year],
  )

  const toolbar = useMemo(
    () => (
      <>
        <div className="flex flex-wrap items-center gap-3 rounded-full border border-white/40 bg-white/70 px-4 py-2 text-sm text-muted-foreground shadow-[0_12px_26px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_12px_26px_rgba(0,0,0,0.35)]">
          <Switch
            id="auto-fill-hc"
            checked={fillHC}
            onCheckedChange={onToggleFillHC}
            aria-describedby={autoFillHintId}
          />
          <Label htmlFor="auto-fill-hc" className="text-sm font-medium text-foreground">
            Tự động bù HC
          </Label>
          <span id={autoFillHintId} className="sr-only">
            Bật để tự động bù ca hành chính khi sinh hoặc xáo lịch.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{conflictCount} cảnh báo</span>
          <span>{hasLeaderDup ? "Trùng trưởng ca" : "Không trùng trưởng ca"}</span>
          <span>{leaderErrorsCount} ngày thiếu trưởng ca</span>
        </div>
      </>
    ),
    [conflictCount, fillHC, hasLeaderDup, leaderErrorsCount, onToggleFillHC],
  )

  return (
    <>
      <PageHeader
        icon={Calendar}
        tagline="Schedule Management"
        title="Schedule Management"
        description="Tăng tốc quy trình làm việc với trải nghiệm lấy cảm hứng từ iOS/macOS."
      />
      <ScheduleMatrixRoute
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
        toolbarActions={toolbar}
        legend={legend}
        staffLoading={staffLoading}
        extraPrimaryActions={primaryActions}
        onExport={handleExport}
        onValidate={handleValidate}
        onGenerate={handleGenerate}
        exporting={exporting}
        validating={isValidating}
        generating={loadingGen}
        onYearChange={onYearChange}
        onMonthChange={onMonthChange}
        onShuffle={onShuffle}
        onSave={onSave}
        onResetSoft={onResetSoft}
        onResetHard={onResetHard}
      />
    </>
  )
}
