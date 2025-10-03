export interface DepartmentSettings {
  working_hours: { start: string; end: string }
  weekend_policy: string
  max_hours_per_month: number
  min_staff_per_shift: number
}

export interface Department {
  id: number
  name: string
  code: string
  color: string
  icon: string
  description?: string
  is_active: boolean
  settings: DepartmentSettings
  staff_count: number
  shift_count: number
}

export interface DepartmentFormData {
  name: string
  code: string
  color: string
  icon: string
  description: string
}
