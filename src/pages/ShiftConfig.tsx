import React, { useState, useEffect } from "react"
import {
  Plus,
  Sun,
  Moon,
  Coffee,
  Clock,
  Edit2,
  Trash2,
  Calendar,
  Settings2,
} from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { GlassPanel } from "@/components/ui/glass"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as Icons from "lucide-react"

interface Department {
  id: number
  name: string
  code: string
  color: string
  is_active?: boolean
}

interface ShiftConfig {
  id: number
  department_id: number
  department_name: string
  name: string
  code: string
  start_time: string
  end_time: string
  color: string
  icon: string
  is_active: boolean
  display_order: number
}

const SHIFT_ICON_OPTIONS = [
  "Sun",
  "Moon",
  "Coffee",
  "Clock",
  "Calendar",
  "Star",
  "Briefcase",
  "Headphones",
]

const PASTEL_COLOR_PALETTE = [
  "#60a5fa", // blue
  "#34d399", // emerald
  "#a78bfa", // violet
  "#fbbf24", // amber
  "#f472b6", // pink
  "#22d3ee", // cyan
  "#fb923c", // orange
  "#2dd4bf", // teal
  "#c084fc", // purple
  "#fb7185", // rose
]

export default function ShiftConfig() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [shifts, setShifts] = useState<ShiftConfig[]>([])
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingShift, setEditingShift] = useState<ShiftConfig | null>(null)
  const [formData, setFormData] = useState({
    department_id: 0,
    name: "",
    code: "",
    start_time: "08:00",
    end_time: "17:00",
    color: "#60a5fa",
    icon: "Sun",
    display_order: 0,
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    if (departments.length > 0 && !selectedDeptId) {
      setSelectedDeptId(departments[0].id)
    }
  }, [departments])

  useEffect(() => {
    if (selectedDeptId) {
      fetchShifts(selectedDeptId)
    }
  }, [selectedDeptId])

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/departments")
      const data = await res.json()
      setDepartments(data.filter((d: Department) => d.is_active))
    } catch (err) {
      console.error("Failed to fetch departments:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchShifts = async (deptId: number) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/shift-configs?department_id=${deptId}`
      )
      const data = await res.json()
      setShifts(data)
    } catch (err) {
      console.error("Failed to fetch shifts:", err)
    }
  }

  const handleCreate = () => {
    if (!selectedDeptId) return

    setEditingShift(null)
    setFormData({
      department_id: selectedDeptId,
      name: "",
      code: "",
      start_time: "08:00",
      end_time: "17:00",
      color: "#60a5fa",
      icon: "Sun",
      display_order: shifts.length,
    })
    setShowDialog(true)
  }

  const handleEdit = (shift: ShiftConfig) => {
    setEditingShift(shift)
    setFormData({
      department_id: shift.department_id,
      name: shift.name,
      code: shift.code,
      start_time: shift.start_time,
      end_time: shift.end_time,
      color: shift.color,
      icon: shift.icon,
      display_order: shift.display_order,
    })
    setShowDialog(true)
  }

  const handleSave = async () => {
    try {
      const url = editingShift
        ? `http://localhost:8000/api/shift-configs/${editingShift.id}`
        : "http://localhost:8000/api/shift-configs"

      const method = editingShift ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        if (selectedDeptId) {
          await fetchShifts(selectedDeptId)
        }
        setShowDialog(false)
      } else {
        const error = await res.json()
        alert(error.error || "Failed to save shift configuration")
      }
    } catch (err) {
      console.error("Failed to save shift:", err)
      alert("Failed to save shift configuration")
    }
  }

  const handleDelete = async (shift: ShiftConfig) => {
    if (
      !confirm(
        `Are you sure you want to delete "${shift.name}" (${shift.code})?`
      )
    ) {
      return
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/shift-configs/${shift.id}`,
        {
          method: "DELETE",
        }
      )

      if (res.ok) {
        if (selectedDeptId) {
          await fetchShifts(selectedDeptId)
        }
      } else {
        const error = await res.json()
        alert(error.error || "Failed to delete shift configuration")
      }
    } catch (err) {
      console.error("Failed to delete shift:", err)
      alert("Failed to delete shift configuration")
    }
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Sun
    return <IconComponent className="h-5 w-5" />
  }

  const selectedDept = departments.find((d) => d.id === selectedDeptId)

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Settings2}
        tagline="Shift Management"
        title="Shift Configuration"
        description="Configure custom shifts with time ranges, colors, and icons for each department"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassPanel variant="strong" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Shifts
              </p>
              <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                {shifts.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30">
              <Clock className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Department
              </p>
              <p className="text-xl font-bold mt-1 text-foreground truncate">
                {selectedDept?.name || "None"}
              </p>
            </div>
            <div
              className="p-3 rounded-xl"
              style={{
                background: selectedDept
                  ? `linear-gradient(135deg, ${selectedDept.color}40, ${selectedDept.color}60)`
                  : "rgba(100, 116, 139, 0.1)",
              }}
            >
              <Calendar
                className="h-6 w-6"
                style={{ color: selectedDept?.color || "#64748b" }}
              />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Departments
              </p>
              <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {departments.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
              <Sun className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Department Selector */}
      <GlassPanel variant="strong" className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Label className="text-sm font-medium">Select Department:</Label>
            <Select
              value={selectedDeptId?.toString()}
              onValueChange={(val) => setSelectedDeptId(parseInt(val))}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Choose a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      {dept.name} ({dept.code})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleCreate}
            disabled={!selectedDeptId}
            className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </GlassPanel>

      {/* Shift Cards Grid */}
      {selectedDeptId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shifts.map((shift) => (
            <GlassPanel
              key={shift.id}
              variant="strong"
              className="p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${shift.color}40, ${shift.color}60)`,
                  }}
                >
                  <div style={{ color: shift.color }}>
                    {getIconComponent(shift.icon)}
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEdit(shift)}
                    className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors"
                  >
                    <Edit2 className="h-4 w-4 text-sky-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(shift)}
                    className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-rose-600" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-1">{shift.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Code:{" "}
                <span
                  className="font-mono font-bold px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${shift.color}20`,
                    color: shift.color,
                  }}
                >
                  {shift.code}
                </span>
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground">Start Time</p>
                  <p className="text-lg font-bold text-foreground font-mono">
                    {shift.start_time}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">End Time</p>
                  <p className="text-lg font-bold text-foreground font-mono">
                    {shift.end_time}
                  </p>
                </div>
              </div>
            </GlassPanel>
          ))}

          {shifts.length === 0 && (
            <div className="col-span-full">
              <GlassPanel variant="strong" className="p-12 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  No shifts configured for this department yet.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click "Add Shift" to create your first shift configuration.
                </p>
              </GlassPanel>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingShift ? "Edit Shift" : "Create Shift"}
            </DialogTitle>
            <DialogDescription>
              {editingShift
                ? "Update shift configuration"
                : "Add a new shift to this department"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Shift Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Morning Shift"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code">Shift Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="CS"
                maxLength={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {SHIFT_ICON_OPTIONS.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => setFormData({ ...formData, icon: iconName })}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.icon === iconName
                        ? "border-sky-500 bg-sky-50 dark:bg-sky-950/20"
                        : "border-border hover:border-sky-300"
                    }`}
                  >
                    {getIconComponent(iconName)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {PASTEL_COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white"
            >
              {editingShift ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
