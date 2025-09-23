import React from "react";
import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

import MatrixTable from "@/components/schedule/MatrixTable";
import type {
  Assignment,
  DayPlaceSummary,
  ExpectedPerDay,
  Staff,
} from "../src/types";

const staffMember: Staff = {
  id: 1,
  full_name: "Nguyễn Văn A",
  role: "TC",
  can_night: true,
  base_quota: 12,
  notes: null,
};

const assignmentIndex = new Map<
  string,
  { code: Assignment["shift_code"]; position: Assignment["position"] | null }
>([
  ["1|2025-09-01", { code: "K", position: "TD" }],
  ["1|2025-09-02", { code: "CA1", position: null }],
]);

const summariesByStaffId = new Map([
  [
    1,
    {
      counts: { CA1: 1, CA2: 0, K: 1, Đ: 0, HC: 0, P: 0 },
      credit: 2,
      dayCount: 2,
      nightCount: 0,
    },
  ],
]);

const perDayLeaders: Record<number, number> = { 1: 1, 2: 0 };

const perDayByPlace: Record<number, DayPlaceSummary> = {
  1: {
    TD: { K: 1, CA1: 0, CA2: 0, D: 0 },
    PGD: { K: 0, CA2: 0, D: 0 },
  },
  2: {
    TD: { K: 0, CA1: 1, CA2: 0, D: 0 },
    PGD: { K: 0, CA2: 0, D: 0 },
  },
};

const expectedByDay: Record<number, ExpectedPerDay> = {
  1: {
    expectedTD: { K: 1, CA1: 1, CA2: 0, D: 0 },
    expectedPGD: { K: 0, CA2: 0, D: 0 },
  },
  2: {
    expectedTD: { K: 1, CA1: 1, CA2: 0, D: 0 },
    expectedPGD: { K: 0, CA2: 0, D: 0 },
  },
};

const fixedByDayStaff = new Map<string, boolean>();
const offByDayStaff = new Map<string, boolean>();

const staff: Staff[] = [staffMember];

const baseProps = {
  year: 2025,
  month: 9,
  days: [1, 2],
  staff,
  assignmentIndex,
  summariesByStaffId,
  perDayLeaders,
  perDayByPlace,
  expectedByDay,
  fixedByDayStaff,
  offByDayStaff,
  loading: false,
  error: null,
};

test("matrix table renders without axe violations", async () => {
  const { container } = render(<MatrixTable {...baseProps} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
