export interface Staff {
  id: number
  full_name: string
  role: string
  department_name?: string
}

export interface StaffPreferences {
  staff_id: number
  preferred_shifts: string[]
  unavailable_days: string[]
  max_consecutive_days?: number
  preferred_days_off: number[]
  notes?: string
}

export interface PreferencesFormState extends StaffPreferences {}
