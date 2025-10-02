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
  getMonthConfig,
  getShiftDefaultConfig,
  importHolidaysFromNager,
  listHolidaysByYear,
  updateMonthConfig,
  updateShiftDefaultConfig,
  generateSchedule,
} from "@/lib/api"
import type {
  Holiday,
  MonthConfig,
  ShiftDefaultConfig,
  WeekendPolicy,
} from "@/types"
import { cn } from "@/lib/utils"

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
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Kh\u00f4ng th\u1ec3 t\u1ea3i danh s\u00e1ch ng\u00e0y ngh\u1ec9"
        toast({
          variant: "destructive",
          title: "L\u1ed7i t\u1ea3i d\u1eef li\u1ec7u",
          description: message,
        })
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  React.useEffect(() => {
    void load(year)
  }, [load, year])

  const handleImport = React.useCallback(async () => {
    setImporting(true)
    try {
      const { imported } = await importHolidaysFromNager(year)
      toast({
        title: "\u0110\u00e3 \u0111\u1ed3ng b\u1ed9 ng\u00e0y ngh\u1ec9",
        description: imported
          ? `\u0110\u00e3 th\u00eam ${imported} ng\u00e0y ngh\u1ec9 t\u1eeb Nager.`
          : "Kh\u00f4ng c\u00f3 ng\u00e0y ngh\u1ec9 m\u1edbi.",
      })
      await load(year)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Kh\u00f4ng th\u1ec3 import ng\u00e0y ngh\u1ec9"
      toast({
        variant: "destructive",
        title: "Import th\u1ea5t b\u1ea1i",
        description: message,
      })
    } finally {
      setImporting(false)
    }
  }, [load, toast, year])

  const handleAdd = React.useCallback(async () => {
    if (!newDate) {
      toast({
        variant: "destructive",
        title: "Thi\u1ebfu ng\u00e0y ngh\u1ec9",
        description: "Vui l\u00f2ng ch\u1ecdn ng\u00e0y tr\u01b0\u1edbc khi th\u00eam.",
      })
      return
    }

    const isoDate = toIsoDate(newDate)
    if (holidays.some((holiday) => holiday.day === isoDate)) {
      toast({
        variant: "destructive",
        title: "Ng\u00e0y \u0111\u00e3 t\u1ed3n t\u1ea1i",
        description: "Ng\u00e0y ngh\u1ec9 n\u00e0y \u0111\u00e3 c\u00f3 trong danh s\u00e1ch.",
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
        title: "\u0110\u00e3 th\u00eam ng\u00e0y ngh\u1ec9",
        description: formatDisplayDate(isoDate) + " \u0111\u00e3 \u0111\u01b0\u1ee3c l\u01b0u.",
      })
      setNewDate(undefined)
      setNewName("")
      await load(year)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Kh\u00f4ng th\u1ec3 th\u00eam ng\u00e0y ngh\u1ec9"
      toast({
        variant: "destructive",
        title: "Th\u00eam th\u1ea5t b\u1ea1i",
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
          title: "\u0110\u00e3 x\u00f3a ng\u00e0y ngh\u1ec9",
          description: formatDisplayDate(holiday.day) + " \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1ee1 b\u1ecf.",
        })
        await load(year)
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Kh\u00f4ng th\u1ec3 x\u00f3a ng\u00e0y ngh\u1ec9"
        toast({
          variant: "destructive",
          title: "X\u00f3a th\u1ea5t b\u1ea1i",
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
              N\u0103m \u00e1p d\u1ee5ng
            </Label>
            <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
              <SelectTrigger className="h-10 w-32">
                <SelectValue placeholder="Ch\u1ecdn n\u0103m" />
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
            onClick={() => void load(year)}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> T\u1ea3i l\u1ea1i
          </GlassButton>
        </div>
        <GlassButton
          variant="primary"
          onClick={() => void handleImport()}
          disabled={importing || loading}
          className="gap-2"
        >
          <UploadCloud className="h-4 w-4" />
          {importing ? "\u0110ang import\u2026" : "Import from Nager"}
        </GlassButton>
      </div>

      <div className="grid gap-4 rounded-xl border border-dashed border-slate-200/80 bg-white/60 p-4 dark:border-slate-800/60 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-3">
          <CalendarPlus className="h-5 w-5 text-sky-500" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Th\u00eam th\u1ee7 c\u00f4ng c\u00e1c ng\u00e0y ngh\u1ec9 \u0111\u1eb7c bi\u1ec7t trong n\u0103m.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase text-muted-foreground">
              Ng\u00e0y ngh\u1ec9
            </Label>
            <DatePicker value={newDate} onChange={setNewDate} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="holiday-name" className="text-xs uppercase text-muted-foreground">
              Ghi ch\u00fa
            </Label>
            <Input
              id="holiday-name"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="T\u00ean ng\u00e0y ngh\u1ec9"
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
            {adding ? "\u0110ang th\u00eam\u2026" : "Th\u00eam ng\u00e0y ngh\u1ec9"}
          </GlassButton>
        </div>
      </div>

      <div>
        <Table stickyHeader>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Ng\u00e0y</TableHead>
              <TableHead>M\u00f4 t\u1ea3</TableHead>
              <TableHead className="w-[140px] text-center">H\u00e0nh \u0111\u1ed9ng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  \u0110ang t\u1ea3i danh s\u00e1ch\u2026
                </TableCell>
              </TableRow>
            ) : sortedHolidays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Ch\u01b0a c\u00f3 ng\u00e0y ngh\u1ec9 cho n\u0103m {year}.
                </TableCell>
              </TableRow>
            ) : (
              sortedHolidays.map((holiday) => (
                <TableRow key={holiday.id ?? holiday.day}>
                  <TableCell>{formatDisplayDate(holiday.day)}</TableCell>
                  <TableCell>{holiday.name ?? "\u2014"}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <GlassButton
                        variant="destructive"
                        size="sm"
                        onClick={() => void handleRemove(holiday)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" /> X\u00f3a
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
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
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

  const yearOptions = React.useMemo(() => {
    const fallbackYear = today.getFullYear()
    const baseYear =
      typeof year === "number" && Number.isFinite(year) ? year : fallbackYear
    const start = baseYear - 1
    return Array.from({ length: 4 }, (_, index) => start + index)
  }, [today, year])

  const load = React.useCallback(
    async (targetYear: number, targetMonth: number) => {
      setLoading(true)
      try {
        const [config, defaults] = await Promise.all([
          getMonthConfig(targetYear, targetMonth),
          getShiftDefaultConfig(targetYear, targetMonth),
        ])

        setWeekendPolicy(config.weekend_policy ?? "sat_sun")
        setExtraOffdays(config.extra_offdays ?? [])
        setExtraWorkdays(config.extra_workdays ?? [])
        setAutoWorkingDays(
          typeof config.auto_working_days === "number"
            ? config.auto_working_days
            : null,
        )
        setOverrideValue(
          config.working_days_override === null ||
            config.working_days_override === undefined
            ? ""
            : String(config.working_days_override),
        )

        const defaultsValue = { ...SHIFT_DEFAULT_BASE, ...(defaults?.defaults ?? {}) }
        setShiftDefaults(defaultsValue)
        setShiftFields(createShiftFields(defaultsValue))
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Không thể tải cấu hình tháng"
        toast({
          variant: "destructive",
          title: "Lỗi tải cấu hình",
          description: message,
        })
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  React.useEffect(() => {
    if (
      typeof year !== "number" ||
      !Number.isFinite(year) ||
      typeof month !== "number" ||
      !Number.isFinite(month)
    ) {
      return
    }

    void load(year, month)
  }, [load, month, year])

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
      setSaving(true)
      try {
        const normalizedOverride = overrideValue.trim()
        const overrideNumber =
          normalizedOverride === "" ? null : Number(normalizedOverride)
        if (overrideNumber !== null && Number.isNaN(overrideNumber)) {
          throw new Error("Giá trị override phải là số hợp lệ")
        }

        const monthPayload: MonthConfig = await updateMonthConfig({
          year: values.year,
          month: values.month,
          weekend_policy: weekendPolicy || "sat_sun",
          auto_working_days: autoWorkingDays,
          extra_offdays: [...extraOffdays].sort(),
          extra_workdays: [...extraWorkdays].sort(),
          working_days_override: overrideNumber,
        })

        const defaultsPayload: ShiftDefaultConfig = await updateShiftDefaultConfig({
          year: values.year,
          month: values.month,
          defaults: shiftDefaults,
        })

        setAutoWorkingDays(
          typeof monthPayload.auto_working_days === "number"
            ? monthPayload.auto_working_days
            : autoWorkingDays,
        )

        const normalizedDefaults = {
          ...SHIFT_DEFAULT_BASE,
          ...(defaultsPayload?.defaults ?? {}),
        }
        setShiftDefaults(normalizedDefaults)
        setShiftFields(createShiftFields(normalizedDefaults))

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
      } finally {
        setSaving(false)
      }
    },
    [
      autoWorkingDays,
      extraOffdays,
      extraWorkdays,
      overrideValue,
      shiftDefaults,
      toast,
      weekendPolicy,
    ],
  )

  const generateMonthPlan = React.useCallback(
    async (values: MonthPlanFormValues) => {
      setGenerating(true)
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
    [toast],
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

