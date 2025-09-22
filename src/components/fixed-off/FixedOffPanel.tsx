import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFixedOff } from "@/hooks/useFixedOff";
import { useHolidays } from "@/hooks/useHolidays";
import type { ShiftCode, Position, Staff } from "@/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

type ToastOptions = {
  title?: React.ReactNode;
  variant?: "default" | "destructive";
};

export default function FixedOffPanel({
  year,
  month,
  open,
  onClose,
  onToast,
  onRefresh,
  onExportCsv,
  exporting = false,
}: {
  year: number;
  month: number;
  open: boolean;
  onClose: () => void;
  onToast?: (msg: string, options?: ToastOptions) => void;
  onRefresh?: () => Promise<void> | void;
  onExportCsv?: () => Promise<void> | void;
  exporting?: boolean;
}) {
  const { fixed, off, load, createFixed, deleteFixed, createOff, deleteOff } =
    useFixedOff(year, month);
  const { holidays, load: loadHolidays, createHoliday, deleteHoliday } = useHolidays(year, month);
  const [tab, setTab] = useState<"fixed" | "off" | "holiday" | "export">("fixed");
  const [staffOptions, setStaffOptions] = useState<Staff[]>([]);

  const fixedForm = useForm<{
    staffId: string;
    day: Date | undefined;
    shift: ShiftCode | undefined;
    position: Position | undefined;
  }>({
    defaultValues: {
      staffId: "",
      day: undefined,
      shift: undefined,
      position: undefined,
    },
    mode: "onChange",
  });

  const offForm = useForm<{
    staffId: string;
    day: Date | undefined;
    reason: string;
  }>({
    defaultValues: { staffId: "", day: undefined, reason: "" },
    mode: "onChange",
  });

  const holidayForm = useForm<{
    day: Date | undefined;
    name: string;
  }>({
    defaultValues: { day: undefined, name: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      load();
      loadHolidays();
      fixedForm.reset({
        staffId: "",
        day: undefined,
        shift: undefined,
        position: undefined,
      });
      offForm.reset({ staffId: "", day: undefined, reason: "" });
      holidayForm.reset({ day: undefined, name: "" });
    }
  }, [open, year, month, load, loadHolidays, fixedForm, offForm, holidayForm]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch("/api/staff");
        const json = await res.json();
        setStaffOptions(Array.isArray(json) ? json : []);
      } catch (error) {
        setStaffOptions([]);
        onToast?.("Không thể tải danh sách nhân viên", {
          variant: "destructive",
        });
      }
    })();
  }, [open, onToast]);

  const submitFixed = fixedForm.handleSubmit(async (values) => {
    try {
      await createFixed({
        staff_id: Number(values.staffId),
        day: values.day?.toISOString().slice(0, 10) || "",
        shift_code: values.shift!,
        position: values.position ?? null,
      });
      onToast?.("Đã lưu ca cố định", { title: "Thành công" });
      await onRefresh?.();
      onClose();
    } catch (error: any) {
      onToast?.(error?.message || "Không thể lưu ca cố định", {
        variant: "destructive",
      });
    }
  });

  const submitOff = offForm.handleSubmit(async (values) => {
    try {
      await createOff({
        staff_id: Number(values.staffId),
        day: values.day?.toISOString().slice(0, 10) || "",
        reason: values.reason || null,
      });
      onToast?.("Đã lưu ngày nghỉ", { title: "Thành công" });
      await onRefresh?.();
      onClose();
    } catch (error: any) {
      onToast?.(error?.message || "Không thể lưu ngày nghỉ", {
        variant: "destructive",
      });
    }
  });

  const submitHoliday = holidayForm.handleSubmit(async (values) => {
    try {
      await createHoliday({
        day: values.day?.toISOString().slice(0, 10) || "",
        name: values.name || null,
      });
      onToast?.("Đã lưu ngày lễ", { title: "Thành công" });
      await onRefresh?.();
      onClose();
    } catch (error: any) {
      onToast?.(error?.message || "Không thể lưu ngày lễ", {
        variant: "destructive",
      });
    }
  });

  const handleDelete = async (
    action: () => Promise<void>,
    successMessage: string
  ) => {
    try {
      await action();
      onToast?.(successMessage, { title: "Đã xóa" });
      await onRefresh?.();
    } catch (error: any) {
      onToast?.(error?.message || "Không thể xóa", {
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        className="relative max-h-[90vh] w-full max-w-xl gap-4 overflow-hidden rounded-l-3xl border-border/70 bg-background px-0 py-4 sm:px-0"
        aria-describedby="fixed-off-description"
      >
        <DialogClose className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-muted/70 text-muted-foreground transition hover:bg-muted">
          <span className="sr-only">Đóng</span>
          <X className="h-4 w-4" />
        </DialogClose>
        <DialogHeader className="px-6">
          <DialogTitle>Fixed &amp; Off</DialogTitle>
          <DialogDescription id="fixed-off-description">
            Quản lý ca cố định và ngày nghỉ cho tháng {month}/{year}.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as "fixed" | "off")}
          className="px-6"
        >
          <TabsList className="grid grid-cols-4 rounded-full bg-muted">
            <TabsTrigger value="fixed">Ca cố định</TabsTrigger>
            <TabsTrigger value="off">Ngày nghỉ</TabsTrigger>
            <TabsTrigger value="holiday">Ngày lễ</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
        </Tabs>
        <Separator className="mx-6" />
        <ScrollArea className="px-6">
          <TabsContent value="fixed" className="mt-4 space-y-6">
            <Form {...fixedForm}>
              <form onSubmit={submitFixed} className="space-y-4">
                <FormField
                  control={fixedForm.control}
                  name="staffId"
                  rules={{ required: "Bắt buộc" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhân viên</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!staffOptions.length}
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
                              {staffMember.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={fixedForm.control}
                  name="day"
                  rules={{ required: "Bắt buộc" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={fixedForm.control}
                  name="shift"
                  rules={{ required: "Bắt buộc" }}
                  render={({ field }) => (
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
                          <SelectItem value="CA1">CA1</SelectItem>
                          <SelectItem value="CA2">CA2</SelectItem>
                          <SelectItem value="K">K</SelectItem>
                          <SelectItem value="HC">HC</SelectItem>
                          <SelectItem value="Đ">Đ</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                            value === "__none__" ? undefined : (value as Position)
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
                          <SelectItem value="TD">TD</SelectItem>
                          <SelectItem value="PGD">PGD</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={!fixedForm.formState.isValid}>
                    Thêm ca cố định
                  </Button>
                </div>
              </form>
            </Form>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">
                Danh sách ca cố định
              </h3>
              <ul className="mt-3 space-y-2">
                {fixed.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm"
                  >
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground">
                        #{item.staff_id} · {item.shift_code}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.day}
                        {item.position ? ` · ${item.position}` : ""}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleDelete(() => deleteFixed(item.id), "Đã xóa ca cố định")
                      }
                    >
                      Xóa
                    </Button>
                  </li>
                ))}
                {fixed.length === 0 ? (
                  <li className="rounded-lg border border-dashed border-border/60 px-3 py-6 text-center text-sm text-muted-foreground">
                    Chưa có ca cố định.
                  </li>
                ) : null}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="off" className="mt-4 space-y-6">
            <Form {...offForm}>
              <form onSubmit={submitOff} className="space-y-4">
                <FormField
                  control={offForm.control}
                  name="staffId"
                  rules={{ required: "Bắt buộc" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhân viên</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!staffOptions.length}
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
                              {staffMember.full_name}
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
                  rules={{ required: "Bắt buộc" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày nghỉ</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={offForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lý do</FormLabel>
                      <FormControl>
                        <Input placeholder="(tuỳ chọn)" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={!offForm.formState.isValid}>
                    Thêm ngày nghỉ
                  </Button>
                </div>
              </form>
            </Form>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">
                Danh sách ngày nghỉ
              </h3>
              <ul className="mt-3 space-y-2">
                {off.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm"
                  >
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground">
                        #{item.staff_id}
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
                      onClick={() =>
                        handleDelete(() => deleteOff(item.id), "Đã xóa ngày nghỉ")
                      }
                    >
                      Xóa
                    </Button>
                  </li>
                ))}
                {off.length === 0 ? (
                  <li className="rounded-lg border border-dashed border-border/60 px-3 py-6 text-center text-sm text-muted-foreground">
                    Chưa có ngày nghỉ.
                  </li>
                ) : null}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="holiday" className="mt-4 space-y-6">
            <Form {...holidayForm}>
              <form onSubmit={submitHoliday} className="space-y-4">
                <FormField
                  control={holidayForm.control}
                  name="day"
                  rules={{ required: "Bắt buộc" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày lễ</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={holidayForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên ngày lễ</FormLabel>
                      <FormControl>
                        <Input placeholder="(tuỳ chọn)" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={!holidayForm.formState.isValid}>
                    Thêm ngày lễ
                  </Button>
                </div>
              </form>
            </Form>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">
                Danh sách ngày lễ
              </h3>
              <ul className="mt-3 space-y-2">
                {holidays.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm"
                  >
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground">{item.day}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.name || "(Không tên)"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleDelete(() => deleteHoliday(item.id), "Đã xóa ngày lễ")
                      }
                    >
                      Xóa
                    </Button>
                  </li>
                ))}
                {holidays.length === 0 ? (
                  <li className="rounded-lg border border-dashed border-border/60 px-3 py-6 text-center text-sm text-muted-foreground">
                    Chưa có ngày lễ.
                  </li>
                ) : null}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="export" className="mt-4 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Export CSV
              </h3>
              <p className="text-sm text-muted-foreground">
                Xuất lịch phân ca tháng {month}/{year} dưới dạng CSV để chia sẻ hoặc lưu trữ.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                disabled={exporting || !onExportCsv}
                onClick={() => {
                  if (onExportCsv) {
                    void onExportCsv();
                  }
                }}
              >
                {exporting ? "Đang xuất..." : "Export CSV"}
              </Button>
            </div>
          </TabsContent>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
