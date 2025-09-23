import "@testing-library/jest-dom/vitest"

import { MemoryRouter } from "react-router-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"

import App from "./App"
import { UiProvider } from "@/components/ui/UiProvider"
import type { DayPlaceSummary } from "@/types"

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
    staff: [],
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
  Promise<number>,
  [{ toastApi: ReturnType<typeof import("@/components/ui/use-toast").useToast>; year: number; month: number }]
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

function renderScheduleApp() {
  return render(
    <UiProvider>
      <MemoryRouter initialEntries={["/schedule"]}>
        <App />
      </MemoryRouter>
    </UiProvider>,
  )
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

    const generateButton = await screen.findByTestId("header-generate")
    await user.click(generateButton)
    await screen.findByText(/Đã sinh lịch tạm thời/i)

    const validateButton = screen.getByTestId("header-validate")
    await user.click(validateButton)
    await screen.findByText(/Lịch hợp lệ/i)

    const exportButton = screen.getByTestId("header-export")
    await user.click(exportButton)
    await screen.findByText(/Export success/i)
  })

  test("shows destructive toast when generate fails", async () => {
    mockOnGenerate.mockResolvedValue({ ok: false, conflicts: [{}, {}] })

    renderScheduleApp()
    const user = userEvent.setup()

    const generateButton = await screen.findByTestId("header-generate")
    await user.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText(/Sinh lịch thất bại/i)).toBeInTheDocument()
      expect(screen.getByText(/2 xung đột/i)).toBeInTheDocument()
    })
  })
})
