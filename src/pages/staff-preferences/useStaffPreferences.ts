import { useCallback, useEffect, useMemo, useState } from "react"

import { useDepartment } from "@/contexts/DepartmentContext"

import { DEFAULT_PREFERENCES } from "./constants"
import type { PreferencesFormState, Staff } from "./types"

export function useStaffPreferences() {
  const { selectedDepartmentId } = useDepartment()

  const [staff, setStaff] = useState<Staff[]>([])
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null)
  const [preferences, setPreferences] = useState<PreferencesFormState>({ ...DEFAULT_PREFERENCES })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true)
      const url = selectedDepartmentId
        ? `http://localhost:8000/api/staff?department_id=${selectedDepartmentId}`
        : "http://localhost:8000/api/staff"
      const res = await fetch(url)
      const data = await res.json()
      setStaff(data)
    } catch (error) {
      console.error("Failed to fetch staff:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedDepartmentId])

  useEffect(() => {
    fetchStaff()
    setSelectedStaffId(null)
    setPreferences({ ...DEFAULT_PREFERENCES })
  }, [fetchStaff])

  const fetchPreferences = useCallback(async (staffId: number) => {
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:8000/api/staff/${staffId}/preferences`)
      if (res.ok) {
        const data = await res.json()
        setPreferences(data)
      } else {
        setPreferences({ ...DEFAULT_PREFERENCES, staff_id: staffId })
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error)
      setPreferences({ ...DEFAULT_PREFERENCES, staff_id: staffId })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedStaffId) {
      fetchPreferences(selectedStaffId)
    }
  }, [selectedStaffId, fetchPreferences])

  const handleSelectStaff = useCallback((staffId: number) => {
    setSelectedStaffId(staffId)
  }, [])

  const toggleShiftPreference = useCallback((shiftCode: string, enabled: boolean) => {
    setPreferences((prev) => {
      if (enabled) {
        if (prev.preferred_shifts.includes(shiftCode)) {
          return prev
        }
        return {
          ...prev,
          preferred_shifts: [...prev.preferred_shifts, shiftCode],
        }
      }

      return {
        ...prev,
        preferred_shifts: prev.preferred_shifts.filter((code) => code !== shiftCode),
      }
    })
  }, [])

  const toggleDayOff = useCallback((dayOfWeek: number) => {
    setPreferences((prev) => {
      const exists = prev.preferred_days_off.includes(dayOfWeek)
      return {
        ...prev,
        preferred_days_off: exists
          ? prev.preferred_days_off.filter((day) => day !== dayOfWeek)
          : [...prev.preferred_days_off, dayOfWeek],
      }
    })
  }, [])

  const updateMaxConsecutiveDays = useCallback((value: number) => {
    setPreferences((prev) => ({ ...prev, max_consecutive_days: value }))
  }, [])

  const resetPreferences = useCallback(() => {
    if (selectedStaffId) {
      fetchPreferences(selectedStaffId)
    }
  }, [fetchPreferences, selectedStaffId])

  const savePreferences = useCallback(async () => {
    if (!selectedStaffId) {
      return
    }

    try {
      setSaving(true)
      const res = await fetch(`http://localhost:8000/api/staff/${selectedStaffId}/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      if (!res.ok) {
        console.error("Failed to save preferences")
      }
    } catch (error) {
      console.error("Failed to save preferences:", error)
    } finally {
      setSaving(false)
    }
  }, [preferences, selectedStaffId])

  const selectedStaff = useMemo(() => staff.find((member) => member.id === selectedStaffId) ?? null, [staff, selectedStaffId])

  return {
    staff,
    loading,
    saving,
    selectedStaff,
    selectedStaffId,
    preferences,
    handleSelectStaff,
    toggleShiftPreference,
    toggleDayOff,
    updateMaxConsecutiveDays,
    resetPreferences,
    savePreferences,
  }
}
