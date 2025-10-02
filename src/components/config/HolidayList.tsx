import { Trash2 } from "lucide-react"
import type { Holiday } from "@/types"
import { GlassButton } from "@/components/ui/glass"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDisplayDate } from "./utils"

interface HolidayListProps {
  holidays: Holiday[]
  loading: boolean
  year: number
  onRemove: (holiday: Holiday) => void
}

export function HolidayList({ holidays, loading, year, onRemove }: HolidayListProps) {
  const sortedHolidays = [...holidays].sort((a, b) =>
    a.day.localeCompare(b.day, "en-US", { sensitivity: "base" })
  )

  return (
    <Table stickyHeader>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[160px]">Ngày</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead className="w-[140px] text-center">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              Đang tải danh sách…
            </TableCell>
          </TableRow>
        ) : sortedHolidays.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              Chưa có ngày nghỉ cho năm {year}.
            </TableCell>
          </TableRow>
        ) : (
          sortedHolidays.map((holiday) => (
            <TableRow key={holiday.id ?? holiday.day}>
              <TableCell>{formatDisplayDate(holiday.day)}</TableCell>
              <TableCell>{holiday.name ?? "—"}</TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <GlassButton
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(holiday)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" /> Xóa
                  </GlassButton>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
