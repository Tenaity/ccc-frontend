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
    // Updated to match glass-morphism implementation
    expect(listbox).toHaveClass("bg-white/95")
    expect(listbox).toHaveClass("backdrop-blur-2xl")
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
    // Updated to match glass-morphism implementation
    expect(content).toHaveClass("bg-white/95")
    expect(content).toHaveClass("backdrop-blur-2xl")
    expect(content).toMatchSnapshot()
  })
})
