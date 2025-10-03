export const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
] as const

export const SHIFT_OPTIONS = [
  {
    code: "K",
    title: "K (Day Shift)",
    description: "Regular day shift",
    icon: "Sun",
    iconClassName: "text-amber-500",
  },
  {
    code: "CA1",
    title: "CA1 (Morning Shift)",
    description: "Morning shift",
    icon: "Sun",
    iconClassName: "text-orange-500",
  },
  {
    code: "CA2",
    title: "CA2 (Afternoon Shift)",
    description: "Afternoon shift",
    icon: "Clock",
    iconClassName: "text-blue-500",
  },
  {
    code: "Đ",
    title: "Đ (Night Shift)",
    description: "Night shift",
    icon: "Moon",
    iconClassName: "text-indigo-500",
  },
] as const

export const DEFAULT_PREFERENCES = {
  staff_id: 0,
  preferred_shifts: [],
  unavailable_days: [],
  max_consecutive_days: 6,
  preferred_days_off: [],
  notes: "",
}
