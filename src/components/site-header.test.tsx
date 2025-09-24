import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { SidebarProvider } from "@/components/ui/sidebar"

import { SiteHeader } from "./site-header"

describe("SiteHeader", () => {
  it("renders sticky header with layout container", () => {
    render(
      <MemoryRouter>
        <SidebarProvider>
          <SiteHeader
            title="Schedule"
            description="Monthly schedule overview"
            breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Schedule" }]}
            actions={<button type="button">Action</button>}
          />
        </SidebarProvider>
      </MemoryRouter>,
    )

    const header = screen.getByRole("banner")
    expect(header).toHaveClass("sticky", "top-0", "z-10", "border-b", "backdrop-blur")

    const wrapper = header.firstElementChild
    if (!(wrapper instanceof HTMLElement)) {
      throw new Error("expected header to contain wrapper element")
    }
    expect(wrapper).toHaveClass(
      "mx-auto",
      "w-full",
      "max-w-[1400px]",
      "px-3",
      "md:px-6",
    )

    expect(screen.getByRole("heading", { name: "Schedule" })).toBeVisible()
    expect(screen.getByText("Monthly schedule overview")).toBeVisible()
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeVisible()
    expect(screen.getByRole("button", { name: "Action" })).toBeVisible()
  })
})
