import { Settings2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ShiftField } from "./types"

interface ShiftDefaultsFormProps {
  shiftFields: ShiftField[]
  shiftDefaults: Record<string, number>
  onChange: (key: string, value: string) => void
}

export function ShiftDefaultsForm({
  shiftFields,
  shiftDefaults,
  onChange,
}: ShiftDefaultsFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Settings2 className="h-4 w-4 text-sky-500" /> Shift defaults
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shiftFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">{field.key}</Label>
            <Input
              type="number"
              inputMode="numeric"
              value={String(shiftDefaults[field.key] ?? 0)}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="w-full"
              data-testid={`shift-default-${field.key}`}
            />
            <p className="text-xs text-muted-foreground">{field.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
