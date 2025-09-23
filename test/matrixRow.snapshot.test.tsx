import React from "react"
import { afterEach, expect, test } from "vitest"
import { cleanup, render } from "@testing-library/react"
import { axe } from "vitest-axe"

import MatrixRow from "@/components/schedule/MatrixRow"
import type { Assignment, Staff } from "@/types"
import { StaffRole } from "@/types"
import { TooltipProvider } from "@/components/ui/tooltip"
import { fmtYMD } from "@/utils/date"

afterEach(() => {
  cleanup()
})

test("matrix row renders leader badges and duplicate highlighting", async () => {
  const year = 2024
  const month = 5
  const days = [1, 2]

  const staffMember: Staff = {
    id: 1,
    full_name: "Nguyễn Văn A",
    role: StaffRole.TC,
    can_night: true,
    base_quota: 22,
    notes: "[CODE:1978][RANK:1]",
  }

  const assignmentIndex = new Map<
    string,
    { code: Assignment["shift_code"]; position: Assignment["position"] | null }
  >()
  assignmentIndex.set(`${staffMember.id}|${fmtYMD(year, month, 1)}`, {
    code: "K",
    position: "TD",
  })
  assignmentIndex.set(`${staffMember.id}|${fmtYMD(year, month, 2)}`, {
    code: "Đ",
    position: "TD",
  })

  const summariesByStaffId = new Map([
    [
      staffMember.id,
      {
        counts: { CA1: 0, CA2: 0, K: 1, HC: 0, Đ: 1, P: 0 },
        credit: 4,
        dayCount: 1,
        nightCount: 1,
      },
    ],
  ])

  const fixedByDayStaff = new Map<string, boolean>()
  const offByDayStaff = new Map<string, boolean>()

  const leaderCountsByDay = new Map([
    [1, { day: 2, night: 0 }],
    [2, { day: 0, night: 1 }],
  ])

  const { container } = render(
    <TooltipProvider>
      <table>
        <tbody>
          <MatrixRow
            staff={staffMember}
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
    </TooltipProvider>
  )

  const tbody = container.querySelector("tbody")
  expect(tbody).toMatchSnapshot()

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
