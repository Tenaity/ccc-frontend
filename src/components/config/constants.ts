import type { WeekendPolicy } from "@/types"

export const BASE_WEEKEND_POLICIES: Array<{ value: WeekendPolicy; label: string }> = [
  { value: "sat_sun", label: "Thứ 7 & Chủ nhật" },
  { value: "sun_only", label: "Chỉ Chủ nhật" },
  { value: "none", label: "Không áp dụng" },
]

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1)

export const SHIFT_FIELD_LABELS: Record<string, string> = {
  day: "Ca ngày",
  night: "Ca đêm",
  leader: "Leader",
  pgd: "PGD",
  hc: "HC",
}

export const SHIFT_DEFAULT_BASE: Record<string, number> = {
  day: 0,
  night: 0,
  leader: 0,
  pgd: 0,
  hc: 0,
}
