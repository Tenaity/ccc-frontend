import "@testing-library/jest-dom/vitest"

import { render, screen } from "@testing-library/react"
import { afterEach, describe, it } from "vitest"

import MatrixTable from "../src/components/Schedule/MatrixTable"
import { makeEmptyDayPlaceSummary } from "../src/types"

afterEach(() => {
  // Restore viewport width after each test to avoid leaking state between cases.
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: 1024,
  })
  window.dispatchEvent(new Event("resize"))
})

const staff = [
  { id: 1, full_name: "Alice Nguyễn", role: "TC", can_night: true, base_quota: 10 },
]

const summariesByStaffId = new Map([
  [
    1,
    {
      counts: { CA1: 0, CA2: 0, K: 0, HC: 0, Đ: 0, P: 0 },
      credit: 0,
      dayCount: 0,
      nightCount: 0,
    },
  ],
])

const baseProps = {
  year: 2025,
  month: 9,
  days: [1],
  staff,
  assignmentIndex: new Map<string, { code: string; position: string | null }>(),
  summariesByStaffId,
  perDayLeaders: { 1: 1 },
  perDayByPlace: { 1: makeEmptyDayPlaceSummary() },
  expectedByDay: {
    1: {
      expectedTD: { K: 0, CA1: 0, CA2: 0, D: 0 },
      expectedPGD: { K: 0, CA2: 0, D: 0 },
    },
  },
  fixedByDayStaff: new Map<string, boolean>(),
  offByDayStaff: new Map<string, boolean>(),
}

describe.each([360, 768, 1280])("MatrixTable responsive rendering at %ipx", (width) => {
  it("renders the schedule region without layout errors", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: width,
    })
    window.dispatchEvent(new Event("resize"))

    render(<MatrixTable {...baseProps} />)

    expect(
      screen.getByRole("region", { name: /Bảng phân ca tháng 09\/2025/ }),
    ).toBeInTheDocument()
    expect(screen.getByText("Alice Nguyễn")).toBeInTheDocument()
  })
})
