import { render } from "@testing-library/react"
import { expect, test } from "vitest"

import MatrixRow from "@/components/schedule/MatrixRow"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Assignment, Staff } from "@/types"

const year = 2025
const month = 5
const days = [1, 2, 3]

const staff: Staff = {
  id: 42,
  full_name: "Nguyễn Văn A",
  role: "TC",
  can_night: true,
  base_quota: 18,
  notes: "[CODE:1978][RANK:1]",
}

const dayKey = (day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`

const assignmentIndex = new Map<
  string,
  { code: Assignment["shift_code"]; position: Assignment["position"] | null }
>()
assignmentIndex.set(`${staff.id}|${dayKey(1)}`, { code: "K", position: "TD" })
assignmentIndex.set(`${staff.id}|${dayKey(2)}`, { code: "Đ", position: "TD" })

const summariesByStaffId = new Map<number, {
  counts: Record<string, number>
  credit: number
  dayCount: number
  nightCount: number
}>()
summariesByStaffId.set(staff.id, {
  counts: { CA1: 1, CA2: 0, K: 1, HC: 0, Đ: 1, P: 1 },
  credit: 12,
  dayCount: 2,
  nightCount: 1,
})

const fixedByDayStaff = new Map<string, boolean>([
  [`${staff.id}|${dayKey(1)}`, true],
])

const offByDayStaff = new Map<string, boolean>([
  [`${staff.id}|${dayKey(3)}`, true],
])

const leaderCountsByDay = new Map<number, { day: number; night: number }>([
  [1, { day: 2, night: 0 }],
  [2, { day: 0, night: 1 }],
  [3, { day: 0, night: 0 }],
])

test("renders schedule matrix row with badges and totals", () => {
  const { asFragment } = render(
    <TooltipProvider>
      <table>
        <tbody>
          <MatrixRow
            staff={staff}
            index={0}
            year={year}
            month={month}
            days={days}
            assignmentIndex={assignmentIndex}
            summariesByStaffId={summariesByStaffId}
            fixedByDayStaff={fixedByDayStaff}
            offByDayStaff={offByDayStaff}
            leaderCountsByDay={leaderCountsByDay}
          />
        </tbody>
      </table>
    </TooltipProvider>,
  )

  expect(asFragment()).toMatchSnapshot()
})
