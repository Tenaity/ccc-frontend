import "@testing-library/jest-dom/vitest"

import { render, screen, within } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import MatrixTable from "./MatrixTable"
import type { Assignment, DayPlaceSummary, ExpectedPerDay, Staff } from "@/types"

function createDayPlaceSummary(): DayPlaceSummary {
  return {
    TD: { K: 1, CA1: 1, CA2: 0, D: 0 },
    PGD: { K: 0, CA2: 0, D: 0 },
  }
}

function createExpected(): ExpectedPerDay {
  return {
    expectedTD: { K: 1, CA1: 1, CA2: 0, D: 0 },
    expectedPGD: { K: 0, CA2: 0, D: 0 },
  }
}

describe("MatrixTable", () => {
  test("renders scrollable matrix with sticky headers and first column", () => {
    const year = 2024
    const month = 5
    const days = [1, 2]

    const staffMember: Staff = {
      id: 11,
      full_name: "Trần Thị B",
      role: "TC",
      can_night: true,
      base_quota: 10,
      notes: null,
    }

    const assignmentIndex = new Map<
      string,
      { code: Assignment["shift_code"]; position: Assignment["position"] | null }
    >([
      [`${staffMember.id}|2024-05-01`, { code: "K", position: "TD" }],
      [`${staffMember.id}|2024-05-02`, { code: "CA1", position: null }],
    ])

    const summariesByStaffId = new Map([
      [
        staffMember.id,
        {
          counts: { CA1: 1, CA2: 0, K: 1, HC: 0, Đ: 0, P: 0 },
          credit: 4,
          dayCount: 2,
          nightCount: 0,
        },
      ],
    ])

    const perDayLeaders: Record<number, number> = {
      1: 1,
      2: 1,
    }

    const perDayByPlace: Record<number, DayPlaceSummary> = {
      1: createDayPlaceSummary(),
      2: createDayPlaceSummary(),
    }

    const expectedByDay: Record<number, ExpectedPerDay> = {
      1: createExpected(),
      2: createExpected(),
    }

    render(
      <MatrixTable
        year={year}
        month={month}
        days={days}
        staff={[staffMember]}
        assignmentIndex={assignmentIndex}
        summariesByStaffId={summariesByStaffId}
        perDayLeaders={perDayLeaders}
        perDayByPlace={perDayByPlace}
        expectedByDay={expectedByDay}
        fixedByDayStaff={new Map()}
        offByDayStaff={new Map()}
        withCard={false}
      />,
    )

    const region = screen.getByRole("region", {
      name: "Bảng phân ca tháng 05/2024",
    })
    expect(region).toBeInTheDocument()
    expect(region).toHaveClass(
      "max-h-[calc(100vh-220px)]",
      "overflow-y-auto",
      "overflow-x-auto",
    )

    const table = within(region).getByRole("table")
    expect(table).toBeInTheDocument()

    const staffCell = screen.getByRole("rowheader", { name: /Trần Thị B/ })
    expect(staffCell).toHaveClass("sticky")
    expect(staffCell).toHaveClass("left-0")
    expect(staffCell).toHaveClass("bg-background/95")
    expect(staffCell).toHaveClass("border-border")
    expect(staffCell).toHaveClass("backdrop-blur-[2px]")
    expect(staffCell).toHaveClass(
      "supports-[backdrop-filter]:bg-background/60",
    )

    const headerCell = screen.getByRole("columnheader", { name: "Nhân viên" })
    expect(headerCell).toHaveClass("sticky")
    expect(headerCell).toHaveClass("left-0")
    expect(headerCell).toHaveClass("bg-background/95")
    expect(headerCell).toHaveClass("border-border")
    expect(headerCell).toHaveClass("backdrop-blur-[2px]")
    expect(headerCell).toHaveClass(
      "supports-[backdrop-filter]:bg-background/60",
    )
  })
})

