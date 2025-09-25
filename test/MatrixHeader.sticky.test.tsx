import "@testing-library/jest-dom/vitest"

import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import MatrixHeader from "@/components/Schedule/MatrixHeader"

describe("MatrixHeader sticky positioning", () => {
  it("keeps the first column pinned on scroll", () => {
    const { container } = render(
      <table>
        <MatrixHeader year={2025} month={9} days={[1, 2]} perDayLeaders={{ 1: 1, 2: 0 }} />
      </table>,
    )

    const headerCells = container.querySelectorAll<HTMLTableCellElement>("th")
    expect(headerCells).not.toHaveLength(0)

    const firstColumn = headerCells[0]
    expect(firstColumn).toHaveClass("sticky")
    expect(firstColumn).toHaveClass("left-0")
    expect(firstColumn).toHaveClass("top-0")

    const firstDayHeader = headerCells[1]
    expect(firstDayHeader).toHaveClass("sticky")
    expect(firstDayHeader).toHaveClass("top-0")
  })
})
