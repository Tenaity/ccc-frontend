import { renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useAttendance, useStaffWorkload } from "@/hooks/useAnalyticsMetrics"

const originalFetch = global.fetch
let fetchMock: ReturnType<typeof vi.fn>

function createResponse(body: unknown, ok = true, statusText = "OK") {
  return {
    ok,
    statusText,
    text: vi.fn(async () => JSON.stringify(body)),
  } as unknown as Response
}

describe("useAnalyticsMetrics hooks", () => {
  beforeEach(() => {
    fetchMock = vi.fn()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    fetchMock.mockReset()
    global.fetch = originalFetch
  })

  it("loads staff workload data and normalizes response", async () => {
    const mockData = [
      { staff_id: 1, staff_name: "Alice", total_hours: 160, overtime_hours: 12 },
      { staff_id: 2, staff_name: "Bob", total_hours: 150 },
    ]
    fetchMock.mockResolvedValue(createResponse(mockData))

    const { result } = renderHook(() => useStaffWorkload(2024, 6))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/metrics/staff-workload?year=2024&month=6",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual([
      { id: "1", name: "Alice", totalHours: 160, overtimeHours: 12 },
      { id: "2", name: "Bob", totalHours: 150, overtimeHours: 0 },
    ])
    expect(result.current.isEmpty).toBe(false)
  })

  it("exposes errors when the workload request fails", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ error: "Invalid selection" }, false, "Bad Request"),
    )

    const { result } = renderHook(() => useStaffWorkload(2024, 6))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe("Invalid selection")
  })

  it("normalizes attendance payloads with optional fields", async () => {
    const attendancePayload = {
      attendance_rate: 0.92,
      present: 46,
      absent: 4,
      absences: [
        {
          staff_id: 7,
          staff_name: "Jane",
          date: "2024-06-03",
          reason: "Nghỉ phép",
          department: "CSKH",
        },
      ],
    }
    fetchMock.mockResolvedValue(createResponse(attendancePayload))

    const { result } = renderHook(() => useAttendance("2024-06-01", "2024-06-30"))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/metrics/attendance?from=2024-06-01&to=2024-06-30",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual({
      attendanceRate: 0.92,
      present: 46,
      absent: 4,
      total: 50,
      absences: [
        {
          id: "7",
          name: "Jane",
          date: "2024-06-03",
          reason: "Nghỉ phép",
          department: "CSKH",
        },
      ],
    })
    expect(result.current.isEmpty).toBe(false)
  })
})
