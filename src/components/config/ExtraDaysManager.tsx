import { CalendarPlus, CalendarRange, CalendarX2 } from "lucide-react"
import { GlassButton } from "@/components/ui/glass"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/ui/date-picker"
import { formatDisplayDate } from "./utils"

interface ExtraDaysManagerProps {
  extraOffdays: string[]
  extraWorkdays: string[]
  newOffday: Date | undefined
  newWorkday: Date | undefined
  onOffdayChange: (date: Date | undefined) => void
  onWorkdayChange: (date: Date | undefined) => void
  onAddOffday: () => void
  onAddWorkday: () => void
  onRemoveOffday: (day: string) => void
  onRemoveWorkday: (day: string) => void
}

export function ExtraDaysManager({
  extraOffdays,
  extraWorkdays,
  newOffday,
  newWorkday,
  onOffdayChange,
  onWorkdayChange,
  onAddOffday,
  onAddWorkday,
  onRemoveOffday,
  onRemoveWorkday,
}: ExtraDaysManagerProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarX2 className="h-4 w-4 text-rose-500" /> extra_offdays
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <DatePicker value={newOffday} onChange={onOffdayChange} />
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={onAddOffday}
            className="gap-2"
            type="button"
          >
            <CalendarRange className="h-4 w-4" /> Thêm ngày nghỉ
          </GlassButton>
        </div>
        <div className="flex flex-wrap gap-2">
          {extraOffdays.length === 0 ? (
            <span className="text-sm text-muted-foreground">
              Chưa có ngày nghỉ bổ sung.
            </span>
          ) : (
            extraOffdays.map((day) => (
              <Badge key={day} variant="outline" className="gap-2">
                {formatDisplayDate(day)}
                <button
                  type="button"
                  onClick={() => onRemoveOffday(day)}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                >
                  ×
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarPlus className="h-4 w-4 text-emerald-500" /> extra_workdays
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <DatePicker value={newWorkday} onChange={onWorkdayChange} />
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={onAddWorkday}
            className="gap-2"
            type="button"
          >
            <CalendarRange className="h-4 w-4" /> Thêm ngày làm bù
          </GlassButton>
        </div>
        <div className="flex flex-wrap gap-2">
          {extraWorkdays.length === 0 ? (
            <span className="text-sm text-muted-foreground">Chưa có ngày làm bù.</span>
          ) : (
            extraWorkdays.map((day) => (
              <Badge key={day} variant="outline" className="gap-2">
                {formatDisplayDate(day)}
                <button
                  type="button"
                  onClick={() => onRemoveWorkday(day)}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                >
                  ×
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
