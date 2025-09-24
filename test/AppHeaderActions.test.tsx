import React from "react"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import App from "../src/App"
import { UiProvider } from "../src/components/ui/UiProvider"

const useScheduleDataMock = vi.fn()
const exportCsvMock = vi.fn()
const fetchValidateMock = vi.fn()
const onGenerateMock = vi.fn()

vi.mock("../src/pages/Dashboard", () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-page" />,
}))

vi.mock("../src/pages/Schedule", () => ({
  __esModule: true,
  default: () => <div data-testid="schedule-page" />,
}))

vi.mock("../src/hooks/useScheduleData", () => ({
  useScheduleData: (...args: unknown[]) => useScheduleDataMock(...args),
}))

vi.mock("../src/hooks/useExportCsv", () => ({
  useExportCsv: () => ({
    isExporting: false,
    exportCsv: exportCsvMock,
  }),
}))

vi.mock("../src/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}))

describe("App header actions", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  beforeEach(() => {
    vi.clearAllMocks()

    const validationResult = { ok: true, conflicts: [] }
    fetchValidateMock.mockResolvedValue(validationResult)
    onGenerateMock.mockResolvedValue(validationResult)
    exportCsvMock.mockResolvedValue(12)

    useScheduleDataMock.mockReturnValue({
      staff: [{ id: 1, name: "Agent" }],
      loadingGen: false,
      loadingStaff: false,
      staffError: null,
      validation: validationResult,
      hasLeaderDup: false,
      days: [],
      assignmentIndex: new Map(),
      summariesByStaffId: new Map(),
      perDayLeaders: {},
      perDayByPlace: {},
      expectedByDay: {},
      fixedByDayStaff: new Map(),
      offByDayStaff: new Map(),
      onGenerate: onGenerateMock,
      fetchStaff: vi.fn(),
      fetchFixed: vi.fn(),
      fetchOffdays: vi.fn(),
      fetchHolidays: vi.fn(),
      fetchValidate: fetchValidateMock,
      leaderErrors: [],
      fillHC: false,
      setFillHC: vi.fn(),
    })
  })

  it("triggers schedule actions when header buttons are clicked", async () => {
    const user = userEvent.setup()

    render(
      <UiProvider>
        <MemoryRouter initialEntries={["/schedule"]}>
          <App />
        </MemoryRouter>
      </UiProvider>,
    )

    const validateButton = await screen.findByTestId("schedule-validate")
    const generateButton = screen.getByTestId("schedule-generate")
    const exportButton = screen.getByTestId("schedule-export")

    await user.click(validateButton)
    await user.click(generateButton)
    await user.click(exportButton)

    await waitFor(() => {
      expect(fetchValidateMock).toHaveBeenCalledTimes(1)
      expect(onGenerateMock).toHaveBeenCalledTimes(1)
      expect(exportCsvMock).toHaveBeenCalledTimes(1)
    })

    const today = new Date()
    expect(exportCsvMock).toHaveBeenCalledWith(today.getFullYear(), today.getMonth() + 1)
  })
})
