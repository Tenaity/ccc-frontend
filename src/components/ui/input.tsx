import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-ios px-4 py-2 font-sf-pro text-ios-body",
          "bg-white/80 dark:bg-slate-900/80",
          "backdrop-blur-2xl backdrop-saturate-150",
          "border border-slate-200/50 dark:border-slate-700/50",
          "text-foreground placeholder:text-muted-foreground/70",
          "shadow-ios-sm",
          "transition-all duration-200 ease-ios",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:border-ios-blue/60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-ios-callout file:font-medium file:text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
