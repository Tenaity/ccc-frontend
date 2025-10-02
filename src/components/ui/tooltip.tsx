import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-ios-lg px-3 py-2 font-sf-pro text-ios-footnote",
      "bg-slate-900/95 dark:bg-slate-800/95 text-white",
      "backdrop-blur-2xl backdrop-saturate-150",
      "border border-slate-700/50 dark:border-slate-600/50",
      "shadow-ios-lg",
      "animate-in fade-in-0 zoom-in-95",
      "transition-all duration-200 ease-ios",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
