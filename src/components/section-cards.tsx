import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { GlassCard, GlassBadge } from "@/components/ui/glass"

export function SectionCards() {
  return (
    <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-6">
      <GlassCard variant="strong" className="@container/card p-6">
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <h3 className="@[250px]/card:text-3xl text-2xl font-bold tabular-nums text-foreground">
              $1,250.00
            </h3>
          </div>
          <div className="absolute right-0 top-0">
            <GlassBadge variant="success" className="flex gap-1">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </GlassBadge>
          </div>
          <div className="flex flex-col gap-1 border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUpIcon className="size-4 text-emerald-500" />
              <span>Trending up this month</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Visitors for the last 6 months
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard variant="strong" className="@container/card p-6">
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">New Customers</p>
            <h3 className="@[250px]/card:text-3xl text-2xl font-bold tabular-nums text-foreground">
              1,234
            </h3>
          </div>
          <div className="absolute right-0 top-0">
            <GlassBadge variant="destructive" className="flex gap-1">
              <TrendingDownIcon className="size-3" />
              -20%
            </GlassBadge>
          </div>
          <div className="flex flex-col gap-1 border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingDownIcon className="size-4 text-rose-500" />
              <span>Down 20% this period</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Acquisition needs attention
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard variant="strong" className="@container/card p-6">
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Active Accounts</p>
            <h3 className="@[250px]/card:text-3xl text-2xl font-bold tabular-nums text-foreground">
              45,678
            </h3>
          </div>
          <div className="absolute right-0 top-0">
            <GlassBadge variant="success" className="flex gap-1">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </GlassBadge>
          </div>
          <div className="flex flex-col gap-1 border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUpIcon className="size-4 text-emerald-500" />
              <span>Strong user retention</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Engagement exceed targets
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard variant="strong" className="@container/card p-6">
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
            <h3 className="@[250px]/card:text-3xl text-2xl font-bold tabular-nums text-foreground">
              4.5%
            </h3>
          </div>
          <div className="absolute right-0 top-0">
            <GlassBadge variant="success" className="flex gap-1">
              <TrendingUpIcon className="size-3" />
              +4.5%
            </GlassBadge>
          </div>
          <div className="flex flex-col gap-1 border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUpIcon className="size-4 text-emerald-500" />
              <span>Steady performance</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Meets growth projections
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
