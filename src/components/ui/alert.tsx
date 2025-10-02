import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-ios-lg px-4 py-3.5 font-sf-pro text-ios-callout backdrop-blur-xl backdrop-saturate-150 border shadow-ios transition-all duration-200 ease-ios [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current [&>svg+div]:translate-y-[-2px] [&>svg~*]:pl-8",
  {
    variants: {
      variant: {
        default:
          "bg-white/90 dark:bg-slate-900/90 text-foreground border-slate-200/60 dark:border-slate-800/60",
        success:
          "border-emerald-300/60 bg-gradient-to-br from-ios-green/15 via-emerald-50/95 to-emerald-100/90 dark:from-emerald-900/25 dark:via-emerald-900/20 dark:to-emerald-800/20 text-emerald-900 dark:text-emerald-100",
        destructive:
          "border-ios-red/40 bg-gradient-to-br from-ios-red/15 via-rose-50/95 to-rose-100/90 dark:from-rose-900/25 dark:via-rose-900/20 dark:to-rose-800/20 text-ios-red dark:text-rose-100",
        warning:
          "border-ios-orange/40 bg-gradient-to-br from-ios-orange/15 via-amber-50/95 to-amber-100/90 dark:from-amber-900/25 dark:via-amber-900/20 dark:to-amber-800/20 text-amber-900 dark:text-amber-100",
        muted:
          "border-slate-300/60 dark:border-slate-700/60 bg-slate-100/90 dark:bg-slate-800/90 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  React.ElementRef<"h5">,
  React.ComponentPropsWithoutRef<"h5">
>(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-sf-pro text-ios-headline font-semibold leading-tight tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-sf-pro text-ios-subhead leading-relaxed opacity-90", className)}
    {...props}
  >
    {children}
  </p>
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

