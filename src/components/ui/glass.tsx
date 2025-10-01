import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Glass UI Design System
 * iOS 26-inspired glassmorphism components with enhanced visibility
 */

// Glass Card Variants
const glassCardVariants = cva(
  [
    "rounded-2xl",
    "backdrop-blur-2xl backdrop-saturate-150",
    "border",
    "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
    "transition-all duration-300",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-white/90 dark:bg-slate-900/90",
          "border-white/30 dark:border-white/20",
        ],
        subtle: [
          "bg-white/70 dark:bg-slate-900/70",
          "border-white/20 dark:border-white/10",
        ],
        strong: [
          "bg-white/95 dark:bg-slate-900/95",
          "border-white/40 dark:border-white/30",
        ],
        frosted: [
          "bg-white/80 dark:bg-slate-900/80",
          "border-white/25 dark:border-white/15",
        ],
      },
      hoverable: {
        true: "hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]",
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

// Glass Button Variants
const glassButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl px-4 py-2",
    "text-sm font-medium",
    "backdrop-blur-xl backdrop-saturate-150",
    "border",
    "transition-all duration-200",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-white/80 dark:bg-black/40",
          "border-white/40 dark:border-white/20",
          "hover:bg-white/90 dark:hover:bg-black/50",
          "text-foreground",
          "shadow-sm hover:shadow-md",
        ],
        primary: [
          "bg-gradient-to-r from-primary/90 to-primary/80",
          "hover:from-primary hover:to-primary/90",
          "border-primary/30",
          "text-primary-foreground",
          "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
        ],
        secondary: [
          "bg-gradient-to-r from-purple-500/30 to-pink-500/30",
          "hover:from-purple-500/40 hover:to-pink-500/40",
          "border-purple-300/50 dark:border-purple-700/50",
          "text-foreground",
          "shadow-md hover:shadow-lg",
        ],
        outline: [
          "bg-white/50 dark:bg-black/30",
          "border-white/60 dark:border-white/30",
          "hover:bg-white/70 dark:hover:bg-black/40",
          "hover:border-primary/50",
          "text-foreground",
        ],
        ghost: [
          "bg-transparent",
          "border-transparent",
          "hover:bg-white/30 dark:hover:bg-black/20",
          "text-foreground",
        ],
        destructive: [
          "bg-gradient-to-r from-destructive/90 to-destructive/80",
          "hover:from-destructive hover:to-destructive/90",
          "border-destructive/30",
          "text-destructive-foreground",
          "shadow-lg shadow-destructive/20 hover:shadow-xl hover:shadow-destructive/30",
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-9 px-4 text-sm rounded-xl",
        lg: "h-11 px-6 text-base rounded-xl",
        icon: "h-9 w-9 p-0 rounded-xl",
      },
      interactive: {
        true: "hover:scale-105 active:scale-95",
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

// Glass Badge Variants
const glassBadgeVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "rounded-xl px-3 py-1.5",
    "text-xs font-medium",
    "backdrop-blur-md backdrop-saturate-150",
    "border",
    "shadow-sm",
    "transition-all duration-200",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-white/70 dark:bg-black/30",
          "border-white/40 dark:border-white/20",
          "text-foreground",
        ],
        primary: [
          "bg-primary/20 dark:bg-primary/30",
          "border-primary/30 dark:border-primary/40",
          "text-primary dark:text-primary-foreground",
        ],
        success: [
          "bg-green-500/20 dark:bg-green-500/30",
          "border-green-500/30 dark:border-green-500/40",
          "text-green-700 dark:text-green-300",
        ],
        warning: [
          "bg-yellow-500/20 dark:bg-yellow-500/30",
          "border-yellow-500/30 dark:border-yellow-500/40",
          "text-yellow-700 dark:text-yellow-300",
        ],
        destructive: [
          "bg-destructive/20 dark:bg-destructive/30",
          "border-destructive/30 dark:border-destructive/40",
          "text-destructive dark:text-destructive-foreground",
        ],
        info: [
          "bg-blue-500/20 dark:bg-blue-500/30",
          "border-blue-500/30 dark:border-blue-500/40",
          "text-blue-700 dark:text-blue-300",
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

// Glass Panel Component
interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "strong"
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-white/80 dark:bg-slate-900/80 border-white/30 dark:border-white/20",
      subtle: "bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10",
      strong: "bg-white/90 dark:bg-slate-900/90 border-white/40 dark:border-white/30",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-5",
          "backdrop-blur-2xl backdrop-saturate-150",
          "border",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          "transition-all duration-300",
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

// Glass Input Wrapper
const GlassInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-xl px-3 py-2 text-sm",
      "bg-white/70 dark:bg-black/30",
      "backdrop-blur-xl backdrop-saturate-150",
      "border border-white/40 dark:border-white/20",
      "text-foreground placeholder:text-muted-foreground",
      "transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "focus-visible:border-primary/50",
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
