import { z } from "zod"

export const staffWorkloadItemSchema = z.object({
  staff_id: z.union([z.string(), z.number()]).optional(),
  staffId: z.union([z.string(), z.number()]).optional(),
  staff_name: z.string().optional(),
  name: z.string().optional(),
  total_hours: z.number().optional(),
  hours: z.number().optional(),
  overtime_hours: z.number().optional(),
  overtime: z.number().optional(),
  regular_hours: z.number().optional(),
})

export const staffWorkloadResponseSchema = z
  .array(staffWorkloadItemSchema)
  .or(z.object({ data: z.array(staffWorkloadItemSchema) }))
  .or(z.object({ staff: z.array(staffWorkloadItemSchema) }))
  .transform((value) => {
    if (Array.isArray(value)) {
      return value
    }
    if ("data" in value) {
      return value.data
    }
    if ("staff" in value) {
      return value.staff
    }
    return []
  })

export type StaffWorkloadItem = {
  id: string
  name: string
  totalHours: number
  overtimeHours: number
}

export const departmentComparisonItemSchema = z.object({
  department_id: z.union([z.string(), z.number()]).optional(),
  departmentId: z.union([z.string(), z.number()]).optional(),
  department: z.string().optional(),
  name: z.string().optional(),
  total_hours: z.number().optional(),
  hours: z.number().optional(),
  overtime_hours: z.number().optional(),
  overtime: z.number().optional(),
  regular_hours: z.number().optional(),
})

export const departmentComparisonResponseSchema = z
  .array(departmentComparisonItemSchema)
  .or(z.object({ data: z.array(departmentComparisonItemSchema) }))
  .or(z.object({ departments: z.array(departmentComparisonItemSchema) }))
  .transform((value) => {
    if (Array.isArray(value)) {
      return value
    }
    if ("data" in value) {
      return value.data
    }
    if ("departments" in value) {
      return value.departments
    }
    return []
  })

export type DepartmentComparisonItem = {
  id: string
  department: string
  totalHours: number
  overtimeHours: number
  regularHours: number
}

export const attendanceAbsenceSchema = z.object({
  staff_id: z.union([z.string(), z.number()]).optional(),
  staffId: z.union([z.string(), z.number()]).optional(),
  staff_name: z.string().optional(),
  name: z.string().optional(),
  date: z.string().optional(),
  reason: z.string().optional(),
  department: z.string().optional(),
})

export const attendanceResponseSchema = z.object({
  attendance_rate: z.number().optional(),
  attendanceRate: z.number().optional(),
  present: z.number().optional(),
  attendance: z.number().optional(),
  total: z.number().optional(),
  absent: z.number().optional(),
  absences: z.array(attendanceAbsenceSchema).optional(),
  records: z.array(attendanceAbsenceSchema).optional(),
})

export type AttendanceSummary = {
  attendanceRate: number
  present: number
  absent: number
  total: number
  absences: AttendanceAbsence[]
}

export type AttendanceAbsence = {
  id: string
  name: string
  date: string | null
  reason: string | null
  department: string | null
}

export const costResponseSchema = z.object({
  total_cost: z.number().optional(),
  cost: z.number().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  currency_code: z.string().optional(),
  previous_total_cost: z.number().optional(),
  previous_cost: z.number().optional(),
  previous_amount: z.number().optional(),
  delta_percentage: z.number().optional(),
  delta_percent: z.number().optional(),
  label: z.string().optional(),
  month_label: z.string().optional(),
  updated_at: z.string().optional(),
})

export type CostSummary = {
  amount: number
  previousAmount: number | null
  deltaPercentage: number | null
  currency: string
  label: string | null
  updatedAt: string | null
}
