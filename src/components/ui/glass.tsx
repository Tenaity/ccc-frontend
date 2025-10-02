import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Glass UI Design System
 * Apple/iOS-inspired glassmorphism components with Big Tech aesthetics
 * Optimized for visibility and accessibility
 */

// Glass Card Variants - macOS Sequoia Style
const glassCardVariants = cva(
  [
    "rounded-lg font-sf-pro",
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

// Glass Button Variants - iOS/Big Tech Style with Blue-Pink Gradient
const glassButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-sf-pro",
    "text-ios-callout font-semibold",
    "backdrop-blur-3xl backdrop-saturate-150",
    "border",
    "transition-all duration-200 ease-ios",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
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
          "bg-gradient-to-br from-sky-500 via-indigo-500 to-pink-500",
          "hover:from-sky-600 hover:via-indigo-600 hover:to-pink-600",
          "border-sky-400/60",
          "text-white font-bold",
          "shadow-[0_10px_40px_rgba(56,189,248,0.4),0_4px_20px_rgba(236,72,153,0.3)]",
          "hover:shadow-[0_12px_50px_rgba(56,189,248,0.5),0_6px_25px_rgba(236,72,153,0.4)]",
        ],
        secondary: [
          "bg-gradient-to-br from-sky-400/20 via-indigo-400/20 to-pink-400/20",
          "hover:from-sky-400/30 hover:via-indigo-400/30 hover:to-pink-400/30",
          "border-sky-400/40 dark:border-indigo-400/40",
          "text-foreground font-semibold",
          "shadow-[0_8px_24px_rgba(99,102,241,0.15),0_4px_12px_rgba(236,72,153,0.15)]",
          "hover:shadow-[0_12px_32px_rgba(99,102,241,0.25),0_6px_16px_rgba(236,72,153,0.2)]",
        ],
        outline: [
          "bg-white/60 dark:bg-slate-900/60",
          "border-slate-300/70 dark:border-slate-700/70",
          "hover:bg-white/80 dark:hover:bg-slate-900/80",
          "hover:border-sky-400/70 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]",
          "text-foreground",
          "shadow-ios-sm hover:shadow-ios",
        ],
        ghost: [
          "bg-transparent",
          "border-transparent",
          "hover:bg-gradient-to-br hover:from-sky-100/50 hover:via-indigo-100/50 hover:to-pink-100/50",
          "dark:hover:from-sky-900/30 dark:hover:via-indigo-900/30 dark:hover:to-pink-900/30",
          "text-foreground",
        ],
        destructive: [
          "bg-gradient-to-br from-rose-500 via-pink-500 to-red-500",
          "hover:from-rose-600 hover:via-pink-600 hover:to-red-600",
          "border-rose-400/30",
          "text-white font-bold",
          "shadow-[0_10px_40px_rgba(244,63,94,0.4)]",
          "hover:shadow-[0_12px_50px_rgba(244,63,94,0.5)]",
        ],
      },
      size: {
        sm: "h-8 px-3 text-ios-footnote rounded-md",
        md: "h-10 px-4 text-ios-callout rounded-lg",
        lg: "h-11 px-6 text-ios-body rounded-lg",
        icon: "h-10 w-10 p-0 rounded-lg",
      },
      interactive: {
        true: "active:scale-95",
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

// Glass Badge Variants - iOS/Big Tech Style with Blue-Pink Theme
const glassBadgeVariants = cva(
  [
    "inline-flex items-center gap-2 font-sf-pro",
    "rounded-full px-3 py-1.5",
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
          "bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-pink-500/15",
          "border-sky-400/40 dark:border-indigo-400/40",
          "text-sky-700 dark:text-sky-300 font-bold",
        ],
        success: [
          "bg-emerald-500/15 dark:bg-emerald-500/25",
          "border-emerald-400/30 dark:border-emerald-400/40",
          "text-emerald-700 dark:text-emerald-300",
        ],
        warning: [
          "bg-amber-500/15 dark:bg-amber-500/25",
          "border-amber-400/30 dark:border-amber-400/40",
          "text-amber-700 dark:text-amber-300",
        ],
        destructive: [
          "bg-rose-500/15 dark:bg-rose-500/25",
          "border-rose-400/30 dark:border-rose-400/40",
          "text-rose-700 dark:text-rose-300",
        ],
        info: [
          "bg-cyan-500/15 dark:bg-cyan-500/25",
          "border-cyan-400/30 dark:border-cyan-400/40",
          "text-cyan-700 dark:text-cyan-300",
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

// Glass Panel Component - macOS Sequoia Style
interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "strong"
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-white/85 dark:bg-slate-900/85 border-slate-200/60 dark:border-slate-800/60",
      subtle: "bg-white/70 dark:bg-slate-900/70 border-slate-200/50 dark:border-slate-800/50",
      strong: "bg-white/95 dark:bg-slate-900/95 border-slate-200/70 dark:border-slate-800/70",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-5 font-sf-pro",
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
      "flex h-11 w-full rounded-lg px-4 py-2 font-sf-pro text-ios-body",
      "bg-white/80 dark:bg-slate-900/80",
      "backdrop-blur-2xl backdrop-saturate-150",
      "border border-slate-200/50 dark:border-slate-700/50",
      "text-foreground placeholder:text-muted-foreground/70",
      "shadow-ios-sm",
      "transition-all duration-200 ease-ios",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
      "focus-visible:border-sky-400/60",
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
