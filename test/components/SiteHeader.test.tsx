import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { UiProvider } from "@/components/ui/UiProvider"

function renderSiteHeader(
  ui: React.ReactElement,
  { withRouter = false }: { withRouter?: boolean } = {},
) {
  const content = withRouter ? <MemoryRouter>{ui}</MemoryRouter> : ui

  return render(
    <UiProvider>
      <SidebarProvider defaultOpen>{content}</SidebarProvider>
    </UiProvider>,
  )
}

describe("SiteHeader", () => {
  it("matches mobile snapshot", () => {
    const { asFragment } = renderSiteHeader(
      <SiteHeader
        title="Schedule"
        description="Theo dõi và quản lý phân ca."
        breadcrumbs={[{ label: "Schedule" }]}
      />,
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it("matches desktop snapshot with actions", () => {
    const { asFragment } = renderSiteHeader(
      <SiteHeader
        title="Schedule"
        description="Theo dõi và quản lý phân ca."
        actions={<button type="button">Tạo mới</button>}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Schedule" },
        ]}
      />,
      { withRouter: true },
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
