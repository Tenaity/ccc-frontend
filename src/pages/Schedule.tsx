import { useCallback, useMemo, useState, type ReactNode } from "react"

import ScheduleMatrixRoute from "@/routes/ScheduleMatrixRoute"
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
  legend?: ReactNode
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
  legend,
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
      toolbarActions={toolbarActions}
      legend={legend}
      onExport={handleExport}
      onValidate={handleValidate}
      onGenerate={handleGenerate}
      exporting={exporting}
      validating={isValidating}
      generating={loadingGen}
    />
  )
}
