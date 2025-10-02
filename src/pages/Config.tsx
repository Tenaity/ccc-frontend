import React from "react"
import {
  CalendarPlus,
  CalendarRange,
  CalendarX2,
  RefreshCcw,
  Settings2,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react"

import { PageHeader } from "@/components/PageHeader"
import { GlassButton, GlassCard } from "@/components/ui/glass"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  createHolidayEntry,
  deleteHolidayEntry,
  importHolidaysFromNager,
  listHolidaysByYear,
  generateSchedule,
} from "@/lib/api"
import type { Holiday, WeekendPolicy } from "@/types"
import { cn } from "@/lib/utils"
import { useMonthConfig } from "@/hooks/useMonthConfig"
import { useShiftDefaults } from "@/hooks/useShiftDefaults"

const BASE_WEEKEND_POLICIES: Array<{ value: WeekendPolicy; label: string }> = [
  { value: "sat_sun", label: "Th\u1ee9 7 & Ch\u1ee7 nh\u1eadt" },
  { value: "sun_only", label: "Ch\u1ec9 Ch\u1ee7 nh\u1eadt" },
  { value: "none", label: "Kh\u00f4ng \u00e1p d\u1ee5ng" },
]

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1)

const SHIFT_FIELD_LABELS: Record<string, string> = {
  day: "Ca ng\u00e0y",
  night: "Ca \u0111\u00eam",
  leader: "Leader",
  pgd: "PGD",
  hc: "HC",
}

const SHIFT_DEFAULT_BASE: Record<string, number> = {
  day: 0,
  night: 0,
  leader: 0,
  pgd: 0,
  hc: 0,
}

const monthPlanSchema = z.object({
  year: z
    .coerce.number({ invalid_type_error: "Vui lòng chọn năm." })
    .int("Năm không hợp lệ.")
    .min(2000, "Năm không hợp lệ."),
  month: z
    .coerce.number({ invalid_type_error: "Vui lòng chọn tháng." })
    .int("Tháng không hợp lệ.")
    .min(1, "Vui lòng chọn tháng.")
    .max(12, "Tháng không hợp lệ."),
})

type MonthPlanFormValues = z.infer<typeof monthPlanSchema>

type ShiftField = {
  key: string
  label: string
}

function createShiftFields(defaults: Record<string, number>): ShiftField[] {
  const keys = new Set(Object.keys(SHIFT_FIELD_LABELS))
  for (const key of Object.keys(defaults)) {
    keys.add(key)
  }

  return Array.from(keys).map((key) => ({
    key,
    label:
      SHIFT_FIELD_LABELS[key] ??
      key
        .replace(/_/g, " ")
        .replace(/\b([a-z])/g, (match) => match.toUpperCase()),
  }))
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function formatDisplayDate(input: string): string {
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) {
    return input
  }

  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}


function HolidaysTab() {
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

  const sortedHolidays = React.useMemo(
    () =>
      [...holidays].sort((a, b) => a.day.localeCompare(b.day, "en-US", {
        sensitivity: "base",
      })),
    [holidays],
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
    [toast],
  )

  React.useEffect(() => {
    setLastImportDelta(null)
    void load(year)
  }, [load, year])

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
          error instanceof Error
            ? error.message
            : "Không thể xóa ngày nghỉ"
        toast({
          variant: "destructive",
          title: "Xóa thất bại",
          description: message,
        })
      }
    },
    [load, toast, year],
  )

  return (
    <GlassCard className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase text-muted-foreground">
              Năm áp dụng
            </Label>
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
            disabled={loading}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> Tải lại
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
            <span
              data-testid="holiday-count-diff"
              className="font-medium text-emerald-600"
            >
              (+{lastImportDelta})
            </span>
          ) : null}
        </div>
        <GlassButton
          variant="primary"
          onClick={() => void handleImport()}
          disabled={importing || loading}
          className="gap-2"
        >
          <UploadCloud className="h-4 w-4" />
          {importing ? "Đang import…" : "Import from Nager"}
        </GlassButton>
      </div>

      <div className="grid gap-4 rounded-xl border border-dashed border-slate-200/80 bg-white/60 p-4 dark:border-slate-800/60 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-3">
          <CalendarPlus className="h-5 w-5 text-sky-500" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Thêm thủ công các ngày nghỉ đặc biệt trong năm.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase text-muted-foreground">
              Ngày nghỉ
            </Label>
            <DatePicker value={newDate} onChange={setNewDate} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="holiday-name" className="text-xs uppercase text-muted-foreground">
              Ghi chú
            </Label>
            <Input
              id="holiday-name"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Tên ngày nghỉ"
              className="w-[240px]"
            />
          </div>
          <GlassButton
            variant="secondary"
            onClick={() => void handleAdd()}
            disabled={adding}
            className="gap-2"
          >
            <CalendarRange className="h-4 w-4" />
            {adding ? "Đang thêm…" : "Thêm ngày nghỉ"}
          </GlassButton>
        </div>
      </div>

      <div>
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
                        onClick={() => void handleRemove(holiday)}
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
      </div>
    </GlassCard>
  )
}


function MonthPlanTab() {
  const { toast } = useToast()
  const today = React.useMemo(() => new Date(), [])
  const form = useForm<MonthPlanFormValues>({
    resolver: zodResolver(monthPlanSchema),
    defaultValues: {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
    },
    mode: "onChange",
  })
  const year = form.watch("year")
  const month = form.watch("month")
  const [generating, setGenerating] = React.useState(false)
  const [autoWorkingDays, setAutoWorkingDays] = React.useState<number | null>(null)
  const [weekendPolicy, setWeekendPolicy] = React.useState<WeekendPolicy>("sat_sun")
  const [extraOffdays, setExtraOffdays] = React.useState<string[]>([])
  const [extraWorkdays, setExtraWorkdays] = React.useState<string[]>([])
  const [overrideValue, setOverrideValue] = React.useState("")
  const [shiftDefaults, setShiftDefaults] = React.useState<Record<string, number>>({
    ...SHIFT_DEFAULT_BASE,
  })
  const [shiftFields, setShiftFields] = React.useState<ShiftField[]>(
    createShiftFields(SHIFT_DEFAULT_BASE),
  )
  const [newOffday, setNewOffday] = React.useState<Date | undefined>()
  const [newWorkday, setNewWorkday] = React.useState<Date | undefined>()
  const [generateErrorBanner, setGenerateErrorBanner] = React.useState<string | null>(null)

  const numericYear =
    typeof year === "number" && Number.isFinite(year) ? year : null
  const numericMonth =
    typeof month === "number" && Number.isFinite(month) ? month : null

  const {
    data: monthConfigData,
    loading: monthConfigLoading,
    saving: monthConfigSaving,
    error: monthConfigError,
    refetch: refetchMonthConfig,
    save: saveMonthConfig,
    isMissing: monthConfigMissing,
  } = useMonthConfig(numericYear, numericMonth)

  const {
    data: shiftDefaultData,
    loading: shiftDefaultsLoading,
    saving: shiftDefaultsSaving,
    error: shiftDefaultsError,
    refetch: refetchShiftDefaults,
    save: saveShiftDefaults,
  } = useShiftDefaults(numericYear, numericMonth)

  const loading = monthConfigLoading || shiftDefaultsLoading
  const saving = monthConfigSaving || shiftDefaultsSaving

  const yearOptions = React.useMemo(() => {
    const fallbackYear = today.getFullYear()
    const baseYear =
      typeof year === "number" && Number.isFinite(year) ? year : fallbackYear
    const start = baseYear - 1
    return Array.from({ length: 4 }, (_, index) => start + index)
  }, [today, year])

  React.useEffect(() => {
    if (!monthConfigData) {
      setWeekendPolicy("sat_sun")
      setExtraOffdays([])
      setExtraWorkdays([])
      setAutoWorkingDays(null)
      setOverrideValue("")
      return
    }

    setWeekendPolicy(monthConfigData.weekend_policy ?? "sat_sun")
    setExtraOffdays(monthConfigData.extra_offdays ?? [])
    setExtraWorkdays(monthConfigData.extra_workdays ?? [])
    setAutoWorkingDays(
      typeof monthConfigData.auto_working_days === "number"
        ? monthConfigData.auto_working_days
        : null,
    )
    setOverrideValue(
      monthConfigData.working_days_override === null ||
        monthConfigData.working_days_override === undefined
        ? ""
        : String(monthConfigData.working_days_override),
    )
  }, [monthConfigData])

  React.useEffect(() => {
    const defaultsValue = {
      ...SHIFT_DEFAULT_BASE,
      ...(shiftDefaultData?.defaults ?? {}),
    }
    setShiftDefaults(defaultsValue)
    setShiftFields(createShiftFields(defaultsValue))
  }, [shiftDefaultData])

  React.useEffect(() => {
    if (monthConfigError && !monthConfigData) {
      toast({
        variant: "destructive",
        title: "Lỗi tải cấu hình",
        description: monthConfigError,
      })
    }
  }, [monthConfigData, monthConfigError, toast])

  React.useEffect(() => {
    if (shiftDefaultsError && !shiftDefaultData) {
      toast({
        variant: "destructive",
        title: "Lỗi tải mặc định ca",
        description: shiftDefaultsError,
      })
    }
  }, [shiftDefaultData, shiftDefaultsError, toast])

  React.useEffect(() => {
    if (!monthConfigMissing) {
      setGenerateErrorBanner(null)
    }
  }, [monthConfigMissing])

  const weekendOptions = React.useMemo(() => {
    if (!weekendPolicy) {
      return BASE_WEEKEND_POLICIES
    }

    const exists = BASE_WEEKEND_POLICIES.some((option) => option.value === weekendPolicy)
    return exists
      ? BASE_WEEKEND_POLICIES
      : [...BASE_WEEKEND_POLICIES, { value: weekendPolicy, label: weekendPolicy }]
  }, [weekendPolicy])

  const handleAddOffday = React.useCallback(() => {
    if (!newOffday) {
      toast({
        variant: "destructive",
        title: "Thiếu ngày",
        description: "Vui lòng chọn ngày nghỉ bổ sung.",
      })
      return
    }

    const iso = toIsoDate(newOffday)
    if (extraOffdays.includes(iso)) {
      toast({
        variant: "destructive",
        title: "Ngày trùng",
        description: "Ngày nghỉ này đã có trong danh sách.",
      })
      return
    }

    setExtraOffdays((previous) => [...previous, iso].sort())
    setNewOffday(undefined)
  }, [extraOffdays, newOffday, toast])

  const handleAddWorkday = React.useCallback(() => {
    if (!newWorkday) {
      toast({
        variant: "destructive",
        title: "Thiếu ngày",
        description: "Vui lòng chọn ngày làm bù.",
      })
      return
    }

    const iso = toIsoDate(newWorkday)
    if (extraWorkdays.includes(iso)) {
      toast({
        variant: "destructive",
        title: "Ngày trùng",
        description: "Ngày làm bù này đã tồn tại.",
      })
      return
    }

    setExtraWorkdays((previous) => [...previous, iso].sort())
    setNewWorkday(undefined)
  }, [extraWorkdays, newWorkday, toast])

  const saveMonthPlan = React.useCallback(
    async (values: MonthPlanFormValues) => {
      try {
        if (numericYear === null || numericMonth === null) {
          throw new Error("Vui lòng chọn năm và tháng hợp lệ")
        }

        const normalizedOverride = overrideValue.trim()
        const overrideNumber =
          normalizedOverride === "" ? null : Number(normalizedOverride)
        if (overrideNumber !== null && Number.isNaN(overrideNumber)) {
          throw new Error("Giá trị override phải là số hợp lệ")
        }

        await saveMonthConfig({
          weekend_policy: weekendPolicy || "sat_sun",
          extra_offdays: [...extraOffdays].sort(),
          extra_workdays: [...extraWorkdays].sort(),
          working_days_override: overrideNumber,
          auto_working_days: autoWorkingDays,
        })

        await saveShiftDefaults(shiftDefaults)

        toast({
          title: "Đã lưu cấu hình",
          description: "Thiết lập tháng và mặc định ca đã được cập nhật.",
        })
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Không thể lưu cấu hình"
        toast({
          variant: "destructive",
          title: "Lưu thất bại",
          description: message,
        })
      }
    },
    [
      autoWorkingDays,
      extraOffdays,
      extraWorkdays,
      numericMonth,
      numericYear,
      overrideValue,
      saveMonthConfig,
      saveShiftDefaults,
      shiftDefaults,
      toast,
      weekendPolicy,
    ],
  )

  const generateMonthPlan = React.useCallback(
    async (values: MonthPlanFormValues) => {
      if (monthConfigMissing) {
        const monthLabel = `${String(values.month).padStart(2, "0")}/${values.year}`
        setGenerateErrorBanner(
          `Tháng ${monthLabel} chưa được cấu hình. Vui lòng lưu thiết lập trước khi sinh lịch.`,
        )
        return
      }

      setGenerating(true)
      setGenerateErrorBanner(null)
      try {
        const result = await generateSchedule({
          year: values.year,
          month: values.month,
        })

        if (!result?.ok) {
          const detail = result?.error ?? "Máy chủ trả về lỗi"
          toast({
            variant: "destructive",
            title: "Sinh lịch thất bại",
            description: detail,
          })
          return
        }

        const plannedCount = Array.isArray(result?.planned)
          ? result.planned.length
          : null
        const detailMessage =
          typeof result?.details === "string" && result.details.trim().length > 0
            ? result.details
            : plannedCount !== null
              ? `Đã sinh ${plannedCount} ca xem trước cho ${String(values.month).padStart(2, "0")}/${values.year}.`
              : `Đang xử lý lịch cho ${String(values.month).padStart(2, "0")}/${values.year}.`

        toast({
          title: "Đã gửi yêu cầu sinh lịch",
          description: detailMessage,
        })

        await Promise.all([refetchMonthConfig(), refetchShiftDefaults()])
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Không thể sinh lịch"
        toast({
          variant: "destructive",
          title: "Sinh lịch thất bại",
          description: message,
        })
      } finally {
        setGenerating(false)
      }
    },
    [monthConfigMissing, refetchMonthConfig, refetchShiftDefaults, toast],
  )

  const submitSave = React.useMemo(
    () => form.handleSubmit(saveMonthPlan),
    [form, saveMonthPlan],
  )

  const submitGenerate = React.useMemo(
    () => form.handleSubmit(generateMonthPlan),
    [form, generateMonthPlan],
  )

  const hasSelection =
    typeof year === "number" &&
    Number.isFinite(year) &&
    typeof month === "number" &&
    Number.isFinite(month)
  const saveDisabled = saving || loading || !hasSelection
  const generateDisabled = generating || loading || !hasSelection

  const onShiftDefaultChange = React.useCallback((key: string, value: string) => {
    const next = Number(value)
    setShiftDefaults((prev) => ({
      ...prev,
      [key]: Number.isNaN(next) ? 0 : next,
    }))
  }, [])

  return (
    <Form {...form}>
      <GlassCard className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase text-muted-foreground">
                  Chọn năm
                </FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 w-full md:w-40">
                      <SelectValue placeholder="Chọn năm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yearOptions.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase text-muted-foreground">
                  Chọn tháng
                </FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 w-full md:w-40">
                      <SelectValue placeholder="Chọn tháng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MONTH_OPTIONS.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        Tháng {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {generateErrorBanner ? (
          <Alert variant="destructive">
            <AlertTitle>Thiếu cấu hình tháng</AlertTitle>
            <AlertDescription>{generateErrorBanner}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-900/70">
          <Badge variant="primary" className="gap-2">
            <Sparkles className="h-3.5 w-3.5" /> Auto working days
          </Badge>
          <span className="text-sm text-muted-foreground">
            {autoWorkingDays !== null
              ? `${autoWorkingDays} ngày làm việc dự kiến`
              : "Chưa có dữ liệu"}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">
                Weekend policy
              </Label>
              <div className="grid gap-2">
                {weekendOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200/70 bg-white/70 px-4 py-3 transition-all",
                      weekendPolicy === option.value
                        ? "border-sky-400/60 shadow-ios"
                        : "hover:border-slate-300/70",
                      "dark:border-slate-800/70 dark:bg-slate-900/70",
                    )}
                  >
                    <input
                      type="radio"
                      name="weekend-policy"
                      value={option.value}
                      checked={weekendPolicy === option.value}
                      onChange={() => setWeekendPolicy(option.value)}
                      className="h-4 w-4 accent-sky-500"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CalendarX2 className="h-4 w-4 text-rose-500" /> extra_offdays
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <DatePicker value={newOffday} onChange={setNewOffday} />
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={handleAddOffday}
                  className="gap-2"
                  type="button"
                >
                  <CalendarRange className="h-4 w-4" /> Thêm ngày nghỉ
                </GlassButton>
              </div>
              <div className="flex flex-wrap gap-2">
                {extraOffdays.length === 0 ? (
                  <span className="text-sm text-muted-foreground">
                    Chưa có ngày nghỉ bổ sung.
                  </span>
                ) : (
                  extraOffdays.map((day) => (
                    <Badge key={day} variant="outline" className="gap-2">
                      {formatDisplayDate(day)}
                      <button
                        type="button"
                        onClick={() =>
                          setExtraOffdays((prev) => prev.filter((item) => item !== day))
                        }
                        className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarPlus className="h-4 w-4 text-emerald-500" /> extra_workdays
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <DatePicker value={newWorkday} onChange={setNewWorkday} />
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={handleAddWorkday}
                className="gap-2"
                type="button"
              >
                <CalendarRange className="h-4 w-4" /> Thêm ngày làm bù
              </GlassButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {extraWorkdays.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  Chưa có ngày làm bù.
                </span>
              ) : (
                extraWorkdays.map((day) => (
                  <Badge key={day} variant="outline" className="gap-2">
                    {formatDisplayDate(day)}
                    <button
                      type="button"
                      onClick={() =>
                        setExtraWorkdays((prev) => prev.filter((item) => item !== day))
                      }
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">
                working_days_override
              </Label>
              <Input
                type="number"
                inputMode="numeric"
                value={overrideValue}
                onChange={(event) => setOverrideValue(event.target.value)}
                placeholder="Giá trị tuỳ chọn"
                className="w-full md:w-48"
                data-testid="working-days-override"
              />
              <p className="text-xs text-muted-foreground">
                Để trống nếu muốn sử dụng giá trị auto working days.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Settings2 className="h-4 w-4 text-sky-500" /> Shift defaults
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shiftFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground">
                  {field.key}
                </Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={String(shiftDefaults[field.key] ?? 0)}
                  onChange={(event) => onShiftDefaultChange(field.key, event.target.value)}
                  className="w-full"
                  data-testid={`shift-default-${field.key}`}
                />
                <p className="text-xs text-muted-foreground">
                  {field.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <GlassButton
            variant="primary"
            type="button"
            onClick={() => void submitSave()}
            disabled={saveDisabled}
            className="gap-2"
          >
            <Settings2 className="h-4 w-4" />
            {saving ? "Đang lưu…" : "Save"}
          </GlassButton>
          <GlassButton
            variant="secondary"
            type="button"
            onClick={() => void submitGenerate()}
            disabled={generateDisabled}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? "Đang sinh…" : "Generate Schedule"}
          </GlassButton>
          {loading ? (
            <span className="text-sm text-muted-foreground">
              Đang tải cấu hình tháng…
            </span>
          ) : null}
        </div>
      </GlassCard>
    </Form>
  )
}

export default function ConfigPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Settings2}
        tagline="Operations Toolkit"
        title="Config"
        description="Qu\u1ea3n l\u00fd ng\u00e0y ngh\u1ec9 v\u00e0 c\u1ea5u h\u00ecnh sinh l\u1ecbch cho t\u1eebng th\u00e1ng."
      />
      <Tabs defaultValue="holidays" className="space-y-6">
        <TabsList className="w-full max-w-xl bg-white/60 p-1 backdrop-blur-2xl dark:bg-slate-900/60">
          <TabsTrigger value="holidays" className="gap-2">
            <CalendarPlus className="h-4 w-4" /> Holidays
          </TabsTrigger>
          <TabsTrigger value="month-plan" className="gap-2">
            <Settings2 className="h-4 w-4" /> Month plan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="holidays" className="space-y-6">
          <HolidaysTab />
        </TabsContent>
        <TabsContent value="month-plan" className="space-y-6">
          <MonthPlanTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

