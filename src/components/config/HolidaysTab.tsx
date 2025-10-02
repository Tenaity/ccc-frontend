import React from "react"
import { RefreshCcw, UploadCloud } from "lucide-react"
import type { Holiday } from "@/types"
import { GlassButton, GlassCard } from "@/components/ui/glass"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
  createHolidayEntry,
  deleteHolidayEntry,
  importHolidaysFromNager,
  listHolidaysByYear,
} from "@/lib/api"
import { useHolidayAutoFetch } from "@/hooks/useHolidayAutoFetch"
import { HolidayList } from "./HolidayList"
import { AddHolidayForm } from "./AddHolidayForm"
import { toIsoDate, formatDisplayDate } from "./utils"

export function HolidaysTab() {
  const { toast } = useToast()
  const currentYear = React.useMemo(() => new Date().getFullYear(), [])
  const [year, setYear] = React.useState(currentYear)
  const [holidays, setHolidays] = React.useState<Holiday[]>([])
  const [loading, setLoading] = React.useState(false)
  const [importing, setImporting] = React.useState(false)
  const [adding, setAdding] = React.useState(false)
  const [newDate, setNewDate] = React.useState<Date | undefined>()
  const [newName, setNewName] = React.useState("")
  const [lastImportDelta, setLastImportDelta] = React.useState<number | null>(null)

  const { loading: autoFetching, imported: autoImported } = useHolidayAutoFetch(year)

  const sortedHolidays = React.useMemo(
    () =>
      [...holidays].sort((a, b) =>
        a.day.localeCompare(b.day, "en-US", { sensitivity: "base" })
      ),
    [holidays]
  )

  const yearOptions = React.useMemo(() => {
    const start = year - 2
    return Array.from({ length: 5 }, (_, index) => start + index)
  }, [year])

  const load = React.useCallback(
    async (targetYear: number) => {
      setLoading(true)
      try {
        const result = await listHolidaysByYear(targetYear)
        setHolidays(result)
        return result
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Không thể tải danh sách ngày nghỉ"
        toast({
          variant: "destructive",
          title: "Lỗi tải dữ liệu",
          description: message,
        })
        return undefined
      } finally {
        setLoading(false)
      }
    },
    [toast]
  )

  React.useEffect(() => {
    setLastImportDelta(null)
    void load(year)
  }, [load, year])

  React.useEffect(() => {
    if (autoImported > 0 && !autoFetching) {
      toast({
        title: "Tự động tải ngày nghỉ",
        description: `Đã tự động import ${autoImported} ngày nghỉ cho năm ${year}.`,
      })
    }
  }, [autoFetching, autoImported, toast, year])

  const handleImport = React.useCallback(async () => {
    setImporting(true)
    try {
      const previousCount = holidays.length
      const { imported } = await importHolidaysFromNager(year)
      toast({
        title: "Đã đồng bộ ngày nghỉ",
        description: imported
          ? `Đã thêm ${imported} ngày nghỉ từ Nager.`
          : "Không có ngày nghỉ mới.",
      })
      const refreshed = await load(year)
      const nextCount = refreshed ? refreshed.length : previousCount
      const delta = Math.max(0, nextCount - previousCount)
      setLastImportDelta(delta > 0 ? delta : null)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Không thể import ngày nghỉ"
      toast({
        variant: "destructive",
        title: "Import thất bại",
        description: message,
      })
    } finally {
      setImporting(false)
    }
  }, [holidays.length, load, toast, year])

  const handleAdd = React.useCallback(async () => {
    if (!newDate) {
      toast({
        variant: "destructive",
        title: "Thiếu ngày nghỉ",
        description: "Vui lòng chọn ngày trước khi thêm.",
      })
      return
    }

    const isoDate = toIsoDate(newDate)
    if (holidays.some((holiday) => holiday.day === isoDate)) {
      toast({
        variant: "destructive",
        title: "Ngày đã tồn tại",
        description: "Ngày nghỉ này đã có trong danh sách.",
      })
      return
    }

    setAdding(true)
    try {
      await createHolidayEntry({
        day: isoDate,
        name: newName.trim() || undefined,
      })
      toast({
        title: "Đã thêm ngày nghỉ",
        description: formatDisplayDate(isoDate) + " đã được lưu.",
      })
      setNewDate(undefined)
      setNewName("")
      await load(year)
      setLastImportDelta(null)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Không thể thêm ngày nghỉ"
      toast({
        variant: "destructive",
        title: "Thêm thất bại",
        description: message,
      })
    } finally {
      setAdding(false)
    }
  }, [holidays, load, newDate, newName, toast, year])

  const handleRemove = React.useCallback(
    async (holiday: Holiday) => {
      try {
        await deleteHolidayEntry(holiday.id)
        toast({
          title: "Đã xóa ngày nghỉ",
          description: formatDisplayDate(holiday.day) + " đã được gỡ bỏ.",
        })
        await load(year)
        setLastImportDelta(null)
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Không thể xóa ngày nghỉ"
        toast({
          variant: "destructive",
          title: "Xóa thất bại",
          description: message,
        })
      }
    },
    [load, toast, year]
  )

  return (
    <GlassCard className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase text-muted-foreground">Năm áp dụng</Label>
            <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
              <SelectTrigger className="h-10 w-32">
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <GlassButton
            variant="outline"
            onClick={() => {
              setLastImportDelta(null)
              void load(year)
            }}
            disabled={loading || autoFetching}
            className="gap-2"
          >
            <RefreshCcw
              className={cn("h-4 w-4", (loading || autoFetching) && "animate-spin")}
            />
            {loading || autoFetching ? "Đang tải..." : "Tải lại"}
          </GlassButton>
        </div>
        <div
          className="flex items-center gap-2 text-sm text-muted-foreground"
          data-testid="holiday-count"
        >
          <span>Tổng số ngày nghỉ:</span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {sortedHolidays.length}
          </span>
          {lastImportDelta && lastImportDelta > 0 ? (
            <span data-testid="holiday-count-diff" className="font-medium text-emerald-600">
              (+{lastImportDelta})
            </span>
          ) : null}
        </div>
        <GlassButton
          variant="primary"
          onClick={() => void handleImport()}
          disabled={importing || loading || autoFetching}
          className="gap-2"
        >
          <UploadCloud className="h-4 w-4" />
          {importing
            ? "Đang import…"
            : autoFetching
              ? "Đang tự động import..."
              : "Import from Nager"}
        </GlassButton>
      </div>

      <AddHolidayForm
        newDate={newDate}
        newName={newName}
        adding={adding}
        onDateChange={setNewDate}
        onNameChange={setNewName}
        onAdd={() => void handleAdd()}
      />

      <HolidayList
        holidays={sortedHolidays}
        loading={loading}
        year={year}
        onRemove={(holiday) => void handleRemove(holiday)}
      />
    </GlassCard>
  )
}
