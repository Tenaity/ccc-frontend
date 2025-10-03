import { useCallback, useMemo, useState, type ReactNode } from "react"
import { Calendar, AlertTriangle, Users, AlertCircle, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"

import ScheduleMatrixRoute from "@/routes/ScheduleMatrixRoute"
import FixedOffHolidayBtn from "@/components/Schedule/FixedOffHolidayBtn"
import { PageHeader } from "@/components/PageHeader"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GlassPanel, GlassBadge } from "@/components/ui/glass"
import { cn } from "@/lib/utils"
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
  monthConfigMissing?: boolean
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
  monthConfigMissing = false,
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
        <GlassPanel variant="strong" className="px-5 py-3">
          <div className="flex items-center gap-3">
            <Switch
              id="auto-fill-hc"
              checked={fillHC}
              onCheckedChange={onToggleFillHC}
              aria-describedby={autoFillHintId}
            />
            <Label htmlFor="auto-fill-hc" className="text-sm font-semibold text-foreground cursor-pointer">
              Tự động bù HC
            </Label>
            <span id={autoFillHintId} className="sr-only">
              Bật để tự động bù ca hành chính khi sinh hoặc xáo lịch.
            </span>
          </div>
        </GlassPanel>
        <div className="flex flex-wrap items-center gap-3">
          <GlassBadge
            variant={conflictCount > 0 ? "destructive" : "success"}
            className="gap-2"
          >
            {conflictCount > 0 ? (
              <AlertTriangle className="h-3.5 w-3.5" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            <span className="font-semibold">{conflictCount}</span>
            <span className="text-xs">cảnh báo</span>
          </GlassBadge>
          <GlassBadge
            variant={hasLeaderDup ? "warning" : "success"}
            className="gap-2"
          >
            {hasLeaderDup ? (
              <AlertCircle className="h-3.5 w-3.5" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            <span className="text-xs">{hasLeaderDup ? "Trùng trưởng ca" : "Không trùng trưởng ca"}</span>
          </GlassBadge>
          <GlassBadge
            variant={leaderErrorsCount > 0 ? "destructive" : "info"}
            className="gap-2"
          >
            <Users className="h-3.5 w-3.5" />
            <span className="font-semibold">{leaderErrorsCount}</span>
            <span className="text-xs">ngày thiếu trưởng ca</span>
          </GlassBadge>
        </div>
      </>
    ),
    [conflictCount, fillHC, hasLeaderDup, leaderErrorsCount, onToggleFillHC],
  )

  return (
    <>
      <PageHeader
        icon={Calendar}
        tagline="Smart Scheduling System"
        title="Schedule Matrix Manager"
        description="Quản lý lịch trực thông minh với AI-powered optimization và real-time validation"
      />
      {monthConfigMissing ? (
        <Alert variant="warning" className="max-w-3xl">
          <AlertTitle>Please configure month plan</AlertTitle>
          <AlertDescription>
            Lịch trực tháng này chưa có cấu hình.
            {' '}
            <Link to="/config" className="font-semibold underline">
              Mở thiết lập tháng
            </Link>
            .
          </AlertDescription>
        </Alert>
      ) : null}
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
