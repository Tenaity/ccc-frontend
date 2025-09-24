import React from "react"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"

import App from "../src/App"
import { UiProvider } from "../src/components/ui/UiProvider"

const useScheduleDataMock = vi.fn()

vi.mock("../src/pages/Dashboard", () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-page" />,
}))

vi.mock("../src/hooks/useScheduleData", () => ({
  useScheduleData: (...args: unknown[]) => useScheduleDataMock(...args),
}))

vi.mock("../src/hooks/useExportCsv", () => ({
  useExportCsv: () => ({
    isExporting: false,
    exportCsv: vi.fn(),
  }),
}))

vi.mock("../src/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}))

describe("App accessibility", () => {
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
      onGenerate: vi.fn(),
      fetchStaff: vi.fn(),
      fetchFixed: vi.fn(),
      fetchOffdays: vi.fn(),
      fetchHolidays: vi.fn(),
      fetchValidate: vi.fn(),
      leaderErrors: [],
      fillHC: false,
      setFillHC: vi.fn(),
    })
  })

  function renderApp(initialPath = "/schedule") {
    return render(
      <UiProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <App />
        </MemoryRouter>
      </UiProvider>
    )
  }

  it("moves focus to the main region when activating the skip link", async () => {
    const user = userEvent.setup()
    renderApp()

    await user.tab()
    const skipLink = screen.getByRole("link", { name: /bỏ qua tới nội dung chính/i })
    expect(skipLink).toHaveFocus()

    await user.keyboard("{Enter}")
    expect(screen.getByRole("main")).toHaveFocus()
  })

  it("maintains sidebar to header focus order", async () => {
    const user = userEvent.setup()
    renderApp()

    await user.tab()
    await user.tab()

    const brandLink = screen.getByRole("link", { name: /customer care/i })
    expect(brandLink).toHaveFocus()
  })

  it("renders breadcrumb navigation for the current route", async () => {
    renderApp()

    const breadcrumbNav = await screen.findByRole("navigation", { name: /breadcrumb/i })
    expect(breadcrumbNav).toBeInTheDocument()
    expect(breadcrumbNav).toHaveTextContent("Dashboard")
    expect(breadcrumbNav).toHaveTextContent("Schedule")
  })

  it("has no major accessibility violations", async () => {
    const { container } = renderApp()

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
