import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer items-center rounded-full p-0.5",
      "border border-transparent",
      "transition-all duration-300 ease-ios",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-40",
      "bg-slate-300/90 dark:bg-slate-700/90",
      "data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-ios-green data-[state=checked]:via-ios-green/95 data-[state=checked]:to-ios-green/90",
      "shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]",
      "data-[state=checked]:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]",
      "active:scale-95",
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "block h-[27px] w-[27px] rounded-full",
        "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.15)]",
        "transition-transform duration-300 ease-ios",
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
