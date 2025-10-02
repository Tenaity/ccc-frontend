import type { WeekendPolicy } from "@/types"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { BASE_WEEKEND_POLICIES } from "./constants"

interface WeekendPolicySelectorProps {
  value: WeekendPolicy
  onChange: (policy: WeekendPolicy) => void
  options?: Array<{ value: WeekendPolicy; label: string }>
}

export function WeekendPolicySelector({
  value,
  onChange,
  options = BASE_WEEKEND_POLICIES,
}: WeekendPolicySelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase text-muted-foreground">Weekend policy</Label>
      <div className="grid gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200/70 bg-white/70 px-4 py-3 transition-all",
              value === option.value
                ? "border-sky-400/60 shadow-ios"
                : "hover:border-slate-300/70",
              "dark:border-slate-800/70 dark:bg-slate-900/70"
            )}
          >
            <input
              type="radio"
              name="weekend-policy"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 accent-sky-500"
            />
            <span className="text-sm font-medium text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
