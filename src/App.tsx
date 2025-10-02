import React, { lazy, Suspense, useMemo, useState } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import { matchRoute } from "@/app/routes"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useExportCsv } from "@/hooks/useExportCsv"
import { useScheduleData } from "@/hooks/useScheduleData"
import { useToast } from "@/components/ui/use-toast"
import Legend from "@/components/Legend"
import { cn } from "@/lib/utils"

import DashboardPage from "./pages/Dashboard"

const SchedulePage = lazy(() => import("./pages/Schedule"))
const ChatbotCRUDPage = lazy(() => import("./pages/ChatbotCRUD"))
const ChatbotUploadPage = lazy(() => import("./pages/ChatbotUpload"))
const ChatbotChunkingPage = lazy(() => import("./pages/ChatbotChunking"))

const MAIN_CONTENT_ID = "app-main-content"

export default function App() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const { toast } = useToast()
  const location = useLocation()
  const routeMeta = matchRoute(location.pathname) ?? matchRoute("/")!
  const scheduleEnabled = routeMeta.path === "/schedule"
  const RouteIcon = routeMeta.icon
  const heroTitle = routeMeta.path === "/schedule" ? "Schedule Management" : routeMeta.label
  const heroTagline = routeMeta.path === "/" ? "Operational Overview" : routeMeta.label
  const heroDescription = routeMeta.description ?? "Tăng tốc quy trình làm việc với trải nghiệm lấy cảm hứng từ iOS/macOS."

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
    fetchStaff,
    fetchFixed,
    fetchOffdays,
    fetchHolidays,
    fetchValidate,
    leaderErrors,
    fillHC,
    setFillHC,
  } = useScheduleData(year, month, { enabled: scheduleEnabled })

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
          <header
            className={cn(
              "sticky top-0 z-40 -mx-3 px-3 py-6 md:-mx-6 md:px-6",
              "backdrop-blur-3xl backdrop-saturate-150",
              "transition-all duration-300"
            )}
          >
            <div
              className={cn(
                "mx-auto flex w-full max-w-[1400px] flex-col gap-5",
                "rounded-3xl border border-white/40 bg-white/80 p-6 shadow-[0_28px_90px_rgba(56,189,248,0.15)]",
                "dark:border-white/10 dark:bg-slate-950/75 dark:shadow-[0_28px_90px_rgba(190,24,93,0.35)]"
              )}
            >
              <div className="flex flex-wrap items-center gap-4">
                {RouteIcon ? (
                  <span
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                      "bg-gradient-to-br from-sky-500 via-indigo-500 to-pink-500",
                      "shadow-[0_18px_36px_rgba(99,102,241,0.28)]"
                    )}
                  >
                    <RouteIcon className="h-7 w-7 text-white" aria-hidden="true" />
                  </span>
                ) : null}
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500/80 dark:text-indigo-300/70">
                    {heroTagline}
                  </span>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {heroTitle}
                  </h1>
                  <p className="max-w-3xl text-sm text-muted-foreground/90 md:text-base">
                    {heroDescription}
                  </p>
                </div>
              </div>
            </div>
          </header>
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-[1400px] px-3 md:px-6">
              <div className="flex justify-center py-10" aria-live="polite">
                <span className="text-sm text-muted-foreground">
                  Đang tải nội dung…
                </span>
              </div>
            </div>
          }
        >
          <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-3 pb-10 pt-4 md:px-6">
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
                  />
                }
              />
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
