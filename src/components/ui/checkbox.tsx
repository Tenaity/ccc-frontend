import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-ios-sm border border-slate-300/70 dark:border-slate-700/70",
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl",
        "shadow-ios-sm",
        "outline-none transition-all duration-200 ease-ios",
        "focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:ring-offset-1",
        "data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-ios-blue data-[state=checked]:via-ios-blue/95 data-[state=checked]:to-ios-blue/90",
        "data-[state=checked]:border-ios-blue data-[state=checked]:text-white",
        "data-[state=checked]:shadow-ios",
        "aria-invalid:ring-2 aria-invalid:ring-ios-red/30 aria-invalid:border-ios-red",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "active:scale-95",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
