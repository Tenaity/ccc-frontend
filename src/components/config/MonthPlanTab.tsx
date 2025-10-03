import React from "react"
import { Settings2, Sparkles, CalendarDays, TrendingUp, Loader2 } from "lucide-react"
import type { WeekendPolicy } from "@/types"
import { GlassButton, GlassCard, GlassPanel, GlassBadge } from "@/components/ui/glass"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { generateSchedule } from "@/lib/api"
import { useMonthConfig } from "@/hooks/useMonthConfig"
import { useShiftDefaults } from "@/hooks/useShiftDefaults"
import { WeekendPolicySelector } from "./WeekendPolicySelector"
import { ExtraDaysManager } from "./ExtraDaysManager"
import { ShiftDefaultsForm } from "./ShiftDefaultsForm"
import { BASE_WEEKEND_POLICIES, SHIFT_DEFAULT_BASE, MONTH_OPTIONS } from "./constants"
import { monthPlanSchema, type MonthPlanFormValues, type ShiftField } from "./types"
import { createShiftFields, toIsoDate } from "./utils"

export function MonthPlanTab() {
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
    createShiftFields(SHIFT_DEFAULT_BASE)
  )
  const [newOffday, setNewOffday] = React.useState<Date | undefined>()
  const [newWorkday, setNewWorkday] = React.useState<Date | undefined>()
  const [generateErrorBanner, setGenerateErrorBanner] = React.useState<string | null>(null)

  const numericYear = typeof year === "number" && Number.isFinite(year) ? year : null
  const numericMonth = typeof month === "number" && Number.isFinite(month) ? month : null

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
    const baseYear = typeof year === "number" && Number.isFinite(year) ? year : fallbackYear
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
        : null
    )
    setOverrideValue(
      monthConfigData.working_days_override === null ||
        monthConfigData.working_days_override === undefined
        ? ""
        : String(monthConfigData.working_days_override)
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
        const overrideNumber = normalizedOverride === "" ? null : Number(normalizedOverride)
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
        const message = error instanceof Error ? error.message : "Không thể lưu cấu hình"
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
    ]
  )

  const generateMonthPlan = React.useCallback(
    async (values: MonthPlanFormValues) => {
      if (monthConfigMissing) {
        const monthLabel = `${String(values.month).padStart(2, "0")}/${values.year}`
        setGenerateErrorBanner(
          `Tháng ${monthLabel} chưa được cấu hình. Vui lòng lưu thiết lập trước khi sinh lịch.`
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

        const plannedCount = Array.isArray(result?.planned) ? result.planned.length : null
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
        const message = error instanceof Error ? error.message : "Không thể sinh lịch"
        toast({
          variant: "destructive",
          title: "Sinh lịch thất bại",
          description: message,
        })
      } finally {
        setGenerating(false)
      }
    },
    [monthConfigMissing, refetchMonthConfig, refetchShiftDefaults, toast]
  )

  const submitSave = React.useMemo(
    () => form.handleSubmit(saveMonthPlan),
    [form, saveMonthPlan]
  )

  const submitGenerate = React.useMemo(
    () => form.handleSubmit(generateMonthPlan),
    [form, generateMonthPlan]
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

  const monthLabel = React.useMemo(() => {
    if (!hasSelection) return "N/A"
    return `${String(month).padStart(2, "0")}/${year}`
  }, [hasSelection, month, year])

  return (
    <Form {...form}>
      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassPanel variant="strong" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kỳ lịch</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                {monthLabel}
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
              <p className="text-sm font-medium text-muted-foreground">Ngày làm việc</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {autoWorkingDays !== null ? autoWorkingDays : "..."}
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
              <p className="text-sm font-medium text-muted-foreground">Ngày nghỉ bổ sung</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {extraOffdays.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </GlassPanel>
      </div>

      <GlassCard className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Cấu hình tháng
          </h3>
          <p className="text-sm text-muted-foreground">
            Thiết lập năm, tháng và các tham số sinh lịch
          </p>
        </div>

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


        <div className="grid gap-6 md:grid-cols-2">
          <WeekendPolicySelector
            value={weekendPolicy}
            onChange={setWeekendPolicy}
            options={weekendOptions}
          />

          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">
              working_days_override
            </Label>
            <Input
              type="number"
              inputMode="numeric"
              value={overrideValue}
              onChange={(e) => setOverrideValue(e.target.value)}
              placeholder="Giá trị tuỳ chọn"
              className="w-full md:w-48"
              data-testid="working-days-override"
            />
            <p className="text-xs text-muted-foreground">
              Để trống nếu muốn sử dụng giá trị auto working days.
            </p>
          </div>
        </div>

        <ExtraDaysManager
          extraOffdays={extraOffdays}
          extraWorkdays={extraWorkdays}
          newOffday={newOffday}
          newWorkday={newWorkday}
          onOffdayChange={setNewOffday}
          onWorkdayChange={setNewWorkday}
          onAddOffday={handleAddOffday}
          onAddWorkday={handleAddWorkday}
          onRemoveOffday={(day) => setExtraOffdays((prev) => prev.filter((d) => d !== day))}
          onRemoveWorkday={(day) => setExtraWorkdays((prev) => prev.filter((d) => d !== day))}
        />

        <ShiftDefaultsForm
          shiftFields={shiftFields}
          shiftDefaults={shiftDefaults}
          onChange={onShiftDefaultChange}
        />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <GlassButton
            variant="primary"
            type="button"
            onClick={() => void submitSave()}
            disabled={saveDisabled}
            className={cn(
              "gap-2 min-w-[140px]",
              !saveDisabled && "shadow-lg shadow-sky-500/25"
            )}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Settings2 className="h-4 w-4" />
            )}
            {saving ? "Đang lưu…" : "Save Config"}
          </GlassButton>
          <GlassButton
            variant="secondary"
            type="button"
            onClick={() => void submitGenerate()}
            disabled={generateDisabled}
            className={cn(
              "gap-2 min-w-[180px]",
              !generateDisabled && "shadow-lg shadow-indigo-500/20"
            )}
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {generating ? "Đang sinh…" : "Generate Schedule"}
          </GlassButton>
          {loading && (
            <GlassBadge variant="info" className="gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span className="text-xs">Đang tải cấu hình…</span>
            </GlassBadge>
          )}
        </div>
      </GlassCard>
    </Form>
  )
}
