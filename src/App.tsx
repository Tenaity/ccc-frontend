import React, { lazy, Suspense, useMemo, useState } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import { matchRoute } from "@/app/routes"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useExportCsv } from "@/hooks/useExportCsv"
import { useScheduleData } from "@/hooks/useScheduleData"
import { useToast } from "@/components/ui/use-toast"
import Legend from "@/components/Legend"

import DashboardPage from "./pages/Dashboard"
import FixedOffHolidayBtn from "./components/schedule/FixedOffHolidayBtn"

const ScheduleMatrixRoute = lazy(
  () => import("./routes/ScheduleMatrixRoute"),
)

const MAIN_CONTENT_ID = "app-main-content"

export default function App() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [isValidating, setIsValidating] = useState(false)
  const { toast } = useToast()
  const location = useLocation()
  const routeMeta = matchRoute(location.pathname) ?? matchRoute("/")!
  const scheduleEnabled = routeMeta.path === "/schedule"

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

  const breadcrumbs = useMemo(() => {
    if (routeMeta.path === "/") {
      return [{ label: routeMeta.label }]
    }

    return [
      { label: "Dashboard", href: "/" },
      { label: routeMeta.label },
    ]
  }, [routeMeta.label, routeMeta.path])

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

  const handleExport = React.useCallback(() => {
    void exportCsv(year, month)
  }, [exportCsv, year, month])

  const handleValidate = React.useCallback(async () => {
    if (isValidating) {
      return
    }

    setIsValidating(true)
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
    } finally {
      setIsValidating(false)
    }
  }, [fetchValidate, isValidating, toast])

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

  const autoFillHintId = "auto-fill-hc-hint"

  const handleToggleFillHC = React.useCallback(
    (checked: boolean) => {
      setFillHC(checked)
    },
    [setFillHC],
  )

  const schedulePrimaryActions = (
    <FixedOffHolidayBtn
      year={year}
      month={month}
      aria-label="Fixed / Off / Holiday"
      onRefresh={async () => {
        await fetchFixed()
        await fetchOffdays()
        await fetchHolidays()
      }}
    />
  )

  const scheduleToolbar = (
    <>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Switch
          id="auto-fill-hc"
          checked={fillHC}
          onCheckedChange={handleToggleFillHC}
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
        <span>{leaderErrors.length} ngày thiếu trưởng ca</span>
        {legend}
      </div>
    </>
  )

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
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
      >
        <SiteHeader
          title={routeMeta.label}
          description={routeMeta.description}
          breadcrumbs={breadcrumbs}
        />
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
          <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-3 pb-10 md:px-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route
                path="/schedule"
                element={
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
                    staffLoading={loadingStaff}
                    onExport={handleExport}
                    onValidate={handleValidate}
                    onGenerate={handleGenerate}
                    exporting={isExporting}
                    validating={isValidating}
                    generating={loadingGen}
                    extraPrimaryActions={schedulePrimaryActions}
                    toolbarActions={scheduleToolbar}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Suspense>

      </SidebarInset>
    </SidebarProvider>
  )
}
