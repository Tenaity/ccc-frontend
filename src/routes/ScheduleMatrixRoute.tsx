import { type ReactNode, useMemo, useState } from "react"

import { DownloadIcon, Sparkles, CheckCircle2, Loader2, BarChart3 } from "lucide-react"

import MatrixTable from "@/components/Schedule/MatrixTable"
import { GlassPanel, GlassBadge, GlassButton } from "@/components/ui/glass"
import { cn } from "@/lib/utils"

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
  ...matrixProps
}: ScheduleMatrixRouteProps) {
  const monthLabel = useMemo(
    () => `${String(matrixProps.month).padStart(2, "0")}/${matrixProps.year}`,
    [matrixProps.month, matrixProps.year],
  )

  const staffSummary = staffLoading
    ? "Đang tải nhân sự…"
    : `${matrixProps.staff.length} nhân sự`

  const [showAdvanced, setShowAdvanced] = useState(false)

  const actionButtonClass =
    "h-11 rounded-ios-lg px-5 font-semibold shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:shadow-lg"

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8 px-4 pb-12 md:px-8">
      <section aria-labelledby="schedule-heading" className="space-y-8">
        <h2 id="schedule-heading" className="sr-only">
          Schedule Management
        </h2>
        <div data-testid="schedule-body" className="space-y-10">
          <GlassPanel variant="strong" className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <GlassBadge variant="primary" className="gap-3 px-5 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider">Tháng</span>
                <span className="text-base font-bold">{monthLabel}</span>
              </GlassBadge>
              <GlassBadge variant="info" className="gap-3 px-5 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider">Nhân sự</span>
                <span className="text-base font-bold">{staffSummary}</span>
              </GlassBadge>
            </div>
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-end md:w-auto md:items-center">
              <div className="flex flex-wrap gap-3 sm:justify-end">
                <GlassButton
                  variant="outline"
                  onClick={onExport}
                  disabled={exporting}
                  data-testid="schedule-export"
                  className={cn(
                    actionButtonClass,
                    exporting && "cursor-not-allowed opacity-60"
                  )}
                >
                  {exporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <DownloadIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  {exporting ? "Đang xuất..." : "Export CSV"}
                </GlassButton>
                <GlassButton
                  variant="secondary"
                  onClick={onGenerate}
                  disabled={generating}
                  data-testid="schedule-generate"
                  className={cn(
                    actionButtonClass,
                    generating && "cursor-not-allowed opacity-60"
                  )}
                >
                  {generating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  )}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold text-transparent dark:from-purple-400 dark:to-pink-400">
                    {generating ? "Đang tạo..." : "Generate"}
                  </span>
                </GlassButton>
                <GlassButton
                  variant="primary"
                  onClick={onValidate}
                  disabled={generating || validating}
                  data-testid="schedule-validate"
                  className={cn(
                    actionButtonClass,
                    (generating || validating) && "cursor-not-allowed opacity-60"
                  )}
                >
                  {validating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  {validating ? "Đang kiểm tra..." : "Validate"}
                </GlassButton>
              </div>
              {extraPrimaryActions ? (
                <div className="flex flex-wrap justify-end gap-2">
                  {extraPrimaryActions}
                </div>
              ) : null}
              <GlassButton
                type="button"
                variant={showAdvanced ? "secondary" : "outline"}
                size="md"
                onClick={() => setShowAdvanced((prev) => !prev)}
                className="min-w-[180px] justify-center"
              >
                <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
                {showAdvanced ? "Ẩn thống kê nâng cao" : "Hiện thống kê nâng cao"}
              </GlassButton>
            </div>
          </GlassPanel>

          {toolbarActions ? (
            <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:flex-wrap md:items-center md:justify-between">
              {toolbarActions}
            </div>
          ) : null}

          {legend ? (
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {legend}
            </div>
          ) : null}

          {/* Matrix Table with enhanced glass card */}
          <MatrixTable
            {...matrixProps}
            withCard={false}
            containerClassName="rounded-3xl bg-white/70 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:bg-slate-950/70 dark:shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
            showAdvanced={showAdvanced}
          />
        </div>
      </section>
    </div>
  )
}
