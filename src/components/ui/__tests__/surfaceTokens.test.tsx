import "@testing-library/jest-dom/vitest"

import { render, screen } from "@testing-library/react"
import { beforeAll, describe, expect, test, vi } from "vitest"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { Button } from "../button"

beforeAll(() => {
  const protoTargets: Array<Record<string, unknown>> = []

  if (typeof window.Element !== "undefined") {
    protoTargets.push(window.Element.prototype as unknown as Record<string, unknown>)
  }

  if (typeof window.HTMLElement !== "undefined") {
    protoTargets.push(
      window.HTMLElement.prototype as unknown as Record<string, unknown>,
    )
  }

  for (const proto of protoTargets) {
    Object.defineProperty(proto, "scrollIntoView", {
      configurable: true,
      writable: true,
      value: vi.fn(),
    })
  }
})

describe("surface tokens", () => {
  test("SelectContent uses popover surface token", async () => {
    render(
      <Select
        value="one"
        onValueChange={() => undefined}
        open
        onOpenChange={() => undefined}
      >
        <SelectTrigger aria-label="Chọn mục">
          <SelectValue placeholder="Chọn" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">Một</SelectItem>
          <SelectItem value="two">Hai</SelectItem>
        </SelectContent>
      </Select>,
    )

    const listbox = await screen.findByRole("listbox")
    expect(listbox).toHaveClass("bg-popover")
    expect(listbox).toMatchSnapshot()
  })

  test("PopoverContent uses popover surface token", async () => {
    render(
      <Popover open>
        <PopoverTrigger asChild>
          <Button type="button">Mở</Button>
        </PopoverTrigger>
        <PopoverContent data-testid="popover-content">Nội dung</PopoverContent>
      </Popover>,
    )

    const content = await screen.findByTestId("popover-content")
    expect(content).toHaveClass("bg-popover")
    expect(content).toMatchSnapshot()
  })
})
