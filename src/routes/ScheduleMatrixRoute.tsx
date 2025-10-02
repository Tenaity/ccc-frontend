import { type ReactNode, useMemo, useState } from "react"

import { DownloadIcon, Sparkles, CheckCircle2, Loader2, BarChart3, ShuffleIcon, DatabaseIcon, Settings2 } from "lucide-react"

import MatrixTable from "@/components/Schedule/MatrixTable"
import { GlassPanel, GlassBadge, GlassButton } from "@/components/ui/glass"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

  return (
    <div className="w-full space-y-6">
      <section aria-labelledby="schedule-heading" className="space-y-6">
        <h2 id="schedule-heading" className="sr-only">
          Schedule Management
        </h2>
        <div data-testid="schedule-body" className="space-y-6">
          <GlassPanel variant="strong" className="flex flex-col gap-6 p-6">
            {/* Year/Month Selectors Row */}
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
                  className="h-10 w-24"
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
                  <SelectTrigger id="month-select" className="h-10 w-28">
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
                  <SelectTrigger id="year-select" className="h-10 w-32">
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
              <GlassBadge variant="info" className="gap-3 px-4 py-2 ml-auto">
                <span className="text-xs font-semibold uppercase tracking-wider">Nhân sự</span>
                <span className="text-base font-bold">{staffSummary}</span>
              </GlassBadge>
            </div>
          </GlassPanel>

          <GlassPanel variant="strong" className="flex flex-col gap-6 p-6">
            {/* Action Buttons Row 1: Preview Actions */}
            <div className="flex w-full flex-wrap gap-4">
              <GlassButton
                variant="secondary"
                size="lg"
                onClick={onGenerate}
                disabled={generating || validating}
                data-testid="schedule-generate"
                className="flex-1 min-w-[140px]"
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
                  className="flex-1 min-w-[140px]"
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
                className="flex-1 min-w-[140px]"
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
                  className="flex-1 min-w-[120px]"
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
                      className="flex-1 min-w-[120px]"
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
                className="flex-1 min-w-[140px]"
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
                className="flex-1 min-w-[180px]"
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
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {legend}
            </div>
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
