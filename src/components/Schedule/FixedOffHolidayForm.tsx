import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useFixedOff } from "@/hooks/useFixedOff"
import { useHolidays } from "@/hooks/useHolidays"
import type { Position, Staff } from "@/types"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

const SHIFT_OPTIONS = ["CA1", "CA2", "K", "HC", "Đ", "P"] as const
const POSITION_OPTIONS = ["TD", "PGD"] as const

const REQUIRED_MESSAGE = "Bắt buộc"

const requiredDate = z.date()

const optionalNoteSchema = z
  .string()
  .trim()
  .max(120, "Tối đa 120 ký tự")
  .optional()

const shiftSchema = z.enum(SHIFT_OPTIONS)

const fixedSchema = z.object({
  staffId: z.string().min(1, REQUIRED_MESSAGE),
  day: requiredDate,
  shift: shiftSchema,
  position: z.enum(POSITION_OPTIONS).nullable().optional(),
})

const offSchema = z.object({
  staffId: z.string().min(1, REQUIRED_MESSAGE),
  day: requiredDate,
  reason: optionalNoteSchema,
})

const holidaySchema = z.object({
  day: requiredDate,
  name: optionalNoteSchema,
})

export type FixedFormValues = z.infer<typeof fixedSchema>
export type OffFormValues = z.infer<typeof offSchema>
export type HolidayFormValues = z.infer<typeof holidaySchema>

type TabValue = "fixed" | "off" | "holiday"

type FixedOffHolidayFormProps = {
  year: number
  month: number
  open: boolean
  onRefresh?: () => Promise<void> | void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

function toISODate(input: Date) {
  const year = input.getFullYear()
  const month = String(input.getMonth() + 1).padStart(2, "0")
  const day = String(input.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function FixedOffHolidayForm({
  year,
  month,
  open,
  onRefresh,
  onSuccess,
  onError,
}: FixedOffHolidayFormProps) {
  const [tab, setTab] = useState<TabValue>("fixed")
  const [staffOptions, setStaffOptions] = useState<Staff[]>([])
  const [staffLoading, setStaffLoading] = useState(false)
  const [staffError, setStaffError] = useState<string | null>(null)

  const {
    fixed,
    off,
    loading: fixedLoading,
    error: fixedError,
    load: loadFixedAndOff,
    createFixed,
    deleteFixed,
    createOff,
    deleteOff,
  } = useFixedOff(year, month)
  const {
    holidays,
    loading: holidayLoading,
    error: holidayError,
    load: loadHolidays,
    createHoliday,
    deleteHoliday,
  } = useHolidays(year, month)

  const fixedForm = useForm<FixedFormValues>({
    resolver: zodResolver(fixedSchema),
    defaultValues: {
      staffId: "",
      day: undefined,
      shift: undefined,
      position: null,
    } as Partial<FixedFormValues>,
    mode: "onChange",
  })

  const offForm = useForm<OffFormValues>({
    resolver: zodResolver(offSchema),
    defaultValues: {
      staffId: "",
      day: undefined,
      reason: undefined,
    } as Partial<OffFormValues>,
    mode: "onChange",
  })

  const holidayForm = useForm<HolidayFormValues>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      day: undefined,
      name: undefined,
    } as Partial<HolidayFormValues>,
    mode: "onChange",
  })

  useEffect(() => {
    if (!open) {
      return
    }

    setTab("fixed")
    fixedForm.reset({ staffId: "", day: undefined, shift: undefined, position: null })
    offForm.reset({ staffId: "", day: undefined, reason: undefined })
    holidayForm.reset({ day: undefined, name: undefined })

    let cancelled = false

    const fetchStaff = async () => {
      setStaffLoading(true)
      setStaffError(null)
      try {
        const response = await fetch("/api/staff")
        if (!response.ok) {
          const text = await response.text()
          throw new Error(text || "Không thể tải danh sách nhân viên")
        }
        const json = (await response.json()) as Staff[]
        if (cancelled) {
          return
        }
        setStaffOptions(Array.isArray(json) ? json : [])
      } catch (error) {
        if (cancelled) {
          return
        }
        const message =
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách nhân viên"
        setStaffOptions([])
        setStaffError(message)
        onError(message)
      } finally {
        if (!cancelled) {
          setStaffLoading(false)
        }
      }
    }

    const loadData = async () => {
      try {
        await Promise.all([
          loadFixedAndOff({ year, month }),
          loadHolidays({ year, month }),
        ])
      } catch (error) {
        if (cancelled) {
          return
        }
        const message =
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu fixed/off"
        onError(message)
      }
    }

    void fetchStaff()
    void loadData()

    return () => {
      cancelled = true
    }
  }, [open, year, month, fixedForm, offForm, holidayForm, loadFixedAndOff, loadHolidays, onError])

  useEffect(() => {
    if (!open) {
      return
    }
    if (fixedError) {
      onError(fixedError)
    }
  }, [open, fixedError, onError])

  useEffect(() => {
    if (!open) {
      return
    }
    if (holidayError) {
      onError(holidayError)
    }
  }, [open, holidayError, onError])

  const staffById = useMemo(() => {
    return new Map(staffOptions.map((staffMember) => [staffMember.id, staffMember]))
  }, [staffOptions])

  const handleFixedSubmit = fixedForm.handleSubmit(async (values) => {
    try {
      await createFixed({
        staff_id: Number(values.staffId),
        day: toISODate(values.day),
        shift_code: values.shift,
        position: values.position ?? null,
      })
      onSuccess("Đã lưu ca cố định")
      fixedForm.reset({ staffId: "", day: undefined, shift: undefined, position: null })
      await onRefresh?.()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu ca cố định"
      onError(message)
    }
  })

  const handleOffSubmit = offForm.handleSubmit(async (values) => {
    try {
      const reason = values.reason && values.reason.length > 0 ? values.reason : undefined
      await createOff({
        staff_id: Number(values.staffId),
        day: toISODate(values.day),
        reason: reason ?? null,
      })
      onSuccess("Đã lưu ngày nghỉ")
      offForm.reset({ staffId: "", day: undefined, reason: undefined })
      await onRefresh?.()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu ngày nghỉ"
      onError(message)
    }
  })

  const handleHolidaySubmit = holidayForm.handleSubmit(async (values) => {
    try {
      const name = values.name && values.name.length > 0 ? values.name : undefined
      await createHoliday({
        day: toISODate(values.day),
        name: name ?? null,
      })
      onSuccess("Đã lưu ngày lễ")
      holidayForm.reset({ day: undefined, name: undefined })
      await onRefresh?.()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu ngày lễ"
      onError(message)
    }
  })

  const handleDeleteFixed = async (id: number) => {
    try {
      await deleteFixed(id)
      onSuccess("Đã xóa ca cố định")
      await onRefresh?.()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể xóa ca cố định"
      onError(message)
    }
  }

  const handleDeleteOff = async (id: number) => {
    try {
      await deleteOff(id)
      onSuccess("Đã xóa ngày nghỉ")
      await onRefresh?.()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể xóa ngày nghỉ"
      onError(message)
    }
  }

  const handleDeleteHoliday = async (id: number) => {
    try {
      await deleteHoliday(id)
      onSuccess("Đã xóa ngày lễ")
      await onRefresh?.()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể xóa ngày lễ"
      onError(message)
    }
  }

  return (
    <Tabs
      value={tab}
      onValueChange={(next) => setTab(next as TabValue)}
      className="mt-6 flex h-full flex-col"
    >
      <div className="px-6">
        <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/70 p-1">
          <TabsTrigger value="fixed" className="rounded-full text-sm">
            Ca cố định
          </TabsTrigger>
          <TabsTrigger value="off" className="rounded-full text-sm">
            Ngày nghỉ
          </TabsTrigger>
          <TabsTrigger value="holiday" className="rounded-full text-sm">
            Ngày lễ
          </TabsTrigger>
        </TabsList>
      </div>
      <Separator className="mt-4" />
      <ScrollArea className="h-[60vh] px-6 py-4 sm:h-[55vh]">
        <TabsContent value="fixed" className="space-y-6">
          <section
            aria-labelledby="fixed-form-heading"
            className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-5 shadow-sm"
          >
            <header className="space-y-1">
              <h3 id="fixed-form-heading" className="text-base font-semibold text-foreground">
                Thêm ca cố định
              </h3>
              <p className="text-sm text-muted-foreground">
                Chọn nhân sự, ngày và mã ca để gán ca cố định cho lịch.
              </p>
            </header>
            {staffError ? (
              <Alert variant="destructive">
                <AlertTitle>Lỗi tải nhân sự</AlertTitle>
                <AlertDescription>{staffError}</AlertDescription>
              </Alert>
            ) : null}
            {staffLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : null}
            <Form {...fixedForm}>
              <form onSubmit={handleFixedSubmit} className="space-y-4">
                <FormField
                  control={fixedForm.control}
                  name="staffId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhân viên</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={staffLoading || staffOptions.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhân viên" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {staffOptions.map((staffMember) => (
                            <SelectItem
                              key={staffMember.id}
                              value={String(staffMember.id)}
                            >
                              #{staffMember.id} · {staffMember.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={fixedForm.control}
                    name="day"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Ngày</FormLabel>
                        <FormControl>
                          <DatePicker value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage>
                          {fieldState.error ? REQUIRED_MESSAGE : null}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={fixedForm.control}
                    name="shift"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Mã ca</FormLabel>
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn ca" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SHIFT_OPTIONS.map((shift) => (
                              <SelectItem key={shift} value={shift}>
                                {shift}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>
                          {fieldState.error ? REQUIRED_MESSAGE : null}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={fixedForm.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vị trí</FormLabel>
                      <Select
                        value={field.value ?? "__none__"}
                        onValueChange={(value) =>
                          field.onChange(
                            value === "__none__" ? null : (value as Position),
                          )
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Không" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">Không</SelectItem>
                          {POSITION_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    disabled={
                      !fixedForm.formState.isValid || fixedForm.formState.isSubmitting
                    }
                  >
                    {fixedForm.formState.isSubmitting ? "Đang lưu..." : "Lưu ca cố định"}
                  </Button>
                </div>
              </form>
            </Form>
          </section>
          <section aria-labelledby="fixed-list-heading" className="space-y-3">
            <h3
              id="fixed-list-heading"
              className="text-sm font-semibold text-muted-foreground"
            >
              Danh sách ca cố định
            </h3>
            <div className="space-y-2">
              {fixedLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : fixed.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
                  Chưa có ca cố định.
                </p>
              ) : (
                fixed.map((item) => {
                  const staffInfo = staffById.get(item.staff_id)
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-3 py-2"
                    >
                      <div className="space-y-0.5 text-sm">
                        <p className="font-medium text-foreground">
                          #{item.staff_id}
                          {staffInfo ? ` · ${staffInfo.full_name}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.day} · {item.shift_code}
                          {item.position ? ` · ${item.position}` : ""}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFixed(item.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="off" className="space-y-6">
          <section
            aria-labelledby="off-form-heading"
            className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-5 shadow-sm"
          >
            <header className="space-y-1">
              <h3 id="off-form-heading" className="text-base font-semibold text-foreground">
                Thêm ngày nghỉ
              </h3>
              <p className="text-sm text-muted-foreground">
                Ghi nhận lịch nghỉ có lý do rõ ràng để tránh trùng lặp ca.
              </p>
            </header>
            {staffError ? (
              <Alert variant="destructive">
                <AlertTitle>Lỗi tải nhân sự</AlertTitle>
                <AlertDescription>{staffError}</AlertDescription>
              </Alert>
            ) : null}
            {staffLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : null}
            <Form {...offForm}>
              <form onSubmit={handleOffSubmit} className="space-y-4">
                <FormField
                  control={offForm.control}
                  name="staffId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhân viên</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={staffLoading || staffOptions.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhân viên" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {staffOptions.map((staffMember) => (
                            <SelectItem
                              key={staffMember.id}
                              value={String(staffMember.id)}
                            >
                              #{staffMember.id} · {staffMember.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={offForm.control}
                  name="day"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Ngày nghỉ</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage>
                        {fieldState.error ? REQUIRED_MESSAGE : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={offForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lý do (tuỳ chọn)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ghi chú lý do"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    disabled={!offForm.formState.isValid || offForm.formState.isSubmitting}
                  >
                    {offForm.formState.isSubmitting ? "Đang lưu..." : "Lưu ngày nghỉ"}
                  </Button>
                </div>
              </form>
            </Form>
          </section>
          <section aria-labelledby="off-list-heading" className="space-y-3">
            <h3
              id="off-list-heading"
              className="text-sm font-semibold text-muted-foreground"
            >
              Danh sách ngày nghỉ
            </h3>
            <div className="space-y-2">
              {fixedLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : off.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
                  Chưa có ngày nghỉ.
                </p>
              ) : (
                off.map((item) => {
                  const staffInfo = staffById.get(item.staff_id)
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-3 py-2"
                    >
                      <div className="space-y-0.5 text-sm">
                        <p className="font-medium text-foreground">
                          #{item.staff_id}
                          {staffInfo ? ` · ${staffInfo.full_name}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.day}
                          {item.reason ? ` · ${item.reason}` : ""}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteOff(item.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="holiday" className="space-y-6">
          <section
            aria-labelledby="holiday-form-heading"
            className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-5 shadow-sm"
          >
            <header className="space-y-1">
              <h3
                id="holiday-form-heading"
                className="text-base font-semibold text-foreground"
              >
                Thêm ngày lễ toàn trung tâm
              </h3>
              <p className="text-sm text-muted-foreground">
                Ghi chú ngày lễ giúp tất cả lịch làm việc được đồng bộ.
              </p>
            </header>
            <Form {...holidayForm}>
              <form onSubmit={handleHolidaySubmit} className="space-y-4">
                <FormField
                  control={holidayForm.control}
                  name="day"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Ngày lễ</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage>
                        {fieldState.error ? REQUIRED_MESSAGE : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={holidayForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên ngày lễ (tuỳ chọn)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ví dụ: Giỗ tổ"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    disabled={
                      !holidayForm.formState.isValid || holidayForm.formState.isSubmitting
                    }
                  >
                    {holidayForm.formState.isSubmitting ? "Đang lưu..." : "Lưu ngày lễ"}
                  </Button>
                </div>
              </form>
            </Form>
          </section>
          <section aria-labelledby="holiday-list-heading" className="space-y-3">
            <h3
              id="holiday-list-heading"
              className="text-sm font-semibold text-muted-foreground"
            >
              Danh sách ngày lễ
            </h3>
            <div className="space-y-2">
              {holidayLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : holidays.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
                  Chưa có ngày lễ.
                </p>
              ) : (
                holidays.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-3 py-2"
                  >
                    <div className="space-y-0.5 text-sm">
                      <p className="font-medium text-foreground">{item.day}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.name || "(Không tên)"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteHoliday(item.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                ))
              )}
            </div>
          </section>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}
