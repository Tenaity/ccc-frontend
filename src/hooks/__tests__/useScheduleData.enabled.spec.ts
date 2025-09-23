import { describe, expect, test } from "vitest"

import { isScheduleEnabled } from "../useScheduleData"

describe("isScheduleEnabled", () => {
  test("defaults to true when options are undefined", () => {
    expect(isScheduleEnabled()).toBe(true)
  })

  test("respects explicit true flag", () => {
    expect(isScheduleEnabled({ enabled: true })).toBe(true)
  })

  test("respects explicit false flag", () => {
    expect(isScheduleEnabled({ enabled: false })).toBe(false)
  })
})
