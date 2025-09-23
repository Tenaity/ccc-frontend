import "@testing-library/jest-dom/vitest"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { expect, test } from "vitest"
import { axe } from "vitest-axe"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

function renderSidebar(initialPath = "/schedule") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    </MemoryRouter>,
  )
}

test("renders Schedule nav item and marks it active on /schedule", async () => {
  const { container } = renderSidebar("/schedule")

  const scheduleLink = screen.getByRole("link", { name: /schedule/i })
  expect(scheduleLink).toBeInTheDocument()
  expect(scheduleLink).toHaveAttribute("data-active", "true")

  const results = await axe(container)
  expect(results.violations).toHaveLength(0)
})

test("navigates to /schedule when clicking the sidebar link", async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={["/"]}>
      <SidebarProvider>
        <AppSidebar />
        <Routes>
          <Route path="/" element={<div>Dashboard Home</div>} />
          <Route path="/schedule" element={<div>Schedule Page</div>} />
        </Routes>
      </SidebarProvider>
    </MemoryRouter>,
  )

  const scheduleLink = screen.getByRole("link", { name: /schedule/i })
  await user.click(scheduleLink)

  expect(screen.getByText(/schedule page/i)).toBeInTheDocument()
})
