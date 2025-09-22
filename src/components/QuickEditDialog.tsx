import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Staff } from "@/types";
import { Button } from "@/components/ui/button";
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      className="w-full max-w-md space-y-4 rounded-lg border border-border/70 bg-background p-6 shadow-lg"
    >
      <div>
        <h2 id={titleId} className="text-lg font-semibold text-foreground">
          Quick Edit
        </h2>
        <p id={descriptionId} className="text-sm text-muted-foreground">
          Ca hiện tại: <strong>{current.full_name}</strong>
        </p>
        {fixed ? (
          <p
            id={lockedId}
            className="mt-2 text-sm font-medium text-destructive"
          >
            Đã khóa
          </p>
        ) : null}
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="staffId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhân viên</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  disabled={!!fixed}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem
                        key={candidate.id}
                        value={String(candidate.id)}
                      >
                        {candidate.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {reasons.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-destructive" role="list">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button type="submit" disabled={assignDisabled}>
              Assign
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
