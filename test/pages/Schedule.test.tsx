import React from "react"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import SchedulePage from "../../src/pages/Schedule"
import type { DayPlaceSummary, ExpectedByDay } from "../../src/types"
import type { Cell } from "../../src/utils/mergeCellIndex"

vi.mock("@/components/Schedule/MatrixTable", () => ({
  __esModule: true,
  default: ({ staff }: { staff: any[] }) => (
    <div data-testid="matrix-table">rows-{staff.length}</div>
  ),
}))

describe("SchedulePage", () => {
  const perDayByPlace: Record<number, DayPlaceSummary> = {
    1: { TD: { K: 0, CA1: 0, CA2: 0, D: 0 }, PGD: { K: 0, CA2: 0, D: 0 } },
  }
  const expectedByDay: ExpectedByDay = {}
  const assignmentIndex = new Map<string, Cell>()
  const fixedByDayStaff = new Map<string, boolean>()
  const offByDayStaff = new Map<string, boolean>()
  const summariesByStaffId = new Map<
    number,
    { counts: Record<string, number>; credit: number; dayCount: number; nightCount: number }
  >()

  function renderPage(overrides?: Partial<React.ComponentProps<typeof SchedulePage>>) {
    const props: React.ComponentProps<typeof SchedulePage> = {
      year: 2024,
      month: 9,
      loadingGen: false,
      onGenerate: vi.fn(),
      onValidate: vi.fn(),
      onExport: vi.fn(),
      exporting: false,
      days: [1],
      staff: [],
      assignmentIndex,
      summariesByStaffId,
      perDayLeaders: { 1: 1 },
      perDayByPlace,
      expectedByDay,
      fixedByDayStaff,
      offByDayStaff,
      matrixLoading: false,
      matrixError: null,
      fetchStaff: vi.fn(),
      toolbarActions: <div data-testid="extra">extra</div>,
      legend: <div data-testid="legend">legend</div>,
      ...overrides,
    }

    return render(<SchedulePage {...props} />)
  }

  it("keeps header minimal and renders stats with toolbar in the body", async () => {
    const onGenerate = vi.fn()
    const onValidate = vi.fn().mockResolvedValue(undefined)
    const onExport = vi.fn()
    const user = userEvent.setup()

    renderPage({ onGenerate, onValidate, onExport })

    const header = screen.getByTestId("schedule-header")
    const heading = within(header).getByRole("heading", {
      level: 1,
      name: /schedule/i,
    })
    expect(heading).toBeInTheDocument()
    expect(
      within(header).getByText("Quản lý lịch phân ca dạng ma trận"),
    ).toBeInTheDocument()

    const body = screen.getByTestId("schedule-body")
    expect(
      within(body).getByText(/Tháng hiện tại:\s*09\/2024/i),
    ).toBeInTheDocument()
    expect(within(body).getByText(/0\s+nhân sự/i)).toBeInTheDocument()
    expect(within(body).getByTestId("extra")).toBeInTheDocument()
    expect(within(body).getByTestId("legend")).toBeInTheDocument()
    expect(screen.getByTestId("matrix-table")).toHaveTextContent("rows-0")

    await user.click(screen.getByRole("button", { name: /export csv/i }))
    await user.click(screen.getByRole("button", { name: /validate/i }))
    await user.click(screen.getByRole("button", { name: /generate/i }))

    expect(onExport).toHaveBeenCalledTimes(1)
    expect(onValidate).toHaveBeenCalledTimes(1)
    expect(onGenerate).toHaveBeenCalledTimes(1)
  })

  it("disables actions when loading or exporting", () => {
    renderPage({ loadingGen: true, exporting: true })

    expect(screen.getByTestId("schedule-generate")).toBeDisabled()
    expect(screen.getByTestId("schedule-validate")).toBeDisabled()
    const exportButton = screen.getByTestId("schedule-export")
    expect(exportButton).toBeDisabled()
    expect(exportButton).toHaveTextContent("Đang xuất...")
  })
})
