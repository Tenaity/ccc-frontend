import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { PreferencesFormState } from "../types"

interface ConstraintsSectionProps {
  preferences: PreferencesFormState
  onChangeMaxDays: (days: number) => void
  staffName?: string | null
}

const MAX_DAYS_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10]

export function ConstraintsSection({ preferences, onChangeMaxDays, staffName }: ConstraintsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduling Constraints</CardTitle>
        <CardDescription>
          Set work-life balance constraints for {staffName ?? "the staff member"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Maximum Consecutive Working Days</Label>
          <Select
            value={preferences.max_consecutive_days?.toString() || "6"}
            onValueChange={(value) => onChangeMaxDays(Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MAX_DAYS_OPTIONS.map((days) => (
                <SelectItem key={days} value={days.toString()}>
                  {days} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Maximum number of days staff can work before needing rest
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
