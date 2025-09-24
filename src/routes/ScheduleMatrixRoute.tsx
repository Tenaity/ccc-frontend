import { type ReactNode, useMemo } from "react"

import MatrixTable from "@/components/schedule/MatrixTable"
import { Card, CardContent } from "@/components/ui/card"

export type ScheduleMatrixRouteProps = React.ComponentProps<
  typeof MatrixTable
> & {
  toolbarActions?: ReactNode
}

export default function ScheduleMatrixRoute({
  toolbarActions,
  ...matrixProps
}: ScheduleMatrixRouteProps) {
  const monthLabel = useMemo(
    () => `${String(matrixProps.month).padStart(2, "0")}/${matrixProps.year}`,
    [matrixProps.month, matrixProps.year],
  )

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="schedule-heading" className="space-y-4">
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

        {toolbarActions ? (
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {toolbarActions}
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
      </section>
    </div>
  )
}
