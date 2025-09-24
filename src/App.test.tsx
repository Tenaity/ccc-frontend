import "@testing-library/jest-dom/vitest"

import { MemoryRouter } from "react-router-dom"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"

import App from "./App"
import { UiProvider } from "@/components/ui/UiProvider"
import type { DayPlaceSummary, Staff } from "@/types"

const mockOnGenerate = vi.fn()
const mockFetchValidate = vi.fn()
const mockFetchStaff = vi.fn()
const mockFetchFixed = vi.fn()
const mockFetchOffdays = vi.fn()
const mockFetchHolidays = vi.fn()
const mockSetFillHC = vi.fn()

function createScheduleData() {
  const perDayByPlace: Record<number, DayPlaceSummary> = {}
  const expectedByDay = {} as const

  return {
    staff: [] as Staff[],
    loadingGen: false,
    loadingStaff: false,
    staffError: null as string | null,
    validation: { ok: true, conflicts: [] as unknown[] },
    hasLeaderDup: false,
    days: [1],
    assignmentIndex: new Map(),
    summariesByStaffId: new Map(),
    perDayLeaders: {},
    perDayByPlace,
    expectedByDay,
    fixedByDayStaff: new Map(),
    offByDayStaff: new Map(),
    onGenerate: mockOnGenerate,
    fetchStaff: mockFetchStaff,
    fetchFixed: mockFetchFixed,
    fetchOffdays: mockFetchOffdays,
    fetchHolidays: mockFetchHolidays,
    fetchValidate: mockFetchValidate,
    leaderErrors: [] as Array<{ day: number; shift: string }>,
    fillHC: false,
    setFillHC: mockSetFillHC,
  }
}

let scheduleDataValue = createScheduleData()

vi.mock("@/hooks/useScheduleData", () => ({
  useScheduleData: vi.fn(() => scheduleDataValue),
  isScheduleEnabled: vi.fn(() => true),
}))

const exportCsvMock = vi.fn<
  [{ toastApi: ReturnType<typeof import("@/components/ui/use-toast").useToast>; year: number; month: number }],
  Promise<number>
>()

vi.mock("@/hooks/useExportCsv", async () => {
  const { useToast } = await import("@/components/ui/use-toast")

  return {
    useExportCsv: () => {
      const toastApi = useToast()
      return {
        isExporting: false,
        exportCsv: async (year: number, month: number) =>
          exportCsvMock({ toastApi, year, month }),
      }
    },
  }
})

vi.mock("./pages/Dashboard", () => ({
  default: () => null,
}))

function renderApp(initialEntries: string[] = ["/schedule"]) {
  return render(
    <UiProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </UiProvider>,
  )
}

function renderScheduleApp() {
  return renderApp(["/schedule"])
}

describe("App schedule actions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    scheduleDataValue = createScheduleData()
  })

  test("shows success toasts for generate, validate, and export", async () => {
    mockOnGenerate.mockResolvedValue({ ok: true, conflicts: [] })
    mockFetchValidate.mockResolvedValue({ ok: true, conflicts: [] })
    exportCsvMock.mockImplementation(async ({ toastApi }) => {
      toastApi.toast({ title: "Export success", description: "Mock 3 dòng" })
      return 3
    })

    renderScheduleApp()
    const user = userEvent.setup()

    const generateButton = await screen.findByTestId("schedule-generate")
    await user.click(generateButton)
    await screen.findByText(/Đã sinh lịch tạm thời/i)

    const validateButton = screen.getByTestId("schedule-validate")
    await user.click(validateButton)
    await screen.findByText(/Lịch hợp lệ/i)

    const exportButton = screen.getByTestId("schedule-export")
    await user.click(exportButton)
    await screen.findByText(/Export success/i)
  })

  test("shows destructive toast when generate fails", async () => {
    mockOnGenerate.mockResolvedValue({ ok: false, conflicts: [{}, {}] })

    renderScheduleApp()
    const user = userEvent.setup()

    const generateButton = await screen.findByTestId("schedule-generate")
    await user.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText(/Sinh lịch thất bại/i)).toBeInTheDocument()
      expect(screen.getByText(/2 xung đột/i)).toBeInTheDocument()
    })
  })
})

describe("App schedule navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    scheduleDataValue = createScheduleData()
  })

  test("navigates via sidebar and shows sticky headers on schedule matrix", async () => {
    const sampleStaff: Staff = {
      id: 7,
      full_name: "Tran Thi B",
      role: "TC",
      can_night: true,
      base_quota: 12,
      notes: "[CODE:777][RANK:1]",
    }

    scheduleDataValue = {
      ...scheduleDataValue,
      staff: [sampleStaff],
      days: [1],
      perDayLeaders: { 1: 1 },
      summariesByStaffId: new Map([
        [
          sampleStaff.id,
          {
            counts: { CA1: 0, CA2: 0, K: 0, HC: 0, "Đ": 0, P: 0 },
            credit: 0,
            dayCount: 0,
            nightCount: 0,
          },
        ],
      ]),
    }

    const user = userEvent.setup()
    renderApp(["/"])

    const scheduleLink = await screen.findByRole("link", { name: /schedule/i })
    await user.click(scheduleLink)

    const scheduleHeader = await screen.findByTestId("schedule-header")
    const pageHeading = within(scheduleHeader).getByRole("heading", {
      level: 1,
      name: /Schedule/i,
    })
    expect(pageHeading).toBeVisible()

    const table = await screen.findByRole("table")
    const staffHeader = within(table).getByRole("columnheader", {
      name: /Nhân viên/i,
    })
    expect(staffHeader).toHaveClass("sticky")
    expect(staffHeader).toHaveClass("left-0", { exact: false })

    const columnHeaders = within(table).getAllByRole("columnheader")
    expect(columnHeaders.length).toBeGreaterThan(1)

    const dayHeader = columnHeaders[1]
    expect(dayHeader).toHaveTextContent(/1/)
    expect(dayHeader).toHaveClass("sticky")
    expect(dayHeader).toHaveClass("top-0", { exact: false })
  })
})
