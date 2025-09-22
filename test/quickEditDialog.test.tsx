import { afterEach, beforeAll, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@testing-library/react";
import React from "react";

import QuickEditDialog from "../src/components/QuickEditDialog";
import type { Staff } from "@/types";

const staffA: Staff = {
  id: 1,
  full_name: "Alice",
  role: "TC",
  can_night: true,
  base_quota: 5,
};

const staffB: Staff = {
  id: 2,
  full_name: "Bob",
  role: "TC",
  can_night: true,
  base_quota: 5,
};

beforeAll(() => {
  Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: () => {},
  });
  Object.defineProperty(window.HTMLElement.prototype, "hasPointerCapture", {
    configurable: true,
    value: () => false,
  });
  Object.defineProperty(window.HTMLElement.prototype, "releasePointerCapture", {
    configurable: true,
    value: () => {},
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("shows validation reasons from the API", async () => {
  const fetchMock = vi
    .spyOn(global, "fetch")
    .mockResolvedValue({
      ok: true,
      json: async () => ({ reasons: ["lock", "quota"] }),
    } as unknown as Response);

  const user = userEvent.setup({ pointerEventsCheck: "never" });

  render(
    <QuickEditDialog
      open
      day="2025-09-01"
      current={staffA}
      candidates={[staffA, staffB]}
      onClose={() => {}}
    />
  );

  const trigger = screen.getByLabelText(/nhân viên/i);
  await user.click(trigger);
  const listbox = await screen.findByRole("listbox");
  await user.click(within(listbox).getByRole("option", { name: "Bob" }));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/schedule/validate?day=2025-09-01&staff_id=2",
      expect.objectContaining({ signal: expect.any(Object) })
    );
  });

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent("Không thể gán: lock, quota");

  const items = screen.getAllByRole("listitem");
  expect(items.map((item) => item.textContent)).toEqual(["lock", "quota"]);

  expect(screen.getByRole("button", { name: /assign/i })).toBeDisabled();
});

test("allows assigning when validation passes", async () => {
  const fetchMock = vi
    .spyOn(global, "fetch")
    .mockResolvedValue({
      ok: true,
      json: async () => ({ reasons: [] }),
    } as unknown as Response);

  const user = userEvent.setup({ pointerEventsCheck: "never" });

  render(
    <QuickEditDialog
      open
      day="2025-09-01"
      current={staffA}
      candidates={[staffA, staffB]}
      onClose={() => {}}
    />
  );

  const trigger = screen.getByLabelText(/nhân viên/i);
  await user.click(trigger);
  const listbox = await screen.findByRole("listbox");
  await user.click(within(listbox).getByRole("option", { name: "Bob" }));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  await waitFor(() => {
    expect(screen.getByRole("button", { name: /assign/i })).not.toBeDisabled();
  });

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
