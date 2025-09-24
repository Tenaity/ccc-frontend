import React, { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

import FixedOffHolidayForm from "./FixedOffHolidayForm"

interface FixedOffHolidayBtnProps
  extends Omit<React.ComponentProps<typeof Button>, "onClick"> {
  year: number
  month: number
  onRefresh?: () => Promise<void> | void
}

export default function FixedOffHolidayBtn({
  year,
  month,
  onRefresh,
  children,
  disabled,
  variant = "outline",
  size = "sm",
  ...buttonProps
}: FixedOffHolidayBtnProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const runRefresh = useCallback(async () => {
    try {
      await onRefresh?.()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể làm mới dữ liệu lịch."
      toast({
        variant: "destructive",
        title: "Làm mới thất bại",
        description: message,
      })
    }
  }, [onRefresh, toast])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (!nextOpen) {
        void runRefresh()
      }
    },
    [runRefresh],
  )

  const handleSuccess = useCallback(
    (message: string) => {
      toast({ title: "Thành công", description: message })
    },
    [toast],
  )

  const handleError = useCallback(
    (message: string) => {
      toast({
        variant: "destructive",
        title: "Thao tác thất bại",
        description: message,
      })
    },
    [toast],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          disabled={disabled}
          {...buttonProps}
        >
          {children ?? "Fixed / Off / Holiday"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] w-full max-w-none gap-0 overflow-hidden p-0 sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[90vh] sm:w-[720px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:border sm:border-border/60 sm:bg-background sm:shadow-2xl sm:p-0 sm:right-auto">
        <DialogHeader className="px-6 pb-0 pt-6">
          <DialogTitle>Fixed / Off / Holiday</DialogTitle>
          <DialogDescription>
            Quản lý ca cố định, ngày nghỉ và ngày lễ cho tháng {month}/{year}.
          </DialogDescription>
        </DialogHeader>
        <FixedOffHolidayForm
          year={year}
          month={month}
          open={open}
          onRefresh={runRefresh}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </DialogContent>
    </Dialog>
  )
}
