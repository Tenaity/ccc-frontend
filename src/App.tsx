import React, { lazy, Suspense, useMemo, useState } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import { matchRoute } from "@/app/routes"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useExportCsv } from "@/hooks/useExportCsv"
import { useScheduleData } from "@/hooks/useScheduleData"
import { useToast } from "@/components/ui/use-toast"
import Legend from "@/components/Legend"

import DashboardPage from "./pages/Dashboard"

const SchedulePage = lazy(() => import("./pages/Schedule"))
const FixedOffPanel = lazy(() => import("./components/fixed-off/FixedOffPanel"))

export default function App() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [showFixedOff, setShowFixedOff] = useState(false)
  const { toast } = useToast()
  const location = useLocation()

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
  } = useScheduleData(year, month)

  const { exportCsv, isExporting } = useExportCsv()

  const monthLabel = useMemo(
    () => `${String(month).padStart(2, "0")}/${year}`,
    [month, year]
  )

  const headerActions = useMemo(
    () => (
      <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground sm:text-sm">
        <span>Tháng hiện tại: {monthLabel}</span>
        <span>{staff.length} nhân sự</span>
      </div>
    ),
    [monthLabel, staff.length]
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

  const routeMeta = matchRoute(location.pathname) ?? matchRoute("/")!

  const openFixedOffPanel = React.useCallback(() => {
    setShowFixedOff(true)
  }, [setShowFixedOff])

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

  const autoFillHintId = "auto-fill-hc-hint"

  const handleToggleFillHC = React.useCallback(
    (checked: boolean) => {
      setFillHC(checked)
    },
    [setFillHC],
  )

  const scheduleToolbar = (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={openFixedOffPanel}
        aria-haspopup="dialog"
      >
        Fixed / Off / Holiday
      </Button>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
      <AppSidebar />
      <SidebarInset>
        <SiteHeader
          title={routeMeta.label}
          description={routeMeta.description}
          actions={headerActions}
        />
        <main className="flex flex-1 flex-col gap-6 pb-10">
          <Suspense
            fallback={
              <div className="flex justify-center py-10" aria-live="polite">
                <span className="text-sm text-muted-foreground">
                  Đang tải nội dung…
                </span>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route
                path="/schedule"
                element={
                  <SchedulePage
                    year={year}
                    month={month}
                    loadingGen={loadingGen}
                    onGenerate={handleGenerate}
                    onValidate={handleValidate}
                    onExport={handleExport}
                    exporting={isExporting}
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
                    toolbarActions={scheduleToolbar}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Suspense>
          {showFixedOff ? (
            <FixedOffPanel
              year={year}
              month={month}
              open={showFixedOff}
              onClose={() => setShowFixedOff(false)}
              onExportCsv={handleExport}
              exporting={isExporting}
              onToast={(message, options) =>
                toast({
                  description: message,
                  ...options,
                })
              }
              onRefresh={async () => {
                await fetchFixed()
                await fetchOffdays()
                await fetchHolidays()
              }}
            />
          ) : null}
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
