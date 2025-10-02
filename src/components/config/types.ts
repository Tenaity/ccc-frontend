import { z } from "zod"

export const monthPlanSchema = z.object({
  year: z
    .number()
    .int("Năm không hợp lệ.")
    .min(2000, "Năm không hợp lệ."),
  month: z
    .number()
    .int("Tháng không hợp lệ.")
    .min(1, "Vui lòng chọn tháng.")
    .max(12, "Tháng không hợp lệ."),
})

export type MonthPlanFormValues = z.infer<typeof monthPlanSchema>

export type ShiftField = {
  key: string
  label: string
}
