import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-sf-pro text-ios-caption-1 font-semibold transition-all duration-200 ease-ios focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-ios-blue via-ios-blue/95 to-ios-blue/90 text-white shadow-ios-sm px-2.5 py-1",
        secondary:
          "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 text-foreground shadow-ios-sm px-2.5 py-1",
        destructive:
          "bg-gradient-to-br from-ios-red via-ios-red/95 to-ios-red/90 text-white shadow-ios-sm px-2.5 py-1",
        outline:
          "border border-slate-300/70 dark:border-slate-700/70 bg-transparent text-foreground shadow-ios-sm px-2.5 py-1",
        muted:
          "bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-xl text-muted-foreground px-2.5 py-1",
        leader:
          "border border-emerald-300/60 bg-gradient-to-br from-ios-green/20 via-emerald-50/95 to-emerald-100/90 dark:from-emerald-900/30 dark:via-emerald-900/20 dark:to-emerald-800/20 text-emerald-900 dark:text-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-xl px-2.5 py-1",
        night:
          "border border-slate-700/60 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 text-slate-50 shadow-ios-sm backdrop-blur-xl px-2.5 py-1",
        pgd:
          "border border-rose-300/60 bg-gradient-to-br from-ios-red/20 via-rose-50/95 to-rose-100/90 dark:from-rose-900/30 dark:via-rose-900/20 dark:to-rose-800/20 text-rose-900 dark:text-rose-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-xl px-2.5 py-1",
        duplicate:
          "border-2 border-ios-red/70 bg-ios-red/10 dark:bg-ios-red/20 text-ios-red dark:text-ios-red ring-2 ring-ios-red/30 shadow-[0_0_0_1px_rgba(255,59,48,0.2)] backdrop-blur-xl px-2 py-0.5",
        fixed:
          "border border-ios-blue/40 bg-ios-blue/15 dark:bg-ios-blue/25 backdrop-blur-xl text-ios-blue shadow-ios-sm px-2.5 py-1",
        off:
          "border border-slate-300/60 dark:border-slate-700/60 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-xl text-muted-foreground px-2.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
