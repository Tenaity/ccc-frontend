import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import ConflictList from "../src/components/ConflictList";

const sampleConflicts = [
  { day: "2025-09-04", type: "OFFDAY_VS_FIXED", message: "Trùng ngày nghỉ" },
];

test("conflict list renders accessible alert", async () => {
  const { container } = render(<ConflictList conflicts={sampleConflicts} />);

  const alert = screen.getByRole("alert");
  expect(alert).toHaveTextContent(/cảnh báo xung đột/i);
  expect(screen.getByRole("list", { name: /danh sách xung đột lịch/i })).toBeInTheDocument();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
