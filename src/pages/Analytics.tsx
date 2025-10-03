import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Activity, TrendingDown, TrendingUp } from "lucide-react"

import { PageHeader } from "@/components/PageHeader"
import { GlassCard, GlassPanel } from "@/components/ui/glass"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAttendance, useCost, useDepartmentCompare, useStaffWorkload } from "@/hooks/useAnalyticsMetrics"
import { cn } from "@/lib/utils"

const workloadChartConfig = {
  totalHours: {
    label: "Giờ làm việc",
    color: "hsl(var(--chart-1))",
  },
  overtimeHours: {
    label: "Tăng ca",
    color: "hsl(var(--chart-2))",
  },
}

const departmentChartConfig = {
  regularHours: {
    label: "Giờ tiêu chuẩn",
    color: "hsl(var(--chart-3))",
  },
  overtimeHours: {
    label: "Tăng ca",
    color: "hsl(var(--chart-4))",
  },
}

const attendanceChartConfig = {
  present: {
    label: "Hiện diện",
    color: "hsl(var(--chart-1))",
  },
  absent: {
    label: "Vắng mặt",
    color: "hsl(var(--chart-2))",
  },
}

const RANGE_OPTIONS = [
  { value: "month", label: "Trong tháng", days: null },
  { value: "30d", label: "30 ngày", days: 30 },
  { value: "7d", label: "7 ngày", days: 7 },
] as const

type RangeValue = (typeof RANGE_OPTIONS)[number]["value"]

type DateRange = {
  from: string | null
  to: string | null
  display: string
}

function getDateRange(year: number, month: number, range: RangeValue): DateRange {
  const monthStart = new Date(year, month - 1, 1)
  const monthEnd = new Date(year, month, 0)
  if (range === "month") {
    const from = new Date(monthStart)
    const to = new Date(monthEnd)
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
      display: `01/${String(month).padStart(2, "0")} - ${String(
        to.getDate(),
      ).padStart(2, "0")}/${String(month).padStart(2, "0")}`,
    }
  }

  const days = RANGE_OPTIONS.find((option) => option.value === range)?.days ?? 7
  const to = new Date(monthEnd)
  const from = new Date(to)
  from.setDate(from.getDate() - (days - 1))
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
    display: `${from.toLocaleDateString("vi-VN")} - ${to.toLocaleDateString("vi-VN")}`,
  }
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function normalizePercent(value: number | null | undefined): number {
  if (!value || Number.isNaN(value)) {
    return 0
  }
  if (value > 1) {
    return Math.min(Math.max(value, 0), 100)
  }
  return Math.min(Math.max(value * 100, 0), 100)
}

export default function AnalyticsPage() {
  const today = new Date()
  const currentYear = today.getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1)
  const [selectedRange, setSelectedRange] = useState<RangeValue>("month")

  const workload = useStaffWorkload(selectedYear, selectedMonth)
  const department = useDepartmentCompare(selectedYear, selectedMonth)
  const attendanceRange = useMemo(
    () => getDateRange(selectedYear, selectedMonth, selectedRange),
    [selectedMonth, selectedRange, selectedYear],
  )
  const attendance = useAttendance(attendanceRange.from, attendanceRange.to)
  const cost = useCost(selectedYear, selectedMonth)

  const yearOptions = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => currentYear - index)
  }, [currentYear])

  const attendancePercent = normalizePercent(attendance.data?.attendanceRate ?? null)
  const costDelta = useMemo(() => {
    if (!cost.data || cost.data.previousAmount === null) {
      return null
    }
    if (cost.data.deltaPercentage !== null) {
      return cost.data.deltaPercentage
    }
    if (cost.data.previousAmount === 0) {
      return null
    }
    return ((cost.data.amount - cost.data.previousAmount) / cost.data.previousAmount) * 100
  }, [cost.data])

  const displayDelta = useMemo(() => {
    if (costDelta === null) {
      return null
    }
    const absolute = Math.abs(costDelta)
    if (absolute === 0) {
      return 0
    }
    return absolute <= 1 ? costDelta * 100 : costDelta
  }, [costDelta])

  return (
    <div className="flex flex-col gap-6 pb-16">
      <PageHeader
        icon={Activity}
        tagline="Operations Insights"
        title="Analytics"
        description="Theo dõi hiệu suất nhân viên, phòng ban và chi phí vận hành."
      />

      <GlassPanel variant="strong" className="flex flex-col gap-4 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="analytics-year">Năm</Label>
            <Select
              value={String(selectedYear)}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger id="analytics-year" className="w-32">
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="analytics-month">Tháng</Label>
            <Select
              value={String(selectedMonth)}
              onValueChange={(value) => setSelectedMonth(Number(value))}
            >
              <SelectTrigger id="analytics-month" className="w-32">
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                  <SelectItem key={month} value={String(month)}>
                    {String(month).padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="analytics-range">Khoảng thời gian</Label>
            <Select
              value={selectedRange}
              onValueChange={(value: RangeValue) => setSelectedRange(value)}
            >
              <SelectTrigger id="analytics-range" className="w-40">
                <SelectValue placeholder="Chọn khoảng" />
              </SelectTrigger>
              <SelectContent>
                {RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="ml-auto text-sm text-muted-foreground">
            Dữ liệu điểm danh: {attendanceRange.display}
          </span>
        </div>
      </GlassPanel>

      <div className="@container/analytics grid gap-6 xl:grid-cols-3">
        <GlassCard variant="strong" className="xl:col-span-2 p-6">
          <header className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-foreground">Tải công việc nhân viên</h2>
            <p className="text-sm text-muted-foreground">
              Phân bổ giờ làm và tăng ca theo từng nhân viên trong tháng.
            </p>
          </header>
          <div className="mt-6">
            {workload.loading ? (
              <WidgetSkeleton ariaLabel="Đang tải biểu đồ tải công việc" />
            ) : workload.error ? (
              <WidgetError message={workload.error} onRetry={workload.refetch} />
            ) : workload.isEmpty ? (
              <EmptyState message="Không có dữ liệu tải công việc." />
            ) : (
              <ChartContainer
                config={workloadChartConfig}
                className="h-[320px] aspect-auto"
              >
                <BarChart data={workload.data ?? []} margin={{ left: 12, right: 12, top: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} minTickGap={16} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }} content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="totalHours" name="Giờ làm việc" fill="var(--color-totalHours)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="overtimeHours" name="Tăng ca" fill="var(--color-overtimeHours)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </GlassCard>

        <GlassCard variant="strong" className="p-6">
          <header className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Chi phí vận hành</h2>
              <p className="text-sm text-muted-foreground">
                Tổng chi phí cho tháng {String(selectedMonth).padStart(2, "0")}/{selectedYear}
              </p>
            </div>
            <Activity className="size-5 text-sky-500" aria-hidden="true" />
          </header>
          <div className="mt-6 space-y-4">
            {cost.loading ? (
              <WidgetSkeleton ariaLabel="Đang tải dữ liệu chi phí" />
            ) : cost.error ? (
              <WidgetError message={cost.error} onRetry={cost.refetch} />
            ) : cost.data ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng chi phí</p>
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(cost.data.amount, cost.data.currency)}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {displayDelta !== null && costDelta !== null ? (
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2 py-1 font-medium",
                        costDelta >= 0
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-rose-500/15 text-rose-600",
                      )}
                      aria-label={
                        costDelta >= 0
                          ? "Chi phí tăng so với tháng trước"
                          : "Chi phí giảm so với tháng trước"
                      }
                    >
                      {costDelta >= 0 ? (
                        <TrendingUp className="size-4" aria-hidden="true" />
                      ) : (
                        <TrendingDown className="size-4" aria-hidden="true" />
                      )}
                      {Math.abs(displayDelta).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Chưa có dữ liệu so sánh tháng trước
                    </span>
                  )}
                  {cost.data.previousAmount !== null ? (
                    <span className="text-muted-foreground">
                      Tháng trước: {formatCurrency(cost.data.previousAmount, cost.data.currency)}
                    </span>
                  ) : null}
                </div>
                {cost.data.label ? (
                  <p className="text-xs text-muted-foreground">
                    Kỳ báo cáo: {cost.data.label}
                  </p>
                ) : null}
                {cost.data.updatedAt ? (
                  <p className="text-xs text-muted-foreground">
                    Cập nhật: {new Date(cost.data.updatedAt).toLocaleString()}
                  </p>
                ) : null}
              </>
            ) : (
              <EmptyState message="Không có dữ liệu chi phí." />
            )}
          </div>
        </GlassCard>

        <GlassCard variant="strong" className="xl:col-span-2 p-6">
          <header className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-foreground">So sánh phòng ban</h2>
            <p className="text-sm text-muted-foreground">
              Tổng hợp giờ làm và tăng ca giữa các phòng ban.
            </p>
          </header>
          <div className="mt-6">
            {department.loading ? (
              <WidgetSkeleton ariaLabel="Đang tải biểu đồ phòng ban" />
            ) : department.error ? (
              <WidgetError message={department.error} onRetry={department.refetch} />
            ) : department.isEmpty ? (
              <EmptyState message="Không có dữ liệu phòng ban." />
            ) : (
              <ChartContainer
                config={departmentChartConfig}
                className="h-[320px] aspect-auto"
              >
                <BarChart data={department.data ?? []} margin={{ left: 12, right: 12, top: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="department" tickLine={false} axisLine={false} tickMargin={10} minTickGap={16} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${Number(value).toFixed(1)} giờ`} />} />
                  <Legend />
                  <Bar
                    dataKey="regularHours"
                    name="Giờ tiêu chuẩn"
                    stackId="hours"
                    fill="var(--color-regularHours)"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="overtimeHours"
                    name="Tăng ca"
                    stackId="hours"
                    fill="var(--color-overtimeHours)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </GlassCard>

        <GlassCard variant="strong" className="p-6">
          <header className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-foreground">Điểm danh</h2>
            <p className="text-sm text-muted-foreground">
              Tỷ lệ hiện diện và danh sách nhân viên vắng mặt.
            </p>
          </header>
          <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,_1fr)_minmax(0,_1.2fr)]">
            {attendance.loading ? (
              <WidgetSkeleton ariaLabel="Đang tải dữ liệu điểm danh" />
            ) : attendance.error ? (
              <WidgetError message={attendance.error} onRetry={attendance.refetch} />
            ) : !attendance.data ? (
              <EmptyState message="Không có dữ liệu điểm danh." />
            ) : (
              <>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="relative flex h-40 w-40 items-center justify-center">
                    <ChartContainer
                      config={attendanceChartConfig}
                      className="h-40 w-40 aspect-square"
                    >
                      <PieChart>
                        <Pie
                          dataKey="value"
                          nameKey="name"
                          data={[
                            {
                              name: "Hiện diện",
                              value: attendance.data.present,
                              fill: "var(--color-present)",
                            },
                            {
                              name: "Vắng mặt",
                              value: attendance.data.absent,
                              fill: "var(--color-absent)",
                            },
                          ]}
                          innerRadius={60}
                          outerRadius={80}
                          strokeWidth={2}
                        >
                          <Cell key="present" fill="var(--color-present)" />
                          <Cell key="absent" fill="var(--color-absent)" />
                        </Pie>
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value, name) => `${name}: ${Number(value).toFixed(0)} người`}
                            />
                          }
                        />
                      </PieChart>
                    </ChartContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <span className="text-3xl font-semibold text-foreground">
                        {attendancePercent.toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground">Hiện diện</span>
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    {attendance.data.present} / {attendance.data.total} nhân viên hiện diện
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-foreground">Danh sách vắng mặt</h3>
                  {attendance.data.absences.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Không có ghi nhận vắng mặt trong giai đoạn này.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {attendance.data.absences.slice(0, 6).map((absence) => (
                        <li
                          key={absence.id}
                          className="flex flex-col rounded-lg border border-white/40 bg-white/70 p-3 text-sm shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70"
                        >
                          <span className="font-medium text-foreground">{absence.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {absence.department ?? "Không rõ phòng ban"}
                          </span>
                          {absence.date ? (
                            <span className="text-xs text-muted-foreground">
                              Ngày: {new Date(absence.date).toLocaleDateString()}
                            </span>
                          ) : null}
                          {absence.reason ? (
                            <span className="text-xs text-muted-foreground">Lý do: {absence.reason}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                  {attendance.data.absences.length > 6 ? (
                    <p className="text-xs text-muted-foreground">
                      Hiển thị 6/ {attendance.data.absences.length} trường hợp vắng mặt.
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

type WidgetSkeletonProps = {
  ariaLabel: string
}

function WidgetSkeleton({ ariaLabel }: WidgetSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className="flex h-[280px] flex-col justify-between"
    >
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
}

type WidgetErrorProps = {
  message: string
  onRetry: () => Promise<unknown>
}

function WidgetError({ message, onRetry }: WidgetErrorProps) {
  return (
    <div
      role="alert"
      className="flex h-[280px] flex-col items-start justify-center gap-3 text-sm text-red-600"
    >
      <p className="font-semibold">Không thể tải dữ liệu</p>
      <p className="text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={() => {
          void onRetry()
        }}
        className="rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        Thử lại
      </button>
    </div>
  )
}

type EmptyStateProps = {
  message: string
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}
