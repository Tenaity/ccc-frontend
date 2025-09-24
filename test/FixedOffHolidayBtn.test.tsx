import React from "react"
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from "vitest"
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"

import type { FixedAssignment, Holiday, OffDay, Staff } from "../src/types"
import FixedOffHolidayBtn from "../src/components/schedule/FixedOffHolidayBtn"
import { UiProvider } from "../src/components/ui/UiProvider"

vi.mock("@/components/ui/date-picker", () => {
  const DatePicker = ({ value, onChange, ...props }: { value?: Date; onChange: (date: Date | undefined) => void } & Omit<
    React.ComponentProps<"input">,
    "value" | "onChange" | "type"
  >) => (
    <input
      type="date"
      {...props}
      value={value ? value.toISOString().slice(0, 10) : ""}
      onChange={(event) => {
        const next = event.currentTarget.value
        onChange(next ? new Date(`${next}T00:00:00`) : undefined)
      }}
    />
  )

  return { DatePicker }
})

vi.mock("@/components/ui/select", () => {
  const React = require("react") as typeof import("react")

  type Option = { value: string; label: string }

  type SelectContextValue = {
    value?: string
    disabled?: boolean
    onValueChange?: (next: string) => void
    options: Option[]
    registerOption: (option: Option) => void
    placeholder?: string
    setPlaceholder: (text?: string) => void
  }

  const SelectContext = React.createContext<SelectContextValue | null>(null)

  type SelectProps = {
    value?: string
    onValueChange?: (next: string) => void
    disabled?: boolean
    children: React.ReactNode
  }

  const Select = ({ value, onValueChange, disabled, children }: SelectProps) => {
    const [options, setOptions] = React.useState<Option[]>([])
    const [placeholder, setPlaceholder] = React.useState<string | undefined>(undefined)

    const registerOption = React.useCallback((option: Option) => {
      setOptions((prev) => {
        if (prev.some((item) => item.value === option.value)) {
          return prev
        }
        return [...prev, option]
      })
    }, [])

    const contextValue = React.useMemo<SelectContextValue>(
      () => ({
        value,
        disabled,
        onValueChange,
        options,
        registerOption,
        placeholder,
        setPlaceholder,
      }),
      [value, disabled, onValueChange, options, registerOption, placeholder],
    )

    return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>
  }

  const toText = (node: React.ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") {
      return String(node)
    }
    if (Array.isArray(node)) {
      return node.map(toText).join("")
    }
    if (React.isValidElement(node)) {
      return toText(node.props.children)
    }
    return ""
  }

  const SelectTrigger = React.forwardRef<
    HTMLSelectElement,
    React.SelectHTMLAttributes<HTMLSelectElement>
  >(({ children: _children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext)
    return (
      <select
        ref={ref}
        value={ctx?.value ?? ""}
        onChange={(event) => ctx?.onValueChange?.(event.currentTarget.value)}
        disabled={ctx?.disabled}
        {...props}
      >
        <option value="" disabled hidden>
          {ctx?.placeholder ?? ""}
        </option>
        {ctx?.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  })

  const SelectValue = ({ placeholder }: { placeholder?: string }) => {
    const ctx = React.useContext(SelectContext)
    React.useEffect(() => {
      ctx?.setPlaceholder(placeholder)
    }, [ctx, placeholder])
    return null
  }

  const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>

  const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
    const ctx = React.useContext(SelectContext)
    React.useEffect(() => {
      const label = toText(children)
      if (ctx && label) {
        ctx.registerOption({ value, label })
      }
    }, [ctx, value, children])
    return null
  }

  return { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
})

const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" })
})

afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
})

afterAll(() => {
  server.close()
})

describe("FixedOffHolidayBtn", () => {
  test("opens dialog, submits fixed assignment, shows toast, and refreshes on close", async () => {
    const user = userEvent.setup()

    let fixed: FixedAssignment[] = []
    let off: OffDay[] = []
    let holidays: Holiday[] = []

    const staffMembers: Staff[] = [
      { id: 1, full_name: "Alice Nguyễn", role: "TC", can_night: true, base_quota: 10 },
      { id: 2, full_name: "Bob Trần", role: "GDV", can_night: false, base_quota: 8 },
    ]

    server.use(
      http.get("/api/staff", () => HttpResponse.json(staffMembers)),
      http.get("/api/fixed", () => HttpResponse.json(fixed)),
      http.get("/api/off", () => HttpResponse.json(off)),
      http.get("/api/holidays", () => HttpResponse.json(holidays)),
      http.post("/api/fixed", async ({ request }) => {
        const body = await request.json()
        const item: FixedAssignment = {
          id: fixed.length + 1,
          staff_id: body.staff_id,
          day: body.day,
          shift_code: body.shift_code,
          position: body.position ?? null,
          note: null,
        }
        fixed = [...fixed, item]
        return HttpResponse.json({ ok: true, item })
      }),
    )

    const onRefresh = vi.fn().mockResolvedValue(undefined)

    render(
      <UiProvider>
        <FixedOffHolidayBtn year={2025} month={9} onRefresh={onRefresh} />
      </UiProvider>,
    )

    const trigger = screen.getByRole("button", { name: /fixed \/ off \/ holiday/i })
    await user.click(trigger)

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()

    const staffSelect = await screen.findByLabelText("Nhân viên")
    await user.selectOptions(staffSelect, "1")

    const dayInput = screen.getByLabelText("Ngày")
    fireEvent.input(dayInput, { target: { value: "2025-09-10" } })

    const shiftSelect = screen.getByLabelText("Mã ca")
    await user.selectOptions(shiftSelect, "CA1")

    const submitButton = screen.getByRole("button", { name: "Lưu ca cố định" })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onRefresh).toHaveBeenCalledTimes(1)
    })

    expect(await screen.findByText("Đã lưu ca cố định")).toBeInTheDocument()
    expect(await screen.findByText(/2025-09-10 · CA1/i)).toBeInTheDocument()

    const closeButton = screen.getByRole("button", { name: /close dialog/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(onRefresh).toHaveBeenCalledTimes(2)
    })

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })

  test("creates and deletes an off day from the Off tab", async () => {
    const user = userEvent.setup()

    let fixed: FixedAssignment[] = []
    let off: OffDay[] = []
    let holidays: Holiday[] = []

    const staffMembers: Staff[] = [
      { id: 1, full_name: "Alice Nguyễn", role: "TC", can_night: true, base_quota: 10 },
    ]

    server.use(
      http.get("/api/staff", () => HttpResponse.json(staffMembers)),
      http.get("/api/fixed", () => HttpResponse.json(fixed)),
      http.get("/api/off", () => HttpResponse.json(off)),
      http.get("/api/holidays", () => HttpResponse.json(holidays)),
      http.post("/api/off", async ({ request }) => {
        const body = await request.json()
        const item: OffDay = {
          id: off.length + 1,
          staff_id: body.staff_id,
          day: body.day,
          reason: body.reason ?? null,
        }
        off = [...off, item]
        return HttpResponse.json({ ok: true, item })
      }),
      http.delete("/api/off/:id", ({ params }) => {
        const id = Number(params.id)
        off = off.filter((item) => item.id !== id)
        return HttpResponse.json({ ok: true })
      }),
    )

    render(
      <UiProvider>
        <FixedOffHolidayBtn year={2025} month={9} />
      </UiProvider>,
    )

    await user.click(screen.getByRole("button", { name: /fixed \/ off \/ holiday/i }))

    await user.click(screen.getByRole("tab", { name: "Ngày nghỉ" }))

    const offPanel = await screen.findByRole("tabpanel", { name: "Ngày nghỉ" })
    const offWithin = within(offPanel)

    await user.selectOptions(await offWithin.findByLabelText("Nhân viên"), "1")
    fireEvent.input(offWithin.getByLabelText("Ngày nghỉ"), {
      target: { value: "2025-09-12" },
    })
    await user.type(offWithin.getByLabelText("Lý do (tuỳ chọn)"), "Đi công tác")

    await user.click(offWithin.getByRole("button", { name: "Lưu ngày nghỉ" }))

    expect(await screen.findByText("Đã lưu ngày nghỉ")).toBeInTheDocument()
    expect(screen.getByText(/2025-09-12/)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Xóa" }))

    await waitFor(() => {
      expect(screen.getByText("Chưa có ngày nghỉ.")).toBeInTheDocument()
    })
  })

  test("surfaces API errors and avoids refresh on failure", async () => {
    const user = userEvent.setup()

    const staffMembers: Staff[] = [
      { id: 1, full_name: "Alice Nguyễn", role: "TC", can_night: true, base_quota: 10 },
    ]

    server.use(
      http.get("/api/staff", () => HttpResponse.json(staffMembers)),
      http.get("/api/fixed", () => HttpResponse.json([])),
      http.get("/api/off", () => HttpResponse.json([])),
      http.get("/api/holidays", () => HttpResponse.json([])),
      http.post("/api/holidays", () =>
        HttpResponse.json({ error: "Không thể lưu" }, { status: 500 }),
      ),
    )

    const onRefresh = vi.fn()

    render(
      <UiProvider>
        <FixedOffHolidayBtn year={2025} month={9} onRefresh={onRefresh} />
      </UiProvider>,
    )

    await user.click(screen.getByRole("button", { name: /fixed \/ off \/ holiday/i }))

    await user.click(screen.getByRole("tab", { name: "Ngày lễ" }))

    const holidayPanel = await screen.findByRole("tabpanel", { name: "Ngày lễ" })
    const holidayWithin = within(holidayPanel)

    fireEvent.input(holidayWithin.getByLabelText("Ngày lễ"), {
      target: { value: "2025-09-02" },
    })
    await user.click(holidayWithin.getByRole("button", { name: "Lưu ngày lễ" }))

    expect(await screen.findByText("Thao tác thất bại")).toBeInTheDocument()
    expect(screen.getByText(/Không thể lưu/)).toBeInTheDocument()
    expect(onRefresh).not.toHaveBeenCalled()
  })
})
