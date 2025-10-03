import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  attendanceResponseSchema,
  costResponseSchema,
  departmentComparisonResponseSchema,
  type AttendanceSummary,
  type CostSummary,
  type DepartmentComparisonItem,
  type StaffWorkloadItem,
  staffWorkloadResponseSchema,
} from "@/types/analytics"
import { fetchJson } from "@/lib/api"

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface AsyncResult<T> extends AsyncState<T> {
  refetch: () => Promise<T | null>
  isEmpty: boolean
}

function normalizeStaffWorkload(raw: unknown): StaffWorkloadItem[] {
  const parsed = staffWorkloadResponseSchema.safeParse(raw)
  if (!parsed.success) {
    return []
  }

  return parsed.data.map((item, index) => {
    const id =
      item.staff_id ?? item.staffId ?? item.name ?? item.staff_name ?? index
    const name = item.staff_name ?? item.name ?? `Nhân viên ${index + 1}`
    const totalHours = Math.max(0, item.total_hours ?? item.hours ?? 0)
    const overtimeHours = Math.max(
      0,
      item.overtime_hours ?? item.overtime ?? 0,
    )
    return {
      id: String(id),
      name,
      totalHours,
      overtimeHours,
    }
  })
}

function normalizeDepartmentComparison(raw: unknown): DepartmentComparisonItem[] {
  const parsed = departmentComparisonResponseSchema.safeParse(raw)
  if (!parsed.success) {
    return []
  }

  return parsed.data.map((item, index) => {
    const id =
      item.department_id ?? item.departmentId ?? item.department ?? index
    const department = item.department ?? item.name ?? `Phòng ban ${index + 1}`
    const totalHours = Math.max(0, item.total_hours ?? item.hours ?? 0)
    const overtimeHours = Math.max(
      0,
      item.overtime_hours ?? item.overtime ?? 0,
    )
    const regularHours = Math.max(
      0,
      item.regular_hours ?? totalHours - overtimeHours,
    )

    return {
      id: String(id),
      department,
      totalHours,
      overtimeHours,
      regularHours,
    }
  })
}

function normalizeAttendance(raw: unknown): AttendanceSummary | null {
  const parsed = attendanceResponseSchema.safeParse(raw)
  if (!parsed.success) {
    return null
  }

  const attendanceRate =
    parsed.data.attendance_rate ?? parsed.data.attendanceRate ?? 0
  const present = Math.max(0, parsed.data.present ?? parsed.data.attendance ?? 0)
  const absent = Math.max(0, parsed.data.absent ?? 0)
  const total = Math.max(parsed.data.total ?? present + absent, 0)
  const absences = (parsed.data.absences ?? parsed.data.records ?? []).map(
    (absence, index) => {
      const id =
        absence.staff_id ?? absence.staffId ?? absence.name ?? index
      return {
        id: String(id),
        name: absence.staff_name ?? absence.name ?? "Không rõ",
        date: absence.date ?? null,
        reason: absence.reason ?? null,
        department: absence.department ?? null,
      }
    },
  )

  return {
    attendanceRate,
    present,
    absent,
    total,
    absences,
  }
}

function normalizeCost(raw: unknown): CostSummary | null {
  const parsed = costResponseSchema.safeParse(raw)
  if (!parsed.success) {
    return null
  }

  const amount =
    parsed.data.total_cost ??
    parsed.data.cost ??
    parsed.data.amount ??
    0
  const normalizedAmount = Math.max(0, amount)
  const previousAmount =
    parsed.data.previous_total_cost ??
    parsed.data.previous_cost ??
    parsed.data.previous_amount ??
    null
  const deltaPercentage =
    parsed.data.delta_percentage ?? parsed.data.delta_percent ?? null
  const currency =
    parsed.data.currency ?? parsed.data.currency_code ?? "VND"
  const label = parsed.data.label ?? parsed.data.month_label ?? null
  const updatedAt = parsed.data.updated_at ?? null

  return {
    amount: normalizedAmount,
    previousAmount,
    deltaPercentage,
    currency,
    label,
    updatedAt,
  }
}

type RequestFactory = (signal: AbortSignal) => Promise<unknown>

function useAsyncData<T>(factory: RequestFactory | null): AsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: !!factory,
    error: null,
  })
  const abortRef = useRef<AbortController | null>(null)

  const refetch = useCallback(async () => {
    if (!factory) {
      setState({ data: null, loading: false, error: null })
      return null
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState((current) => ({ ...current, loading: true, error: null }))

    try {
      const result = await factory(controller.signal)
      if (controller.signal.aborted) {
        return null
      }
      setState({ data: result as T, loading: false, error: null })
      return result as T
    } catch (error) {
      if (controller.signal.aborted) {
        return null
      }
      const message =
        error instanceof Error ? error.message : "Không thể tải dữ liệu"
      setState({ data: null, loading: false, error: message })
      return null
    }
  }, [factory])

  useEffect(() => {
    void refetch()
    return () => {
      abortRef.current?.abort()
    }
  }, [refetch])

  const isEmpty = useMemo(() => {
    if (!state.data) {
      return true
    }

    if (Array.isArray(state.data)) {
      return state.data.length === 0
    }

    if (typeof state.data === "object" && state.data !== null) {
      if ("total" in (state.data as Record<string, unknown>)) {
        const total = (state.data as { total?: number }).total
        if (typeof total === "number") {
          return total === 0
        }
      }
    }

    return false
  }, [state.data])

  return {
    ...state,
    refetch,
    isEmpty,
  }
}

function buildStaffWorkloadFactory(
  year: number | null | undefined,
  month: number | null | undefined,
): RequestFactory | null {
  if (!Number.isFinite(year ?? NaN) || !Number.isFinite(month ?? NaN)) {
    return null
  }

  return async (signal: AbortSignal) => {
    const data = await fetchJson<unknown>(
      `/api/metrics/staff-workload?year=${year}&month=${month}`,
      { signal },
    )
    return normalizeStaffWorkload(data) as unknown
  }
}

function buildDepartmentComparisonFactory(
  year: number | null | undefined,
  month: number | null | undefined,
): RequestFactory | null {
  if (!Number.isFinite(year ?? NaN) || !Number.isFinite(month ?? NaN)) {
    return null
  }

  return async (signal: AbortSignal) => {
    const data = await fetchJson<unknown>(
      `/api/metrics/department-comparison?year=${year}&month=${month}`,
      { signal },
    )
    return normalizeDepartmentComparison(data) as unknown
  }
}

function buildAttendanceFactory(
  from: string | null | undefined,
  to: string | null | undefined,
): RequestFactory | null {
  if (!from || !to) {
    return null
  }

  return async (signal: AbortSignal) => {
    const params = new URLSearchParams({ from, to })
    const data = await fetchJson<unknown>(
      `/api/metrics/attendance?${params.toString()}`,
      { signal },
    )
    return normalizeAttendance(data) as unknown
  }
}

function buildCostFactory(
  year: number | null | undefined,
  month: number | null | undefined,
): RequestFactory | null {
  if (!Number.isFinite(year ?? NaN) || !Number.isFinite(month ?? NaN)) {
    return null
  }

  return async (signal: AbortSignal) => {
    const data = await fetchJson<unknown>(
      `/api/metrics/cost?year=${year}&month=${month}`,
      { signal },
    )
    return normalizeCost(data) as unknown
  }
}

export function useStaffWorkload(year: number | null, month: number | null) {
  const factory = useMemo(
    () => buildStaffWorkloadFactory(year, month),
    [month, year],
  )
  return useAsyncData<StaffWorkloadItem[]>(factory)
}

export function useDepartmentCompare(
  year: number | null,
  month: number | null,
) {
  const factory = useMemo(
    () => buildDepartmentComparisonFactory(year, month),
    [month, year],
  )
  return useAsyncData<DepartmentComparisonItem[]>(factory)
}

export function useAttendance(from: string | null, to: string | null) {
  const factory = useMemo(() => buildAttendanceFactory(from, to), [from, to])
  return useAsyncData<AttendanceSummary | null>(factory)
}

export function useCost(year: number | null, month: number | null) {
  const factory = useMemo(() => buildCostFactory(year, month), [month, year])
  return useAsyncData<CostSummary | null>(factory)
}
