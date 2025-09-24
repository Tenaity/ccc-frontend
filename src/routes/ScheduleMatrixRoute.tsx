import { type ReactNode, useMemo } from "react"

import { DownloadIcon } from "lucide-react"

import MatrixTable from "@/components/schedule/MatrixTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export type ScheduleMatrixRouteProps = React.ComponentProps<
  typeof MatrixTable
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
  intro?: ReactNode
  description?: string
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
  intro,
  description,
  ...matrixProps
}: ScheduleMatrixRouteProps) {
  const monthLabel = useMemo(
    () => `${String(matrixProps.month).padStart(2, "0")}/${matrixProps.year}`,
    [matrixProps.month, matrixProps.year],
  )

  const staffSummary = staffLoading
    ? "Đang tải nhân sự…"
    : `${matrixProps.staff.length} nhân sự`

  const headingDescription =
    description ?? "Quản lý lịch phân ca dạng ma trận"

  const actionButtonClass =
    "h-10 px-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 px-3 pb-10 md:px-6">
      <section aria-labelledby="schedule-heading" className="space-y-6">
        <header data-testid="schedule-header" className="space-y-2">
          {intro ? <div className="text-sm">{intro}</div> : null}
          <div className="space-y-1">
            <h1
              id="schedule-heading"
              className="text-xl font-semibold text-foreground"
            >
              Schedule
            </h1>
            <p className="text-sm text-muted-foreground">{headingDescription}</p>
          </div>
        </header>

        <div data-testid="schedule-body" className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Tháng hiện tại: {monthLabel}</span>
              <span>{staffSummary}</span>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end md:w-auto md:items-center">
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={onExport}
                  disabled={exporting}
                  data-testid="schedule-export"
                  className={actionButtonClass}
                >
                  <DownloadIcon className="h-4 w-4" aria-hidden="true" />
                  {exporting ? "Đang xuất..." : "Export CSV"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={onGenerate}
                  disabled={generating}
                  data-testid="schedule-generate"
                  className={actionButtonClass}
                >
                  {generating ? "Đang tạo..." : "Generate"}
                </Button>
                <Button
                  onClick={onValidate}
                  disabled={generating || validating}
                  data-testid="schedule-validate"
                  className={actionButtonClass}
                >
                  {validating ? "Đang kiểm tra..." : "Validate"}
                </Button>
              </div>
              {extraPrimaryActions ? (
                <div className="flex flex-wrap justify-end gap-2">
                  {extraPrimaryActions}
                </div>
              ) : null}
            </div>
          </div>

          {toolbarActions ? (
            <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:flex-wrap md:items-center md:justify-between">
              {toolbarActions}
            </div>
          ) : null}

          {legend ? (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {legend}
            </div>
          ) : null}

          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-0">
              <MatrixTable
                {...matrixProps}
                withCard={false}
                containerClassName="rounded-none border-0 bg-transparent shadow-none"
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
