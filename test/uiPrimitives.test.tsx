import { afterEach, expect, test } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

afterEach(() => {
  cleanup()
})

test("dialog traps focus and closes via overlay and escape", async () => {
  const user = userEvent.setup({ pointerEventsCheck: "never" })

  render(
    <>
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session details</DialogTitle>
            <DialogDescription>Confirm the pending schedule change.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3">
            <button type="button">Confirm action</button>
          </div>
        </DialogContent>
      </Dialog>
      <button type="button">Outside button</button>
    </>
  )

  const trigger = screen.getByRole("button", { name: "Open dialog" })
  const outsideButton = screen.getByRole("button", { name: "Outside button" })
  await user.click(trigger)

  await screen.findByRole("dialog", { name: /session details/i })
  const confirmButton = screen.getByRole("button", { name: "Confirm action" })
  const closeButton = screen.getByRole("button", { name: /close dialog/i })

  const focusables = [confirmButton, closeButton]
  expect(focusables).toContain(document.activeElement)

  await user.tab()
  expect(focusables).toContain(document.activeElement)

  await user.tab()
  expect(focusables).toContain(document.activeElement)
  expect(outsideButton).not.toHaveFocus()

  const overlay = document.querySelector('[data-slot="dialog-overlay"]') as
    | HTMLElement
    | null
  expect(overlay).not.toBeNull()
  await user.click(overlay as HTMLElement)

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  await user.click(trigger)
  await screen.findByRole("dialog", { name: /session details/i })
  await user.keyboard("{Escape}")

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})

test("tabs switch panels with arrow keys", async () => {
  const user = userEvent.setup()

  render(
    <Tabs defaultValue="overview">
      <TabsList aria-label="Scheduling views">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview body</TabsContent>
      <TabsContent value="settings">Settings body</TabsContent>
      <TabsContent value="reports">Reports body</TabsContent>
    </Tabs>
  )

  const overviewTab = screen.getByRole("tab", { name: "Overview" })
  overviewTab.focus()
  expect(overviewTab).toHaveFocus()
  expect(screen.getByText("Overview body")).toBeVisible()

  await user.keyboard("{ArrowRight}")
  await waitFor(() => {
    expect(screen.getByRole("tab", { name: "Settings" })).toHaveFocus()
  })
  expect(screen.getByText("Settings body")).toBeVisible()

  await user.keyboard("{ArrowRight}")
  await waitFor(() => {
    expect(screen.getByRole("tab", { name: "Reports" })).toHaveFocus()
  })
  expect(screen.getByText("Reports body")).toBeVisible()

  await user.keyboard("{ArrowRight}")
  await waitFor(() => {
    expect(overviewTab).toHaveFocus()
  })
  expect(screen.getByText("Overview body")).toBeVisible()

  await user.keyboard("{ArrowLeft}")
  await waitFor(() => {
    expect(screen.getByRole("tab", { name: "Reports" })).toHaveFocus()
  })
  expect(screen.getByText("Reports body")).toBeVisible()
})

