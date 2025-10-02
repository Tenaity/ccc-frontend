import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PageHeaderProps {
  icon?: LucideIcon
  tagline: string
  title: string
  description: string
}

export function PageHeader({ icon: Icon, tagline, title, description }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/60 bg-white/95 p-6 shadow-glass",
        "backdrop-blur-3xl backdrop-saturate-150",
        "dark:border-slate-800/60 dark:bg-slate-900/95 dark:shadow-glass-lg",
        "transition-all duration-300 ease-ios"
      )}
    >
      <div className="flex flex-wrap items-center gap-4">
        {Icon ? (
          <span
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
              "bg-gradient-to-br from-sky-500 via-indigo-500 to-pink-500",
              "shadow-[0_18px_36px_rgba(99,102,241,0.28)]"
            )}
          >
            <Icon className="h-7 w-7 text-white" aria-hidden="true" />
          </span>
        ) : null}
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500/80 dark:text-indigo-300/70">
            {tagline}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground/90 md:text-base">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
