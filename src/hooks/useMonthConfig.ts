import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { getMonthConfig, updateMonthConfig } from "@/lib/api"
import type { MonthConfig, WeekendPolicy } from "@/types"

interface MonthConfigState {
  loading: boolean
  saving: boolean
  error: string | null
  data: MonthConfig | null
  isMissing: boolean
}

export interface SaveMonthConfigPayload {
  weekend_policy: WeekendPolicy
  extra_offdays: string[]
  extra_workdays: string[]
  working_days_override: number | null
  auto_working_days: number | null
}

function isValidSelection(year: number | null | undefined, month: number | null | undefined): boolean {
  return typeof year === "number" && Number.isFinite(year) && typeof month === "number" && Number.isFinite(month)
}

export function useMonthConfig(year: number | null | undefined, month: number | null | undefined) {
  const [state, setState] = useState<MonthConfigState>({
    loading: false,
    saving: false,
    error: null,
    data: null,
    isMissing: false,
  })
  const selection = useMemo(() =>
    isValidSelection(year, month) ? `${year}-${month}` : null,
  [month, year])
  const activeRequest = useRef<AbortController | null>(null)

  const load = useCallback(async () => {
    if (!selection) {
      setState((previous) => ({ ...previous, data: null, isMissing: false }))
      return null
    }

    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller

    setState((previous) => ({ ...previous, loading: true, error: null }))

    try {
      const [selectedYear, selectedMonth] = selection.split("-").map((value) => Number(value))
      const data = await getMonthConfig(selectedYear, selectedMonth)
      if (controller.signal.aborted) {
        return null
      }

      setState((previous) => ({
        ...previous,
        loading: false,
        data,
        isMissing: data === null,
        error: null,
      }))
      return data
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        return null
      }

      const message = error instanceof Error ? error.message : "Không thể tải cấu hình tháng"
      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
        data: null,
        isMissing: false,
      }))
      throw error
    }
  }, [selection])

  const save = useCallback(
    async (payload: SaveMonthConfigPayload) => {
      if (!selection) {
        throw new Error("Thiếu thông tin tháng cần lưu")
      }

      const [selectedYear, selectedMonth] = selection.split("-").map((value) => Number(value))
      const autoWorkingDays =
        payload.auto_working_days !== undefined
          ? payload.auto_working_days
          : state.data?.auto_working_days ?? null

      const optimistic: MonthConfig = {
        year: selectedYear,
        month: selectedMonth,
        weekend_policy: payload.weekend_policy,
        extra_offdays: [...payload.extra_offdays].sort(),
        extra_workdays: [...payload.extra_workdays].sort(),
        working_days_override: payload.working_days_override,
        auto_working_days: autoWorkingDays ?? 0,
      }

      const previous = state.data

      setState((current) => ({
        ...current,
        data: optimistic,
        saving: true,
        isMissing: false,
      }))

      try {
        const saved = await updateMonthConfig({
          year: optimistic.year,
          month: optimistic.month,
          weekend_policy: optimistic.weekend_policy,
          extra_offdays: optimistic.extra_offdays,
          extra_workdays: optimistic.extra_workdays,
          working_days_override: optimistic.working_days_override,
        })

        setState((current) => ({
          ...current,
          data: saved ?? optimistic,
          saving: false,
          error: null,
          isMissing: false,
        }))

        return saved ?? optimistic
      } catch (error) {
        setState((current) => ({
          ...current,
          data: previous ?? null,
          saving: false,
          isMissing: previous === null,
          error: error instanceof Error ? error.message : "Không thể lưu cấu hình tháng",
        }))

        throw error
      }
    },
    [selection, state.data],
  )

  useEffect(() => {
    void load()
    return () => {
      activeRequest.current?.abort()
    }
  }, [load])

  return {
    ...state,
    refetch: load,
    save,
  }
}
