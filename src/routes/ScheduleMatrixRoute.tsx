import { type ReactNode, useMemo } from "react"

import MatrixTable from "@/components/schedule/MatrixTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ButtonGroup } from "@/components/ui/button-group"

function StatCard({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <Card className="border-border/50 bg-muted/40 shadow-none">
      <CardContent className="flex flex-col gap-1 rounded-2xl p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="text-base font-semibold text-foreground">{value}</span>
      </CardContent>
    </Card>
  )
}

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

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="schedule-heading" className="space-y-6">
        <header data-testid="schedule-header">
          <h2
            id="schedule-heading"
            className="text-lg font-semibold text-foreground sm:text-xl"
          >
            Schedule
          </h2>
        </header>

        <div data-testid="schedule-body" className="space-y-6">
          <div className="space-y-5 rounded-3xl border border-border/60 bg-card p-4 shadow-sm sm:p-6">
            <p className="text-sm text-muted-foreground">
              Ma trận phân ca cho tháng {monthLabel}. Theo dõi nhanh trạng thái ca
              và cảnh báo vi phạm.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard label="Tháng hiện tại" value={monthLabel} />
              <StatCard label="Số nhân sự" value={staffSummary} />
            </div>
            {legend ? (
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {legend}
              </div>
            ) : null}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <ButtonGroup className="w-full justify-between gap-1 sm:justify-start lg:w-auto">
                <Button
                  variant="secondary"
                  onClick={onExport}
                  disabled={exporting}
                  data-testid="schedule-export"
                  className="flex-1 sm:flex-none"
                >
                  {exporting ? "Đang xuất..." : "Export CSV"}
                </Button>
                <Button
                  variant="outline"
                  onClick={onValidate}
                  disabled={generating || validating}
                  data-testid="schedule-validate"
                  className="flex-1 sm:flex-none"
                >
                  {validating ? "Đang kiểm tra..." : "Validate"}
                </Button>
                <Button
                  onClick={onGenerate}
                  disabled={generating}
                  data-testid="schedule-generate"
                  className="flex-1 sm:flex-none"
                >
                  {generating ? "Đang tạo..." : "Generate"}
                </Button>
              </ButtonGroup>
              {extraPrimaryActions ? (
                <div className="flex w-full justify-start gap-2 lg:w-auto lg:justify-end">
                  {extraPrimaryActions}
                </div>
              ) : null}
            </div>
            {toolbarActions ? (
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                {toolbarActions}
              </div>
            ) : null}
          </div>

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
