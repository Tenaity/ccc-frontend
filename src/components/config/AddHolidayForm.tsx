import { CalendarPlus, CalendarRange } from "lucide-react"
import { GlassButton } from "@/components/ui/glass"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"

interface AddHolidayFormProps {
  newDate: Date | undefined
  newName: string
  adding: boolean
  onDateChange: (date: Date | undefined) => void
  onNameChange: (name: string) => void
  onAdd: () => void
}

export function AddHolidayForm({
  newDate,
  newName,
  adding,
  onDateChange,
  onNameChange,
  onAdd,
}: AddHolidayFormProps) {
  return (
    <div className="grid gap-4 rounded-xl border border-dashed border-slate-200/80 bg-white/60 p-4 dark:border-slate-800/60 dark:bg-slate-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <CalendarPlus className="h-5 w-5 text-sky-500" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Thêm thủ công các ngày nghỉ đặc biệt trong năm.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-xs uppercase text-muted-foreground">Ngày nghỉ</Label>
          <DatePicker value={newDate} onChange={onDateChange} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="holiday-name" className="text-xs uppercase text-muted-foreground">
            Ghi chú
          </Label>
          <Input
            id="holiday-name"
            value={newName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Tên ngày nghỉ"
            className="w-[240px]"
          />
        </div>
        <GlassButton
          variant="secondary"
          onClick={onAdd}
          disabled={adding}
          className="gap-2"
        >
          <CalendarRange className="h-4 w-4" />
          {adding ? "Đang thêm…" : "Thêm ngày nghỉ"}
        </GlassButton>
      </div>
    </div>
  )
}
