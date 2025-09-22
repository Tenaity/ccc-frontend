import { afterEach, expect, test } from "vitest"
import { cleanup, render } from "@testing-library/react"
import React from "react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

afterEach(() => {
  cleanup()
})

test("basic table snapshot", () => {
  const { container } = render(
    <Table stickyHeader>
      <TableCaption>Team assignments</TableCaption>
      <TableHeader sticky>
        <TableRow>
          <TableHead>Nhân sự</TableHead>
          <TableHead className="text-right">Ca</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Nguyễn Văn A</TableCell>
          <TableCell className="text-right">CA1</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Trần Thị B</TableCell>
          <TableCell className="text-right">CA2</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Tổng</TableCell>
          <TableCell className="text-right">2 ca</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )

  expect(container.firstChild).toMatchSnapshot()
})
