import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserCog } from "lucide-react"

import type { Staff } from "../types"

interface StaffSelectorProps {
  staff: Staff[]
  selectedStaffId: number | null
  onSelect: (staffId: number) => void
}

export function StaffSelector({ staff, selectedStaffId, onSelect }: StaffSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Select Staff Member</Label>
      <Select value={selectedStaffId?.toString() || ""} onValueChange={(value) => onSelect(Number(value))}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a staff member..." />
        </SelectTrigger>
        <SelectContent>
          {staff.map((member) => (
            <SelectItem key={member.id} value={member.id.toString()}>
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <span>{member.full_name}</span>
                <Badge variant="outline" className="ml-2">
                  {member.role}
                </Badge>
                {member.department_name && (
                  <span className="text-xs text-muted-foreground">({member.department_name})</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
