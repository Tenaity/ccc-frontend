import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type DatePickerProps = {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  formatString?: string
} & Omit<React.ComponentPropsWithoutRef<typeof Button>, "onChange" | "value">

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Chọn ngày",
      formatString = "yyyy-MM-dd",
      className,
      variant = "outline",
      type = "button",
      ...buttonProps
    },
    ref,
  ) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type={type}
            variant={variant}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className,
            )}
            {...buttonProps}
          >
            <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            {value ? format(value, formatString) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
        </PopoverContent>
      </Popover>
    )
  },
)

DatePicker.displayName = "DatePicker"
