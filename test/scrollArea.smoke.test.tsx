import React from "react"
import { expect, test } from "vitest"
import { render, screen } from "@testing-library/react"

import { ScrollArea } from "../src/components/ui/scroll-area"

test("scroll area renders canvas-backed scrollbars without crashing", () => {
  const { container } = render(
    <div style={{ height: 160, width: 160 }}>
      <ScrollArea
        className="h-full w-full rounded-md border"
        data-testid="canvas-scroll-area"
      >
        <div style={{ padding: 8 }}>
          <ul>
            {Array.from({ length: 20 }, (_, index) => (
              <li key={index}>Mục {index + 1}</li>
            ))}
          </ul>
        </div>
      </ScrollArea>
    </div>
  )

  expect(screen.getByTestId("canvas-scroll-area")).toBeInTheDocument()
  expect(screen.getByText(/Mục 5/)).toBeInTheDocument()
  expect(
    container.querySelector("[data-radix-scroll-area-viewport]")
  ).not.toBeNull()
})
