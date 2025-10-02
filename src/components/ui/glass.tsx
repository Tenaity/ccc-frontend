import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Glass UI Design System
 * Apple/iOS-inspired glassmorphism components with Big Tech aesthetics
 * Optimized for visibility and accessibility
 */

// Glass Card Variants
const glassCardVariants = cva(
  [
    "rounded-ios-lg font-sf-pro",
    "backdrop-blur-3xl backdrop-saturate-150",
    "border",
    "shadow-glass dark:shadow-glass-lg",
    "transition-all duration-300 ease-ios",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-white/90 dark:bg-slate-900/90",
          "border-slate-200/50 dark:border-slate-800/50",
        ],
        subtle: [
          "bg-white/75 dark:bg-slate-900/75",
          "border-slate-200/40 dark:border-slate-800/40",
        ],
        strong: [
          "bg-white/95 dark:bg-slate-900/95",
          "border-slate-200/60 dark:border-slate-800/60",
        ],
        frosted: [
          "bg-white/85 dark:bg-slate-900/85",
          "border-slate-200/45 dark:border-slate-800/45",
        ],
      },
      hoverable: {
        true: "hover:scale-[1.01] hover:shadow-glass-lg active:scale-[0.99] cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hoverable: false,
    },
  }
)

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, hoverable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(glassCardVariants({ variant, hoverable }), className)}
      {...props}
    />
  )
)
GlassCard.displayName = "GlassCard"

// Glass Button Variants - iOS/Big Tech Style
const glassButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-sf-pro",
    "rounded-ios px-4 py-2",
    "text-ios-callout font-semibold",
    "backdrop-blur-3xl backdrop-saturate-150",
    "border",
    "transition-all duration-200 ease-ios",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-white/85 dark:bg-slate-800/85",
          "border-slate-200/50 dark:border-slate-700/50",
          "hover:bg-white/95 dark:hover:bg-slate-800/95",
          "text-foreground",
          "shadow-ios hover:shadow-ios-lg",
        ],
        primary: [
          "bg-gradient-to-br from-ios-blue via-ios-blue/95 to-ios-blue/85",
          "hover:from-ios-blue hover:to-ios-blue/90",
          "border-ios-blue/30",
          "text-white",
          "shadow-ios-lg shadow-ios-blue/25 hover:shadow-ios-xl hover:shadow-ios-blue/35",
        ],
        secondary: [
          "bg-gradient-to-br from-ios-purple/35 to-ios-pink/35",
          "hover:from-ios-purple/45 hover:to-ios-pink/45",
          "border-ios-purple/40 dark:border-ios-purple/50",
          "text-foreground font-semibold",
          "shadow-ios hover:shadow-ios-lg",
        ],
        outline: [
          "bg-white/60 dark:bg-slate-900/60",
          "border-slate-300/60 dark:border-slate-700/60",
          "hover:bg-white/80 dark:hover:bg-slate-900/80",
          "hover:border-ios-blue/50",
          "text-foreground",
          "shadow-ios-sm hover:shadow-ios",
        ],
        ghost: [
          "bg-transparent",
          "border-transparent",
          "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
          "text-foreground",
        ],
        destructive: [
          "bg-gradient-to-br from-ios-red via-ios-red/95 to-ios-red/85",
          "hover:from-ios-red hover:to-ios-red/90",
          "border-ios-red/30",
          "text-white",
          "shadow-ios-lg shadow-ios-red/25 hover:shadow-ios-xl hover:shadow-ios-red/35",
        ],
      },
      size: {
        sm: "h-8 px-3 text-ios-footnote rounded-ios-sm",
        md: "h-10 px-4 text-ios-callout rounded-ios",
        lg: "h-11 px-6 text-ios-body rounded-ios-lg",
        icon: "h-10 w-10 p-0 rounded-ios",
      },
      interactive: {
        true: "active:scale-95 ios-active",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: true,
    },
  }
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, interactive, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(glassButtonVariants({ variant, size, interactive }), className)}
      {...props}
    />
  )
)
GlassButton.displayName = "GlassButton"

// Glass Badge Variants - iOS/Big Tech Style
const glassBadgeVariants = cva(
  [
    "inline-flex items-center gap-2 font-sf-pro",
    "rounded-ios px-3 py-1.5",
    "text-ios-footnote font-semibold",
    "backdrop-blur-2xl backdrop-saturate-150",
    "border",
    "shadow-ios-sm",
    "transition-all duration-200 ease-ios",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-white/75 dark:bg-slate-800/75",
          "border-slate-200/50 dark:border-slate-700/50",
          "text-foreground",
        ],
        primary: [
          "bg-ios-blue/15 dark:bg-ios-blue/25",
          "border-ios-blue/30 dark:border-ios-blue/40",
          "text-ios-blue dark:text-ios-blue-light",
        ],
        success: [
          "bg-ios-green/15 dark:bg-ios-green/25",
          "border-ios-green/30 dark:border-ios-green/40",
          "text-ios-green dark:text-ios-green-light",
        ],
        warning: [
          "bg-ios-orange/15 dark:bg-ios-orange/25",
          "border-ios-orange/30 dark:border-ios-orange/40",
          "text-ios-orange dark:text-ios-orange-light",
        ],
        destructive: [
          "bg-ios-red/15 dark:bg-ios-red/25",
          "border-ios-red/30 dark:border-ios-red/40",
          "text-ios-red dark:text-ios-red-light",
        ],
        info: [
          "bg-ios-teal/15 dark:bg-ios-teal/25",
          "border-ios-teal/30 dark:border-ios-teal/40",
          "text-ios-teal-dark dark:text-ios-teal-light",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface GlassBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassBadgeVariants> {}

const GlassBadge = React.forwardRef<HTMLDivElement, GlassBadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(glassBadgeVariants({ variant }), className)}
      {...props}
    />
  )
)
GlassBadge.displayName = "GlassBadge"

// Glass Panel Component - iOS/Big Tech Style
interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "strong"
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-white/85 dark:bg-slate-900/85 border-slate-200/50 dark:border-slate-800/50",
      subtle: "bg-white/70 dark:bg-slate-900/70 border-slate-200/40 dark:border-slate-800/40",
      strong: "bg-white/95 dark:bg-slate-900/95 border-slate-200/60 dark:border-slate-800/60",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-ios-lg p-5 font-sf-pro",
          "backdrop-blur-3xl backdrop-saturate-150",
          "border",
          "shadow-glass dark:shadow-glass-lg",
          "transition-all duration-300 ease-ios",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
GlassPanel.displayName = "GlassPanel"

// Glass Container Component (for backgrounds)
interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg" | "xl" | "2xl"
}

const GlassContainer = React.forwardRef<HTMLDivElement, GlassContainerProps>(
  ({ className, blur = "xl", children, ...props }, ref) => {
    const blurClasses = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
      "2xl": "backdrop-blur-2xl",
    }

    return (
      <div
        ref={ref}
        className={cn(
          blurClasses[blur],
          "backdrop-saturate-150",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GlassContainer.displayName = "GlassContainer"

// Glass Input Wrapper - iOS/Big Tech Style
const GlassInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-ios px-4 py-2 font-sf-pro text-ios-body",
      "bg-white/80 dark:bg-slate-900/80",
      "backdrop-blur-2xl backdrop-saturate-150",
      "border border-slate-200/50 dark:border-slate-700/50",
      "text-foreground placeholder:text-muted-foreground/70",
      "shadow-ios-sm",
      "transition-all duration-200 ease-ios",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue",
      "focus-visible:border-ios-blue/60",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
GlassInput.displayName = "GlassInput"

export {
  GlassCard,
  GlassButton,
  GlassBadge,
  GlassPanel,
  GlassContainer,
  GlassInput,
  glassCardVariants,
  glassButtonVariants,
  glassBadgeVariants,
}
