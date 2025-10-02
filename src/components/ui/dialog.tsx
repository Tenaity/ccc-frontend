import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      "ios-overlay",
      "data-[state=open]:animate-fade-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0",
      "transition-all duration-300 ease-ios-out",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid -translate-x-1/2 -translate-y-1/2 gap-5",
        "w-[min(96vw,720px)] sm:max-w-[720px]",
        "rounded-ios-xl p-6 font-sf-pro",
        // iOS-inspired glass effect
        "bg-white/95 dark:bg-slate-900/95",
        "backdrop-blur-3xl backdrop-saturate-150",
        "border border-slate-200/60 dark:border-slate-800/60",
        "shadow-glass-lg",
        // iOS-style animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
        "data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4",
        "transition-all duration-300 ease-ios-in-out",
        // Focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Close
        className={cn(
          "absolute right-4 top-4 z-10",
          "inline-flex h-9 w-9 items-center justify-center",
          "rounded-full",
          // iOS-style close button
          "bg-white/70 dark:bg-slate-800/70",
          "backdrop-blur-2xl backdrop-saturate-150",
          "border border-slate-200/50 dark:border-slate-700/50",
          "text-muted-foreground hover:text-foreground",
          "transition-all duration-200 ease-ios",
          "hover:bg-white/90 dark:hover:bg-slate-800/90",
          "active:scale-95",
          "shadow-ios-sm hover:shadow-ios",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue"
        )}
      >
        <X aria-hidden className="h-4 w-4" />
        <span className="sr-only">Close dialog</span>
      </DialogPrimitive.Close>
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-sf-pro text-ios-title-3 font-semibold leading-tight tracking-tight text-foreground", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("font-sf-pro text-ios-body text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
