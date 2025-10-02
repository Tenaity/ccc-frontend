import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { getShiftDefaultConfig, updateShiftDefaultConfig } from "@/lib/api"
import type { ShiftDefaultConfig } from "@/types"

interface ShiftDefaultsState {
  loading: boolean
  saving: boolean
  error: string | null
  data: ShiftDefaultConfig | null
}

function isValidSelection(year: number | null | undefined, month: number | null | undefined): boolean {
  return typeof year === "number" && Number.isFinite(year) && typeof month === "number" && Number.isFinite(month)
}

export function useShiftDefaults(year: number | null | undefined, month: number | null | undefined) {
  const [state, setState] = useState<ShiftDefaultsState>({
    loading: false,
    saving: false,
    error: null,
    data: null,
  })
  const selection = useMemo(() => (isValidSelection(year, month) ? `${year}-${month}` : null), [month, year])
  const activeRequest = useRef<AbortController | null>(null)

  const load = useCallback(async () => {
    if (!selection) {
      setState((previous) => ({ ...previous, data: null }))
      return null
    }

    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller

    setState((previous) => ({ ...previous, loading: true, error: null }))

    try {
      const [selectedYear, selectedMonth] = selection.split("-").map((value) => Number(value))
      const data = await getShiftDefaultConfig(selectedYear, selectedMonth)
      if (controller.signal.aborted) {
        return null
      }

      setState((previous) => ({
        ...previous,
        loading: false,
        data,
        error: null,
      }))
      return data
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        return null
      }

      const message = error instanceof Error ? error.message : "Không thể tải mặc định ca"
      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
        data: null,
      }))
      throw error
    }
  }, [selection])

  const save = useCallback(
    async (defaults: Record<string, number>) => {
      if (!selection) {
        throw new Error("Thiếu thông tin tháng cần lưu mặc định ca")
      }

      const [selectedYear, selectedMonth] = selection.split("-").map((value) => Number(value))
      const optimistic: ShiftDefaultConfig = {
        year: selectedYear,
        month: selectedMonth,
        defaults: { ...defaults },
      }
      const previous = state.data

      setState((current) => ({
        ...current,
        data: optimistic,
        saving: true,
      }))

      try {
        const saved = await updateShiftDefaultConfig({
          year: optimistic.year,
          month: optimistic.month,
          defaults: optimistic.defaults,
        })

        setState((current) => ({
          ...current,
          data: saved ?? optimistic,
          saving: false,
          error: null,
        }))

        return saved ?? optimistic
      } catch (error) {
        setState((current) => ({
          ...current,
          data: previous ?? null,
          saving: false,
          error: error instanceof Error ? error.message : "Không thể lưu mặc định ca",
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
