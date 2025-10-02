"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 font-sf-pro text-ios-subhead font-medium leading-tight select-none text-foreground",
        "transition-all duration-200 ease-ios",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-40",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

export { Label }
