import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-ios font-sf-pro text-ios-callout font-semibold transition-all duration-200 ease-ios focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-ios-blue via-ios-blue/95 to-ios-blue/85 text-white shadow-ios-lg shadow-ios-blue/25 hover:shadow-ios-xl hover:shadow-ios-blue/35",
        destructive:
          "bg-gradient-to-br from-ios-red via-ios-red/95 to-ios-red/85 text-white shadow-ios-lg shadow-ios-red/25 hover:shadow-ios-xl hover:shadow-ios-red/35",
        outline:
          "border border-slate-300/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 shadow-ios-sm hover:bg-white/80 dark:hover:bg-slate-900/80 hover:border-ios-blue/50 text-foreground",
        secondary:
          "bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 text-foreground shadow-ios hover:shadow-ios-lg backdrop-blur-xl",
        ghost: "hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-foreground",
        link: "text-ios-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-ios-sm px-3 text-ios-footnote",
        lg: "h-11 rounded-ios-lg px-6 text-ios-body",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
