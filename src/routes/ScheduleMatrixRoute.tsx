import { type ReactNode, useMemo } from "react"

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
        <div className="space-y-1">
          <h2
            id="schedule-heading"
            className="text-lg font-semibold text-foreground sm:text-xl"
          >
            Schedule
          </h2>
          <p className="text-sm text-muted-foreground">
            Ma trận phân ca cho tháng {monthLabel}. Theo dõi nhanh trạng thái ca
            và cảnh báo vi phạm.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <dl className="grid w-full gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tháng hiện tại
                </dt>
                <dd className="text-base font-semibold text-foreground">
                  {monthLabel}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Số nhân sự
                </dt>
                <dd className="text-base font-semibold text-foreground">
                  {staffSummary}
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onExport}
                disabled={exporting}
                data-testid="schedule-export"
              >
                {exporting ? "Đang xuất..." : "Export CSV"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onValidate}
                disabled={generating || validating}
                data-testid="schedule-validate"
              >
                {validating ? "Đang kiểm tra..." : "Validate"}
              </Button>
              <Button
                size="sm"
                onClick={onGenerate}
                disabled={generating}
                data-testid="schedule-generate"
              >
                {generating ? "Đang tạo..." : "Generate"}
              </Button>
              {extraPrimaryActions}
            </div>
          </div>

          {toolbarActions ? (
            <div className="flex flex-col gap-3">{toolbarActions}</div>
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
      </section>
    </div>
  )
}
