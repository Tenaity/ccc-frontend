import "@testing-library/jest-dom/vitest"

import { render } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import MatrixRow from "./MatrixRow"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Position, ShiftCode, Staff } from "@/types"

function createAssignmentKey(staffId: number, day: string) {
  return `${staffId}|${day}`
}

describe("MatrixRow", () => {
  test("matches snapshot with duplicate leaders and rank badge", () => {
    const year = 2024
    const month = 6
    const days = [1, 2, 3]

    const staff: Staff = {
      id: 42,
      full_name: "Nguyen Van A",
      role: "TC",
      can_night: true,
      base_quota: 10,
      notes: "[CODE:1978][RANK:1]",
    }

    const assignmentIndex: Map<
      string,
      { code: ShiftCode; position: Position | undefined }
    > = new Map([
      [createAssignmentKey(staff.id, "2024-06-01"), { code: "K", position: "TD" }],
      [createAssignmentKey(staff.id, "2024-06-02"), { code: "Đ", position: "TD" }],
      [createAssignmentKey(staff.id, "2024-06-03"), { code: "CA1", position: null }],
    ])

    const summariesByStaffId = new Map([
      [
        staff.id,
        {
          counts: { CA1: 2, CA2: 1, K: 1, HC: 0, Đ: 1, P: 0 },
          credit: 7,
          dayCount: 4,
          nightCount: 1,
        },
      ],
    ])

    const fixedByDayStaff = new Map([
      [createAssignmentKey(staff.id, "2024-06-03"), true],
    ])

    const offByDayStaff = new Map<string, boolean>()

    const leaderCountsByDay = new Map([
      [1, { day: 2, night: 0 }],
      [2, { day: 0, night: 2 }],
      [3, { day: 1, night: 0 }],
    ])

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
              onEditCell={vi.fn()}
            />
          </tbody>
        </table>
      </TooltipProvider>,
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
