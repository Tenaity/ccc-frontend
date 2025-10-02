import { SHIFT_FIELD_LABELS } from "./constants"
import type { ShiftField } from "./types"

export function createShiftFields(defaults: Record<string, number>): ShiftField[] {
  const keys = new Set(Object.keys(SHIFT_FIELD_LABELS))
  for (const key of Object.keys(defaults)) {
    keys.add(key)
  }

  return Array.from(keys).map((key) => ({
    key,
    label:
      SHIFT_FIELD_LABELS[key] ??
      key
        .replace(/_/g, " ")
        .replace(/\b([a-z])/g, (match) => match.toUpperCase()),
  }))
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function formatDisplayDate(input: string): string {
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) {
    return input
  }

  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}
