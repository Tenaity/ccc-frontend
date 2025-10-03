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
import { Textarea } from "@/components/ui/textarea"

import type { DepartmentFormData } from "../types"
import { resolveIcon } from "../utils"

interface DepartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  formData: DepartmentFormData
  setFormData: Dispatch<SetStateAction<DepartmentFormData>>
  onSubmit: () => Promise<void>
  iconOptions: readonly string[]
  colorPalette: readonly string[]
}

export function DepartmentDialog({
  open,
  onOpenChange,
  mode,
  formData,
  setFormData,
  onSubmit,
  iconOptions,
  colorPalette,
}: DepartmentDialogProps) {
  const title = mode === "edit" ? "Edit Department" : "Create Department"
  const description =
    mode === "edit" ? "Update department information" : "Add a new department to your organization"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Customer Care"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="code">Department Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))
              }
              placeholder="CC"
              maxLength={10}
            />
          </div>

          <div className="grid gap-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((iconName) => {
                const Icon = resolveIcon(iconName)

                return (
                  <button
                    type="button"
                    key={iconName}
                    onClick={() => setFormData((prev) => ({ ...prev, icon: iconName }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.icon === iconName
                        ? "border-sky-500 bg-sky-50 dark:bg-sky-950/20"
                        : "border-border hover:border-sky-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorPalette.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`h-10 rounded-lg border-2 transition-all duration-200 ${
                    formData.color === color
                      ? "border-foreground scale-110"
                      : "border-border hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Brief description of this department..."
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
import type { Dispatch, SetStateAction } from "react"
