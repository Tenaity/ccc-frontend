import * as React from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { ToastStateProvider } from "@/components/ui/use-toast"
import { ThemeProvider } from "@/components/ui/theme-provider"

export function UiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="customer-care-theme">
      <TooltipProvider delayDuration={200}>
        <ToastStateProvider>
          {children}
          <Toaster closeButton richColors position="top-right" />
        </ToastStateProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
