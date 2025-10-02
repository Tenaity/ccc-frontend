import React from "react"
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import ConfigPage from "../src/pages/Config"
import { UiProvider } from "../src/components/ui/UiProvider"

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  })
}

describe("ConfigPage", () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const sampleOffday = `${currentYear}-${String(currentMonth).padStart(2, "0")}-03`

  const defaultMonthConfig = {
    year: currentYear,
    month: currentMonth,
    weekend_policy: "sat_sun",
    auto_working_days: 20,
    extra_offdays: [sampleOffday],
    extra_workdays: [],
    working_days_override: null,
  }

  const defaultShiftDefaults = {
    year: currentYear,
    month: currentMonth,
    defaults: {
      day: 5,
      night: 2,
      leader: 1,
      pgd: 1,
      hc: 1,
    },
  }

  const defaultHolidays: any[] = []

  let fetchMock: ReturnType<typeof vi.fn>
  let savedMonthConfigBody: any
  let savedShiftDefaultsBody: any
  let savedGenerateBody: any

  const originalFetch = global.fetch

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
    savedMonthConfigBody = null
    savedShiftDefaultsBody = null
    savedGenerateBody = null

    fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.url
      const method = (init?.method || (typeof input !== "string" ? input.method : undefined) || "GET").toUpperCase()

      if (url.startsWith("/api/holidays") && method === "GET") {
        return jsonResponse(defaultHolidays)
      }

      if (url.startsWith("/api/month-config") && method === "GET") {
        return jsonResponse(defaultMonthConfig)
      }

      if (url.startsWith("/api/shift-defaults") && method === "GET") {
        return jsonResponse(defaultShiftDefaults)
      }

      if (url === "/api/month-config" && method === "PUT") {
        const body = JSON.parse(init?.body as string)
        savedMonthConfigBody = body
        return jsonResponse({ ...defaultMonthConfig, ...body })
      }

      if (url === "/api/shift-defaults" && method === "PUT") {
        const body = JSON.parse(init?.body as string)
        savedShiftDefaultsBody = body
        return jsonResponse({ ...defaultShiftDefaults, defaults: body.defaults })
      }

      if (url === "/api/schedule/generate" && method === "POST") {
        const body = JSON.parse(init?.body as string)
        savedGenerateBody = body
        return jsonResponse({ ok: true })
      }

      throw new Error(`Unhandled request: ${method} ${url}`)
    })

    // @ts-expect-error setting global fetch for tests
    global.fetch = fetchMock
  })

  afterEach(() => {
    fetchMock.mockClear()
    global.fetch = originalFetch
  })

  function renderConfig() {
    return render(
      <UiProvider>
        <ConfigPage />
      </UiProvider>,
    )
  }

  it("calls month-config and shift-defaults with updated payloads when saving", async () => {
    renderConfig()

    const user = userEvent.setup()
    await user.click(screen.getByRole("tab", { name: /Month plan/i }))

    const saveButton = await screen.findByRole("button", { name: /^Save$/i })
    await waitFor(() => expect(saveButton).not.toBeDisabled())

    fireEvent.click(screen.getByLabelText("Ch\u1ec9 Ch\u1ee7 nh\u1eadt"))

    const overrideInput = await screen.findByTestId("working-days-override")
    fireEvent.change(overrideInput, { target: { value: "22" } })

    const dayInput = (await screen.findByTestId("shift-default-day")) as HTMLInputElement
    fireEvent.change(dayInput, { target: { value: "9" } })

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(savedMonthConfigBody).not.toBeNull()
      expect(savedShiftDefaultsBody).not.toBeNull()
    })

    expect(savedMonthConfigBody).toMatchObject({
      year: currentYear,
      month: currentMonth,
      weekend_policy: "sun_only",
      extra_offdays: [sampleOffday],
      extra_workdays: [],
      working_days_override: 22,
    })

    expect(savedShiftDefaultsBody).toMatchObject({
      year: currentYear,
      month: currentMonth,
      defaults: expect.objectContaining({
        day: 9,
        night: 2,
        leader: 1,
        pgd: 1,
        hc: 1,
      }),
    })
  })

  it("sends schedule generation request with current selection", async () => {
    renderConfig()

    const user = userEvent.setup()
    await user.click(screen.getByRole("tab", { name: /Month plan/i }))

    const generateButton = await screen.findByRole("button", { name: /Generate Schedule/i })
    await waitFor(() => expect(generateButton).not.toBeDisabled())

    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(savedGenerateBody).toBeTruthy()
    })

    expect(savedGenerateBody).toMatchObject({
      year: currentYear,
      month: currentMonth,
      fill_hc: false,
    })
  })
})
