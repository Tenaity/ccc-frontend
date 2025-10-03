import React, { lazy, Suspense, useMemo, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useExportCsv } from "@/hooks/useExportCsv"
import { useScheduleData } from "@/hooks/useScheduleData"
import { useToast } from "@/components/ui/use-toast"
import Legend from "@/components/Legend"
import { cn } from "@/lib/utils"
import { hasMonthConfig } from "@/lib/api"

import DashboardPage from "./pages/Dashboard"

const SchedulePage = lazy(() => import("./pages/Schedule"))
const ChatbotCRUDPage = lazy(() => import("./pages/ChatbotCRUD"))
const ChatbotUploadPage = lazy(() => import("./pages/ChatbotUpload"))
const ChatbotChunkingPage = lazy(() => import("./pages/ChatbotChunking"))
const ConfigPage = lazy(() => import("./pages/Config"))

const MAIN_CONTENT_ID = "app-main-content"

export default function App() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [monthConfigMissing, setMonthConfigMissing] = useState(false)
  const { toast } = useToast()

  const handleSkipToContent = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      if (typeof document === "undefined") {
        return
      }

      const main = document.getElementById(MAIN_CONTENT_ID)
      if (!(main instanceof HTMLElement)) {
        return
      }

      if (typeof main.focus === "function") {
        main.focus({ preventScroll: true })
      }
      if (typeof main.scrollIntoView === "function") {
        main.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      if (typeof window !== "undefined" && MAIN_CONTENT_ID) {
        window.location.hash = `#${MAIN_CONTENT_ID}`
      }
    },
    []
  )

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

  const scheduleLegend = (
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

  React.useEffect(() => {
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

  const handleExport = React.useCallback(() => {
    void exportCsv(year, month)
  }, [exportCsv, year, month])

  const handleValidate = React.useCallback(async () => {
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

  const handleGenerate = React.useCallback(async () => {
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
  const handleToggleFillHC = React.useCallback(
    (checked: boolean) => {
      setFillHC(checked)
    },
    [setFillHC],
  )

  const handleRefreshFixedData = React.useCallback(async () => {
    await fetchFixed()
    await fetchOffdays()
    await fetchHolidays()
  }, [fetchFixed, fetchOffdays, fetchHolidays])

  // CalendarHeader handlers wired to schedule APIs
  const handleShuffle = React.useCallback(async () => {
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

  const handleSave = React.useCallback(async () => {
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

  const handleResetSoft = React.useCallback(async () => {
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

  const handleResetHard = React.useCallback(async () => {
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

  return (
    <SidebarProvider>
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        href={`#${MAIN_CONTENT_ID}`}
        onClick={handleSkipToContent}
      >
        Bỏ qua tới nội dung chính
      </a>
      <AppSidebar />
      <SidebarInset
        className={cn(
          "relative flex min-h-screen flex-1 flex-col",
          "bg-gradient-to-br from-sky-100/70 via-white/80 to-pink-100/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.2),transparent_50%),linear-gradient(180deg,rgba(255,255,255,0.85)0%,rgba(255,255,255,0.6)45%,rgba(255,255,255,0.78)100%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.18),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(190,24,93,0.22),transparent_55%),linear-gradient(180deg,rgba(3,7,18,0.92)0%,rgba(3,7,18,0.7)45%,rgba(3,7,18,0.82)100%)]" aria-hidden="true" />
        <div className="relative z-10 flex-1">
          <Suspense
            fallback={
              <div className="mx-auto w-full max-w-[1400px] px-6">
                <div className="flex justify-center py-10" aria-live="polite">
                  <span className="text-sm text-muted-foreground">
                    Đang tải nội dung…
                  </span>
                </div>
              </div>
            }
          >
            <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-6 py-6">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route
                  path="/schedule"
                  element={
                    <SchedulePage
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
                      matrixLoading={matrixLoading}
                      matrixError={matrixError}
                      fetchStaff={fetchStaff}
                      staffLoading={loadingStaff}
                      onExport={handleExport}
                      onValidate={handleValidate}
                      onGenerate={handleGenerate}
                      exporting={isExporting}
                      loadingGen={loadingGen}
                      legend={scheduleLegend}
                      fillHC={fillHC}
                      onToggleFillHC={handleToggleFillHC}
                      onRefreshFixedData={handleRefreshFixedData}
                      conflictCount={conflictCount}
                      hasLeaderDup={hasLeaderDup}
                      leaderErrorsCount={leaderErrors.length}
                      monthConfigMissing={monthConfigMissing}
                      onYearChange={setYear}
                      onMonthChange={setMonth}
                      onShuffle={handleShuffle}
                      onSave={handleSave}
                      onResetSoft={handleResetSoft}
                      onResetHard={handleResetHard}
                    />
                  }
                />
                <Route path="/config" element={<ConfigPage />} />
                <Route path="/chatbot" element={<ChatbotCRUDPage />} />
                <Route path="/chatbot/upload" element={<ChatbotUploadPage />} />
                <Route path="/chatbot/chunking" element={<ChatbotChunkingPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
