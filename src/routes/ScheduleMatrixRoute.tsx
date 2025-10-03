import { type ReactNode, useMemo, useState } from "react"

import { DownloadIcon, Sparkles, CheckCircle2, Loader2, BarChart3, ShuffleIcon, DatabaseIcon, Settings2, CalendarDays, Users2, TrendingUp } from "lucide-react"

import MatrixTable from "@/components/Schedule/MatrixTable"
import { GlassPanel, GlassBadge, GlassButton } from "@/components/ui/glass"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type ScheduleMatrixRouteProps = Omit<
  React.ComponentProps<typeof MatrixTable>,
  "showAdvanced"
> & {
  toolbarActions?: ReactNode
  extraPrimaryActions?: ReactNode
  staffLoading?: boolean
  onExport: () => void
  onValidate: () => void
  onGenerate: () => void
  exporting?: boolean
  validating?: boolean
  generating?: boolean
  legend?: ReactNode
  // Merged CalendarHeader props
  onYearChange?: (year: number) => void
  onMonthChange?: (month: number) => void
  onShuffle?: () => void
  onSave?: () => void
  onResetSoft?: () => void
  onResetHard?: () => void
}

export default function ScheduleMatrixRoute({
  toolbarActions,
  extraPrimaryActions,
  staffLoading = false,
  onExport,
  onValidate,
  onGenerate,
  exporting = false,
  validating = false,
  generating = false,
  legend,
  onYearChange,
  onMonthChange,
  onShuffle,
  onSave,
  onResetSoft,
  onResetHard,
  ...matrixProps
}: ScheduleMatrixRouteProps) {

  const staffSummary = staffLoading
    ? "Đang tải nhân sự…"
    : `${matrixProps.staff.length} nhân sự`

  const [showAdvanced, setShowAdvanced] = useState(false)

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), [])
  const yearOptions = useMemo(() => {
    const start = matrixProps.year - 2
    return Array.from({ length: 5 }, (_, i) => start + i)
  }, [matrixProps.year])
  const monthLabel = useMemo(
    () => `${String(matrixProps.month).padStart(2, "0")}/${matrixProps.year}`,
    [matrixProps.month, matrixProps.year],
  )

  // Calculate stats
  const totalDays = matrixProps.days.length
  const totalStaff = matrixProps.staff.length
  const totalAssignments = matrixProps.assignmentIndex.size

  return (
    <div className="w-full space-y-6">
      <section aria-labelledby="schedule-heading" className="space-y-6">
        <h2 id="schedule-heading" className="sr-only">
          Schedule Management
        </h2>
        <div data-testid="schedule-body" className="space-y-6">
          {/* Premium Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassPanel variant="strong" className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng ngày làm việc</p>
                  <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                    {totalDays}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30">
                  <CalendarDays className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
              </div>
            </GlassPanel>

            <GlassPanel variant="strong" className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng nhân sự</p>
                  <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {staffLoading ? "..." : totalStaff}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                  <Users2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </GlassPanel>

            <GlassPanel variant="strong" className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng phân ca</p>
                  <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {totalAssignments}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </GlassPanel>
          </div>

          <GlassPanel variant="strong" className="flex flex-col gap-6 p-6">
            {/* Enhanced Year/Month Selectors Row */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                  Chọn kỳ lịch
                </h3>
                <p className="text-sm text-muted-foreground">
                  Điều chỉnh năm và tháng để xem lịch trực
                </p>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="year-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Năm
                  </Label>
                  <Input
                    id="year-input"
                    type="number"
                    inputMode="numeric"
                    value={matrixProps.year}
                    onChange={(e) => onYearChange?.(Number(e.target.value))}
                    className={cn(
                      "h-11 w-28 rounded-xl font-semibold",
                      "bg-white/80 dark:bg-slate-900/80",
                      "border-slate-200/60 dark:border-slate-800/60",
                      "focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
                    )}
                    disabled={generating || validating}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="month-select" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tháng
                  </Label>
                  <Select
                    value={String(matrixProps.month)}
                    onValueChange={(value) => onMonthChange?.(Number(value))}
                    disabled={generating || validating}
                  >
                    <SelectTrigger id="month-select"
                      className={cn(
                        "h-11 w-32 rounded-xl",
                        "bg-white/80 dark:bg-slate-900/80",
                        "border-slate-200/60 dark:border-slate-800/60",
                        "focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
                      )}
                    >
                      <SelectValue placeholder="Chọn tháng" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m} value={String(m)}>
                          Tháng {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="year-select" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Năm gần đây
                  </Label>
                  <Select
                    value={String(matrixProps.year)}
                    onValueChange={(value) => onYearChange?.(Number(value))}
                    disabled={generating || validating}
                  >
                    <SelectTrigger id="year-select" className={cn(
                      "h-11 w-36 rounded-xl",
                      "bg-white/80 dark:bg-slate-900/80",
                      "border-slate-200/60 dark:border-slate-800/60",
                      "focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
                    )}>
                      <SelectValue placeholder="Chọn năm" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-3">
                  <GlassBadge variant="primary" className="gap-2.5 px-5 py-2.5">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Kỳ trực</span>
                    <span className="text-lg font-bold">{monthLabel}</span>
                  </GlassBadge>
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel variant="strong" className="flex flex-col gap-6 p-6">
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                Thao tác lịch trực
              </h3>
              <p className="text-sm text-muted-foreground">
                Generate, validate và quản lý lịch trực
              </p>
            </div>

            {/* Action Buttons Row 1: Preview Actions */}
            <div className="flex w-full flex-wrap gap-4">
              <GlassButton
                variant="secondary"
                size="lg"
                onClick={onGenerate}
                disabled={generating || validating}
                data-testid="schedule-generate"
                className={cn(
                  "flex-1 min-w-[140px]",
                  !generating && !validating && "shadow-lg shadow-indigo-500/20"
                )}
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                )}
                {generating ? "Đang tạo..." : "Generate"}
              </GlassButton>
              {onShuffle && (
                <GlassButton
                  variant="outline"
                  size="lg"
                  onClick={onShuffle}
                  disabled={generating || validating}
                  className="flex-1 min-w-[140px] hover:border-purple-400/50"
                >
                  <ShuffleIcon className="h-4 w-4" aria-hidden="true" />
                  Shuffle
                </GlassButton>
              )}
              <GlassButton
                variant="primary"
                size="lg"
                onClick={onValidate}
                disabled={generating || validating}
                data-testid="schedule-validate"
                className={cn(
                  "flex-1 min-w-[140px]",
                  !generating && !validating && "shadow-lg shadow-sky-500/25"
                )}
              >
                {validating ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                )}
                {validating ? "Đang kiểm tra..." : "Validate"}
              </GlassButton>
            </div>

            {/* Action Buttons Row 2: Management & Export */}
            <div className="flex w-full flex-wrap gap-4">
              {onSave && (
                <GlassButton
                  variant="outline"
                  size="lg"
                  onClick={onSave}
                  disabled={generating || validating}
                  className="flex-1 min-w-[120px] hover:border-emerald-400/50"
                >
                  <DatabaseIcon className="h-4 w-4" aria-hidden="true" />
                  Lưu lịch
                </GlassButton>
              )}
              {onResetSoft && onResetHard && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <GlassButton
                      variant="outline"
                      size="lg"
                      disabled={generating || validating}
                      className="flex-1 min-w-[120px] hover:border-amber-400/50"
                    >
                      <Settings2 className="h-4 w-4" aria-hidden="true" />
                      Reset
                    </GlassButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Reset lịch</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={onResetSoft}>
                      Reset lịch (soft)
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={onResetHard}>
                      Reset DB (hard)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <GlassButton
                variant="outline"
                size="lg"
                onClick={onExport}
                disabled={exporting}
                data-testid="schedule-export"
                className="flex-1 min-w-[140px] hover:border-sky-400/50"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <DownloadIcon className="h-4 w-4" aria-hidden="true" />
                )}
                {exporting ? "Đang xuất..." : "Export CSV"}
              </GlassButton>
              {extraPrimaryActions ? (
                <div className="flex flex-wrap gap-4">
                  {extraPrimaryActions}
                </div>
              ) : null}
              <GlassButton
                type="button"
                variant={showAdvanced ? "secondary" : "outline"}
                size="lg"
                onClick={() => setShowAdvanced((prev) => !prev)}
                className={cn(
                  "flex-1 min-w-[180px]",
                  showAdvanced ? "shadow-md shadow-indigo-500/15" : "hover:border-indigo-400/50"
                )}
              >
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                {showAdvanced ? "Ẩn thống kê" : "Hiện thống kê"}
              </GlassButton>
            </div>
          </GlassPanel>

          {toolbarActions ? (
            <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:flex-wrap md:items-center md:justify-between">
              {toolbarActions}
            </div>
          ) : null}

          {legend ? (
            <GlassPanel variant="strong" className="p-5">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-foreground">Legend</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Chú thích ký hiệu ca làm việc</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {legend}
              </div>
            </GlassPanel>
          ) : null}

          {/* Matrix Table with enhanced glass card */}
          <MatrixTable
            {...matrixProps}
            withCard={false}
            containerClassName="rounded-xl bg-white/70 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:bg-slate-950/70 dark:shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
            showAdvanced={showAdvanced}
          />
        </div>
      </section>
    </div>
  )
}
