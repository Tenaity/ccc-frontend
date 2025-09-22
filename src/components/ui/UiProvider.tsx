import * as React from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { ToastStateProvider } from "@/components/ui/use-toast"

export function UiProvider({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={0} disableHoverableContent>
      <ToastStateProvider>
        {children}
        <Toaster />
      </ToastStateProvider>
    </TooltipProvider>
  )
}
