import { Calendar } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

import { DAYS_OF_WEEK } from "../constants"
import type { PreferencesFormState } from "../types"

interface DayOffPreferencesSectionProps {
  preferences: PreferencesFormState
  onToggle: (dayOfWeek: number) => void
  staffName?: string | null
}

export function DayOffPreferencesSection({ preferences, onToggle, staffName }: DayOffPreferencesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferred Days Off</CardTitle>
        <CardDescription>
          Select preferred days off for {staffName ?? "the staff member"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {DAYS_OF_WEEK.map((day) => {
          const isPreferred = preferences.preferred_days_off.includes(day.value)
          return (
            <div key={day.value} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{day.label}</p>
                </div>
              </div>
              <Switch checked={isPreferred} onCheckedChange={() => onToggle(day.value)} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
