import type { Dispatch, SetStateAction } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import type { Department, StaffFormData } from "../types"

interface StaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  formData: StaffFormData
  setFormData: Dispatch<SetStateAction<StaffFormData>>
  onSubmit: () => Promise<void>
  departments: Department[]
}

export function StaffDialog({
  open,
  onOpenChange,
  mode,
  formData,
  setFormData,
  onSubmit,
  departments,
}: StaffDialogProps) {
  const title = mode === "edit" ? "Edit Staff Member" : "Add Staff Member"
  const description =
    mode === "edit" ? "Update staff member information" : "Add a new staff member to the organization"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(event) => setFormData((prev) => ({ ...prev, full_name: event.target.value }))}
              placeholder="Nguyen Van A"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GDV">GDV</SelectItem>
                  <SelectItem value="TC">TC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department_id?.toString() || "none"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    department_id: value === "none" ? undefined : parseInt(value, 10),
                  }))
                }
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id.toString()}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="base_quota">Base Quota</Label>
              <Input
                id="base_quota"
                type="number"
                step="0.5"
                value={formData.base_quota}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    base_quota: parseFloat(event.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="can_night">Night Shift Capable</Label>
              <Select
                value={formData.can_night.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, can_night: value === "true" }))
                }
              >
                <SelectTrigger id="can_night">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Additional information about this staff member"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white">
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
