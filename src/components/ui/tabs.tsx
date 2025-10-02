"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center gap-1 rounded-ios p-1 font-sf-pro",
      "bg-slate-100/90 dark:bg-slate-800/90",
      "backdrop-blur-xl backdrop-saturate-150",
      "border border-slate-200/60 dark:border-slate-700/60",
      "shadow-ios-sm",
      "text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-ios-sm px-3 py-1.5 text-ios-callout font-medium",
      "transition-all duration-200 ease-ios",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:ring-offset-1",
      "disabled:pointer-events-none disabled:opacity-40",
      "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900",
      "data-[state=active]:text-foreground",
      "data-[state=active]:shadow-ios-sm",
      "data-[state=inactive]:hover:text-foreground/80",
      "active:scale-95",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 font-sf-pro",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
