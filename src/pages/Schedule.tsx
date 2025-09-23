import { useCallback, useMemo, useState, type ReactNode } from "react"

import MatrixTable from "@/components/schedule/MatrixTable"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DayPlaceSummary, ExpectedByDay, Staff } from "@/types"
import type { Cell } from "@/utils/mergeCellIndex"

type StaffSummary = {
  counts: Record<string, number>
  credit: number
  dayCount: number
  nightCount: number
}

export interface SchedulePageProps {
  year: number
  month: number
  loadingGen: boolean
  onGenerate: () => Promise<unknown> | unknown
  onValidate: () => Promise<unknown> | unknown
  onExport: () => void
  exporting: boolean
  days: number[]
  staff: Staff[]
  assignmentIndex: Map<string, Cell>
  summariesByStaffId: Map<number, StaffSummary>
  perDayLeaders: Record<number, number>
  perDayByPlace: Record<number, DayPlaceSummary>
  expectedByDay: ExpectedByDay
  fixedByDayStaff: Map<string, boolean>
  offByDayStaff: Map<string, boolean>
  matrixLoading: boolean
  matrixError: string | null
  fetchStaff: () => void
  toolbarActions?: ReactNode
}

export default function SchedulePage({
  year,
  month,
  loadingGen,
  onGenerate,
  onValidate,
  onExport,
  exporting,
  days,
  staff,
  assignmentIndex,
  summariesByStaffId,
  perDayLeaders,
  perDayByPlace,
  expectedByDay,
  fixedByDayStaff,
  offByDayStaff,
  matrixLoading,
  matrixError,
  fetchStaff,
  toolbarActions,
}: SchedulePageProps) {
  const [isValidating, setIsValidating] = useState(false)

  const monthLabel = useMemo(
    () => `${String(month).padStart(2, "0")}/${year}`,
    [month, year],
  )

  const handleGenerate = useCallback(() => {
    if (loadingGen) {
      return
    }
    void onGenerate()
  }, [loadingGen, onGenerate])

  const handleValidate = useCallback(async () => {
    if (loadingGen || isValidating) {
      return
    }
    try {
      setIsValidating(true)
      await Promise.resolve(onValidate())
    } finally {
      setIsValidating(false)
    }
  }, [isValidating, loadingGen, onValidate])

  const handleExport = useCallback(() => {
    if (exporting) {
      return
    }
    onExport()
  }, [exporting, onExport])

  return (
    <div className="flex flex-col gap-6 px-4 pb-16 lg:px-6">
      <section aria-labelledby="schedule-heading">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="gap-4 pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <CardTitle
                  id="schedule-heading"
                  className="text-lg font-semibold text-foreground sm:text-xl"
                >
                  Schedule
                </CardTitle>
                <CardDescription>
                  Ma trận phân ca cho tháng {monthLabel}. Theo dõi nhanh trạng thái ca và cảnh báo vi phạm.
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={handleExport}
                  disabled={exporting}
                  data-testid="schedule-export"
                >
                  {exporting ? "Đang xuất..." : "Export CSV"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleValidate}
                  disabled={loadingGen || isValidating}
                  data-testid="schedule-validate"
                >
                  {isValidating ? "Đang kiểm tra..." : "Validate"}
                </Button>
                <Button onClick={handleGenerate} disabled={loadingGen} data-testid="schedule-generate">
                  {loadingGen ? "Đang tạo..." : "Generate"}
                </Button>
              </div>
            </div>
            {toolbarActions ? (
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {toolbarActions}
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="p-0">
            <MatrixTable
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
              withCard={false}
              containerClassName="rounded-none border-0 bg-transparent shadow-none"
            />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
