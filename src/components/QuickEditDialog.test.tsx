import "@testing-library/jest-dom/vitest"

import { render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"

import QuickEditDialog from "./QuickEditDialog"
import type { Staff } from "@/types"
import { StaffRole } from "@/types"

const baseStaff: Staff = {
  id: 1,
  full_name: "Alice Nguyen",
  role: StaffRole.TC,
  can_night: true,
  base_quota: 10,
  notes: null,
}

const otherStaff: Staff = {
  id: 2,
  full_name: "Bob Tran",
  role: StaffRole.GDV,
  can_night: false,
  base_quota: 8,
  notes: null,
}

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({ reasons: [] }),
  } as unknown as Response)
})

afterEach(() => {
  vi.restoreAllMocks()
})

test("renders a styled quick edit dialog with a blurred overlay", async () => {
  const handleClose = vi.fn()

  render(
    <QuickEditDialog
      open
      day="2024-01-01"
      current={baseStaff}
      candidates={[baseStaff, otherStaff]}
      fixed={false}
      onClose={handleClose}
    />,
  )

  const dialog = await screen.findByRole("dialog", { name: /quick edit/i })
  expect(dialog).toHaveClass("bg-background")
  expect(dialog).toHaveClass("text-foreground")
  expect(dialog).toHaveClass("shadow-lg")
  expect(dialog).toHaveClass("border")
  expect(dialog).toHaveClass("rounded-lg")

  const overlay = document.querySelector('[data-slot="dialog-overlay"]')
  expect(overlay).toBeInTheDocument()
  expect(overlay).toHaveClass("bg-black/50")
  expect(overlay).toHaveClass("backdrop-blur-sm")
})
