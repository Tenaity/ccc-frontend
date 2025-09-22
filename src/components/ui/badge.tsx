import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground shadow-sm",
        outline: "border-border/70 bg-background text-foreground shadow-sm",
        muted: "bg-muted text-muted-foreground",
        leader:
          "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
        night:
          "border-slate-800 bg-slate-900 text-slate-50 shadow-[0_1px_0_rgba(15,23,42,0.55)]",
        pgd: "border-rose-200 bg-rose-50 text-rose-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
        duplicate:
          "border-destructive/70 text-destructive ring-2 ring-destructive/60 shadow-[0_0_0_1px_rgba(248,113,113,0.35)]",
        fixed: "border-primary/40 bg-primary/10 text-primary",
        off: "border-border/70 bg-muted text-muted-foreground",
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
