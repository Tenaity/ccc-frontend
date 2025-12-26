import React, { Suspense } from "react"
import { AppleSidebar } from "@/components/AppleSidebar"
import { cn } from "@/lib/utils"
import { AppRoutes } from "./routes"
import { Toaster } from "@/components/ui/toaster"

const MAIN_CONTENT_ID = "app-main-content"

export default function App() {
  const handleSkipToContent = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      if (typeof document === "undefined") {
        return
      }

      const main = document.getElementById(MAIN_CONTENT_ID)
      if (!(main instanceof HTMLElement)) {
        return
      }

      if (typeof main.focus === "function") {
        main.focus({ preventScroll: true })
      }
      if (typeof main.scrollIntoView === "function") {
        main.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      if (typeof window !== "undefined" && MAIN_CONTENT_ID) {
        window.location.hash = `#${MAIN_CONTENT_ID}`
      }
    },
    []
  )

  return (
    <div className="flex h-screen overflow-hidden">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        href={`#${MAIN_CONTENT_ID}`}
        onClick={handleSkipToContent}
      >
        Bỏ qua tới nội dung chính
      </a>
      <AppleSidebar />
      <main
        className={cn(
          "relative flex min-h-screen flex-1 flex-col overflow-y-auto",
          "bg-gradient-to-br from-sky-100/70 via-white/80 to-pink-100/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.2),transparent_50%),linear-gradient(180deg,rgba(255,255,255,0.85)0%,rgba(255,255,255,0.6)45%,rgba(255,255,255,0.78)100%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.18),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(190,24,93,0.22),transparent_55%),linear-gradient(180deg,rgba(3,7,18,0.92)0%,rgba(3,7,18,0.7)45%,rgba(3,7,18,0.82)100%)]" aria-hidden="true" />
        <div className="relative z-10 flex-1">
          <AppRoutes />
        </div>
      </main>
      <Toaster />
    </div>
  )
}
