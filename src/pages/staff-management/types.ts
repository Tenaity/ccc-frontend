export interface Department {
  id: number
  name: string
  code: string
  color: string
  is_active?: boolean
}

export interface Staff {
  id: number
  full_name: string
  role: string
  can_night: boolean
  base_quota: number
  notes?: string
  department_id?: number
  department_name?: string
}

export interface StaffFormData {
  full_name: string
  role: string
  can_night: boolean
  base_quota: number
  notes: string
  department_id: number | undefined
}

export type RoleFilter = "all" | "GDV" | "TC"
