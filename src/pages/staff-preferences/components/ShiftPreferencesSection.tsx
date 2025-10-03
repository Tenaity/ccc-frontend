import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

import { SHIFT_OPTIONS } from "../constants"
import type { PreferencesFormState } from "../types"
import { resolveShiftIcon } from "../utils"

interface ShiftPreferencesSectionProps {
  preferences: PreferencesFormState
  onToggle: (shiftCode: string, enabled: boolean) => void
  staffName?: string | null
}

export function ShiftPreferencesSection({ preferences, onToggle, staffName }: ShiftPreferencesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferred Shifts</CardTitle>
        <CardDescription>
          Select shift types that {staffName ?? "the staff member"} prefers to work
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {SHIFT_OPTIONS.map((option) => {
          const Icon = resolveShiftIcon(option.icon)
          const enabled = preferences.preferred_shifts.includes(option.code)
          return (
            <div key={option.code} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${option.iconClassName}`} />
                <div>
                  <p className="font-medium">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
              <Switch checked={enabled} onCheckedChange={(checked) => onToggle(option.code, checked)} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
