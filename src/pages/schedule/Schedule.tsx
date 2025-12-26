import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { Calendar, AlertTriangle, Users, AlertCircle, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"

import ScheduleMatrixRoute from "@/routes/ScheduleMatrixRoute"
import FixedOffHolidayBtn from "@/components/Schedule/FixedOffHolidayBtn"
import { PageHeader } from "@/components/PageHeader"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GlassPanel, GlassBadge } from "@/components/ui/glass"
import Legend from "@/components/Legend"
import { useToast } from "@/components/ui/use-toast"
import { useScheduleData } from "@/hooks/useScheduleData"
import { hasMonthConfig } from "@/lib/api"
import { useExportCsv } from "@/hooks/useExportCsv"

export default function SchedulePage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [monthConfigMissing, setMonthConfigMissing] = useState(false)
  const { toast } = useToast()

  const {
    staff,
    loadingGen,
    loadingStaff,
    staffError,
    validation,
    hasLeaderDup,
    days,
    assignmentIndex,
    summariesByStaffId,
    perDayLeaders,
    perDayByPlace,
    expectedByDay,
    fixedByDayStaff,
    offByDayStaff,
    onGenerate,
    onShuffle,
    onSave,
    onResetSoft,
    onResetHard,
    fetchStaff,
    fetchFixed,
    fetchOffdays,
    fetchHolidays,
    fetchValidate,
    leaderErrors,
    fillHC,
    setFillHC,
  } = useScheduleData(year, month, { enabled: true })

  const { exportCsv, isExporting } = useExportCsv()

  const monthLabel = useMemo(
    () => `${String(month).padStart(2, "0")}/${year}`,
    [month, year]
  )

  const matrixLoading = loadingStaff || (loadingGen && staff.length === 0)
  const matrixError = staffError
  const conflictCount = validation.conflicts.length

  const legend = (
    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
      <Legend label="CA1" bg="#E6F0FF" />
      <Legend label="CA2" bg="#FFE8CC" />
      <Legend label="K" bg="#E6FFEA" />
      <Legend label="HC" bg="#EDEBFF" />
      <Legend label="Đ" bg="#FFE6EA" />
      <Legend label="P" bg="#EEE" />
      <Legend label="T7/CN" bg="#FFF7CC" />
      <Legend label="PGD (đỏ)" bg="#F7D1D1" />
      <Legend label="K trắng (T7)" bg="#FFFFFF" />
      <Legend label="TC ngày (K + 👑, position=TD)" bg="#E6FFEA" />
      <Legend label="TC đêm (Đ + 👑, position=TD & role=TC)" bg="#FFE6EA" />
    </div>
  )

  useEffect(() => {
    let cancelled = false

    const checkMonthConfig = async () => {
      try {
        const exists = await hasMonthConfig(year, month)
        if (!cancelled) {
          setMonthConfigMissing(!exists)
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setMonthConfigMissing(false)
        }
        const message =
          error instanceof Error
            ? error.message
            : "Không thể kiểm tra cấu hình tháng."
        toast({
          variant: "destructive",
          title: "Không kiểm tra được month plan",
          description: message,
        })
      }
    }

    void checkMonthConfig()

    return () => {
      cancelled = true
    }
  }, [month, toast, year])

  const handleExport = useCallback(() => {
    void exportCsv(year, month)
  }, [exportCsv, year, month])

  const handleValidate = useCallback(async () => {
    try {
      const result = await fetchValidate()
      if (result.ok) {
        toast({
          title: "Lịch hợp lệ",
          description: "Không phát hiện xung đột nào.",
        })
      } else {
        const conflicts = result.conflicts.length
        toast({
          variant: "destructive",
          title: "Phát hiện xung đột",
          description: `${conflicts} vấn đề cần xử lý trước khi sinh lịch.`,
        })
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Không thể validate lịch."
      toast({
        variant: "destructive",
        title: "Validate thất bại",
        description: message,
      })
    }
  }, [fetchValidate, toast])

  const handleGenerate = useCallback(async () => {
    try {
      const result = await onGenerate()
      if (!result?.ok) {
        const conflicts = result?.conflicts.length ?? 0
        toast({
          variant: "destructive",
          title: "Sinh lịch thất bại",
          description: `${conflicts} xung đột cần được xử lý trước.`,
        })
        return
      }
      toast({
        title: "Đã sinh lịch tạm thời",
        description: `Đang xem trước tháng ${monthLabel}.`,
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Không thể sinh lịch."
      toast({
        variant: "destructive",
        title: "Sinh lịch thất bại",
        description: message,
      })
    }
  }, [monthLabel, onGenerate, toast])

  const handleToggleFillHC = useCallback(
    (checked: boolean) => {
      setFillHC(checked)
    },
    [setFillHC],
  )

  const handleRefreshFixedData = useCallback(async () => {
    await fetchFixed()
    await fetchOffdays()
    await fetchHolidays()
  }, [fetchFixed, fetchOffdays, fetchHolidays])

  const handleShuffle = useCallback(async () => {
    try {
      const result = await onShuffle()
      if (!result?.ok) {
        const conflicts = result?.conflicts.length ?? 0
        toast({
          variant: "destructive",
          title: "Không thể shuffle",
          description: `${conflicts} xung đột cần xử lý trước khi xáo lịch.`,
        })
        return
      }

      toast({
        title: "Đã shuffle lịch",
        description: `Đang xem trước tháng ${monthLabel}.`,
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Không thể shuffle lịch."
      toast({
        variant: "destructive",
        title: "Shuffle thất bại",
        description: message,
      })
    }
  }, [monthLabel, onShuffle, toast])

  const handleSave = useCallback(async () => {
    try {
      await onSave()
      toast({
        title: "Đã lưu lịch",
        description: `Lịch tháng ${monthLabel} đã được lưu thành công.`,
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu lịch."
      toast({
        variant: "destructive",
        title: "Lưu lịch thất bại",
        description: message,
      })
    }
  }, [monthLabel, onSave, toast])

  const handleResetSoft = useCallback(async () => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn reset lịch (soft)? Tất cả assignment sẽ bị xoá.",
    )
    if (!confirmed) {
      return
    }

    try {
      await onResetSoft()
      toast({
        title: "Đã reset lịch",
        description: "Lịch đã được reset (soft).",
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Không thể reset lịch (soft)."
      toast({
        variant: "destructive",
        title: "Reset soft thất bại",
        description: message,
      })
    }
  }, [onResetSoft, toast])

  const handleResetHard = useCallback(async () => {
    const confirmed = window.confirm(
      "Reset hard sẽ xoá toàn bộ dữ liệu lịch. Bạn có chắc muốn tiếp tục?",
    )
    if (!confirmed) {
      return
    }

    try {
      await onResetHard()
      toast({
        variant: "destructive",
        title: "Đã reset DB",
        description: "Toàn bộ dữ liệu lịch đã được reset (hard).",
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Không thể reset lịch (hard)."
      toast({
        variant: "destructive",
        title: "Reset hard thất bại",
        description: message,
      })
    }
  }, [onResetHard, toast])

  const [isValidating, setIsValidating] = useState(false)

  const autoFillHintId = "schedule-auto-fill-hc"

  const primaryActions = useMemo(
    () => (
      <FixedOffHolidayBtn
        year={year}
        month={month}
        aria-label="Fixed / Off / Holiday"
        onRefresh={async () => {
          await Promise.resolve(handleRefreshFixedData())
        }}
      />
    ),
    [month, handleRefreshFixedData, year],
  )

  const toolbar = useMemo(
    () => (
      <>
        <GlassPanel variant="strong" className="px-5 py-3">
          <div className="flex items-center gap-3">
            <Switch
              id="auto-fill-hc"
              checked={fillHC}
              onCheckedChange={handleToggleFillHC}
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
            variant={leaderErrors.length > 0 ? "destructive" : "info"}
            className="gap-2"
          >
            <Users className="h-3.5 w-3.5" />
            <span className="font-semibold">{leaderErrors.length}</span>
            <span className="text-xs">ngày thiếu trưởng ca</span>
          </GlassBadge>
        </div>
      </>
    ),
    [conflictCount, fillHC, hasLeaderDup, leaderErrors.length, handleToggleFillHC],
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
        staffLoading={loadingStaff}
        extraPrimaryActions={primaryActions}
        onExport={handleExport}
        onValidate={handleValidate}
        onGenerate={handleGenerate}
        exporting={isExporting}
        validating={isValidating}
        generating={loadingGen}
        onYearChange={setYear}
        onMonthChange={setMonth}
        onShuffle={handleShuffle}
        onSave={handleSave}
        onResetSoft={handleResetSoft}
        onResetHard={handleResetHard}
      />
    </>
  )
}
