import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, CheckCircle2, Loader2, Lock, UserCheck } from "lucide-react";

import type { Staff } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassButton, GlassPanel } from "@/components/ui/glass";
import { cn } from "@/lib/utils";

const quickEditSchema = z.object({
  staffId: z.string().min(1, "Chọn nhân viên"),
});

type QuickEditFormValues = z.infer<typeof quickEditSchema>;

/**
 * QuickEditDialog: allow manually overriding a cell assignment.
 *
 * NOTE: Assign action is scaffold only; API call is TODO.
 */
export default function QuickEditDialog({
  open,
  day,
  current,
  candidates,
  fixed,
  onClose,
}: {
  open: boolean;
  day: string;
  current: Staff;
  candidates: Staff[];
  fixed?: boolean;
  onClose: () => void;
}) {
  const [reasons, setReasons] = React.useState<string[]>([]);
  const [isValidating, setIsValidating] = React.useState(false);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const lockedId = React.useId();

  const form = useForm<QuickEditFormValues>({
    resolver: zodResolver(quickEditSchema),
    defaultValues: {
      staffId: current ? String(current.id) : "",
    },
    mode: "onChange",
  });

  const selectedStaffId = form.watch("staffId");
  const hasErrors = reasons.length > 0;

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const initialStaffId = current ? String(current.id) : "";
    setReasons([]);
    form.clearErrors();
    form.reset({ staffId: initialStaffId });
  }, [open, current, form]);

  React.useEffect(() => {
    if (!open) {
      return;
    }
    if (!selectedStaffId) {
      setReasons([]);
      form.clearErrors("staffId");
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const validateSelection = async () => {
      try {
        setIsValidating(true);
        const response = await fetch(
          `/api/schedule/validate?day=${encodeURIComponent(
            day
          )}&staff_id=${encodeURIComponent(selectedStaffId)}`,
          { signal: controller.signal }
        );
        const body = await response.json();
        const nextReasons = Array.isArray(body?.reasons)
          ? (body.reasons as string[])
          : [];

        if (cancelled) {
          return;
        }

        setReasons(nextReasons);
        setIsValidating(false);

        if (nextReasons.length > 0) {
          form.setError("staffId", {
            type: "manual",
            message: `Không thể gán: ${nextReasons.join(", ")}`,
          });
        } else {
          form.clearErrors("staffId");
        }
      } catch (error) {
        if (cancelled) {
          return;
        }
        setIsValidating(false);
        setReasons(["network"]);
        form.setError("staffId", {
          type: "manual",
          message: "Không thể kiểm tra lịch. Vui lòng thử lại.",
        });
      }
    };

    void validateSelection();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [open, day, selectedStaffId, form]);

  const onSubmit = form.handleSubmit(() => {
    onClose();
  });

  if (!open) {
    return null;
  }

  const assignDisabled =
    reasons.length > 0 || !form.formState.isValid || !!fixed;
  const describedBy = fixed
    ? `${descriptionId} ${lockedId}`
    : descriptionId;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen: boolean) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        aria-labelledby={titleId}
        aria-describedby={describedBy}
        className="max-w-md"
      >
        <DialogHeader>
          <DialogTitle id={titleId} className="flex items-center gap-2 text-xl">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <UserCheck className="size-5 text-primary" />
            </div>
            Quick Edit Assignment
          </DialogTitle>
          <DialogDescription id={descriptionId} className="flex items-start gap-2 pt-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">
                Ngày: <span className="font-medium text-foreground">{day}</span>
              </span>
              <span className="text-sm text-muted-foreground">
                Ca hiện tại: <span className="font-semibold text-foreground">{current.full_name}</span>
              </span>
            </div>
          </DialogDescription>
          {fixed ? (
            <GlassPanel variant="strong" id={lockedId} className={cn(
              "mt-2 flex items-center gap-2 p-3 text-sm font-medium",
              "bg-destructive/15 dark:bg-destructive/25",
              "border-destructive/30 dark:border-destructive/40",
              "text-destructive"
            )}>
              <Lock className="size-4" />
              <span>Ca này đã được khóa và không thể thay đổi</span>
            </GlassPanel>
          ) : null}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5 pt-2">
            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => {
                const staffIdMessage =
                  form.formState.errors.staffId?.message ??
                  (reasons.length > 0
                    ? `Không thể gán: ${reasons.join(", ")}`
                    : undefined);

                return (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Chọn nhân viên thay thế</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      disabled={!!fixed}
                    >
                      <FormControl>
                        <SelectTrigger className={cn(
                          "w-full transition-all",
                          hasErrors && "border-destructive focus:ring-destructive",
                          !hasErrors && selectedStaffId && !isValidating && "border-green-500 focus:ring-green-500"
                        )}>
                          <SelectValue placeholder="Chọn nhân viên..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {candidates.map((candidate) => (
                          <SelectItem
                            key={candidate.id}
                            value={String(candidate.id)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span>{candidate.full_name}</span>
                              {String(candidate.id) === String(current.id) && (
                                <span className="text-xs text-muted-foreground">(hiện tại)</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isValidating && (
                      <GlassPanel variant="strong" className={cn(
                        "flex items-center gap-2 p-3 text-sm",
                        "bg-blue-50/60 dark:bg-blue-950/40",
                        "border-blue-200/60 dark:border-blue-800/60",
                        "text-blue-700 dark:text-blue-300"
                      )}>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Đang kiểm tra tính khả dụng...</span>
                      </GlassPanel>
                    )}
                    {!isValidating && selectedStaffId && !hasErrors && (
                      <GlassPanel variant="strong" className={cn(
                        "flex items-center gap-2 p-3 text-sm",
                        "bg-green-50/60 dark:bg-green-950/40",
                        "border-green-200/60 dark:border-green-800/60",
                        "text-green-700 dark:text-green-300"
                      )}>
                        <CheckCircle2 className="size-4" />
                        <span className="font-medium">Nhân viên này khả dụng cho ca này</span>
                      </GlassPanel>
                    )}
                    {hasErrors ? (
                      <GlassPanel
                        variant="strong"
                        role="alert"
                        aria-live="assertive"
                        className={cn(
                          "space-y-2 p-3",
                          "bg-destructive/15 dark:bg-destructive/25",
                          "border-destructive/40 dark:border-destructive/50"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle className="size-4 shrink-0 text-destructive" />
                          <div className="space-y-1">
                            <FormMessage role="none" className="font-medium">{staffIdMessage}</FormMessage>
                            <ul className="list-disc space-y-1 pl-5 text-xs">
                              {reasons.map((reason) => (
                                <li key={reason}>{reason}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </GlassPanel>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                );
              }}
            />

            <div className="flex justify-end gap-3 pt-2">
              <GlassButton
                type="button"
                variant="outline"
                onClick={onClose}
                className="min-w-[100px]"
              >
                Hủy
              </GlassButton>
              <GlassButton
                type="submit"
                variant="primary"
                disabled={assignDisabled}
                className={cn(
                  "min-w-[100px]",
                  assignDisabled && "opacity-60 cursor-not-allowed"
                )}
              >
                {assignDisabled ? (
                  "Không thể gán"
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 size-4" />
                    Xác nhận
                  </>
                )}
              </GlassButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
