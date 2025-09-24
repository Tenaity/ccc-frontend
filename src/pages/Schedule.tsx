import { useCallback, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"

import ScheduleMatrixRoute from "@/routes/ScheduleMatrixRoute"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { DayPlaceSummary, ExpectedByDay, Staff } from "@/types"
import type { Cell } from "@/utils/mergeCellIndex"

type StaffSummary = {
  counts: Record<string, number>
  credit: number
  dayCount: number
  nightCount: number
}

type ScheduleBreadcrumb = {
  label: string
  href?: string
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
  staffLoading?: boolean
  extraPrimaryActions?: ReactNode
  breadcrumbs?: ScheduleBreadcrumb[]
  description?: string
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
  staffLoading = false,
  extraPrimaryActions,
  breadcrumbs,
  description,
}: SchedulePageProps) {
  const [isValidating, setIsValidating] = useState(false)

  const breadcrumbItems = breadcrumbs ?? []
  const hasBreadcrumbs = breadcrumbItems.length > 0

  const introContent = hasBreadcrumbs ? (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1

          return (
            <BreadcrumbItem key={`${item.label}-${index}`}>
              {isLast || !item.href ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
              {!isLast ? <BreadcrumbSeparator /> : null}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  ) : null

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
      staffLoading={staffLoading}
      extraPrimaryActions={extraPrimaryActions}
      onExport={handleExport}
      onValidate={handleValidate}
      onGenerate={handleGenerate}
      exporting={exporting}
      validating={isValidating}
      generating={loadingGen}
      intro={introContent}
      description={description}
    />
  )
}
