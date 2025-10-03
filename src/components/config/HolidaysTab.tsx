import React from "react"
import { RefreshCcw, UploadCloud, CalendarDays, TrendingUp, Plus } from "lucide-react"
import type { Holiday } from "@/types"
import { GlassButton, GlassCard, GlassPanel, GlassBadge } from "@/components/ui/glass"
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
    <>
      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassPanel variant="strong" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Năm áp dụng</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                {year}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30">
              <CalendarDays className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng ngày nghỉ</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {sortedHolidays.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Import gần đây</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {lastImportDelta !== null ? `+${lastImportDelta}` : "0"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              <UploadCloud className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </GlassPanel>
      </div>

      <GlassCard className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
            Quản lý ngày nghỉ lễ
          </h3>
          <p className="text-sm text-muted-foreground">
            Import và quản lý danh sách ngày nghỉ lễ cho năm {year}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Chọn năm</Label>
              <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
                <SelectTrigger className={cn(
                  "h-11 w-36 rounded-xl",
                  "bg-white/80 dark:bg-slate-900/80",
                  "border-slate-200/60 dark:border-slate-800/60",
                  "focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
                )}>
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
              className="gap-2 hover:border-sky-400/50"
            >
              <RefreshCcw
                className={cn("h-4 w-4", (loading || autoFetching) && "animate-spin")}
              />
              {loading || autoFetching ? "Đang tải..." : "Tải lại"}
            </GlassButton>
          </div>
          <GlassButton
            variant="primary"
            onClick={() => void handleImport()}
            disabled={importing || loading || autoFetching}
            className={cn(
              "gap-2 min-w-[200px]",
              !importing && !loading && !autoFetching && "shadow-lg shadow-sky-500/25"
            )}
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
    </>
  )
}
