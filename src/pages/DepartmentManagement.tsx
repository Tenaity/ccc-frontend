import React, { useState, useEffect } from "react"
import { Plus, Building2, Users, Settings2, Edit2, Trash2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import * as Icons from "lucide-react"

interface Department {
  id: number
  name: string
  code: string
  color: string
  icon: string
  description?: string
  is_active: boolean
  settings: {
    working_hours: { start: string; end: string }
    weekend_policy: string
    max_hours_per_month: number
    min_staff_per_shift: number
  }
  staff_count: number
  shift_count: number
}

const ICON_OPTIONS = [
  "Building2",
  "Users",
  "Headphones",
  "Briefcase",
  "Monitor",
  "Heart",
  "ShoppingCart",
  "Truck",
]

const COLOR_PALETTE = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#14b8a6", // teal
]

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    color: "#3b82f6",
    icon: "Building2",
    description: "",
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/departments")
      const data = await res.json()
      setDepartments(data)
    } catch (err) {
      console.error("Failed to fetch departments:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingDept(null)
    setFormData({
      name: "",
      code: "",
      color: "#3b82f6",
      icon: "Building2",
      description: "",
    })
    setShowDialog(true)
  }

  const handleEdit = (dept: Department) => {
    setEditingDept(dept)
    setFormData({
      name: dept.name,
      code: dept.code,
      color: dept.color,
      icon: dept.icon,
      description: dept.description || "",
    })
    setShowDialog(true)
  }

  const handleSave = async () => {
    try {
      const url = editingDept
        ? `http://localhost:8000/api/departments/${editingDept.id}`
        : "http://localhost:8000/api/departments"

      const method = editingDept ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await fetchDepartments()
        setShowDialog(false)
      } else {
        const error = await res.json()
        alert(error.error || "Failed to save department")
      }
    } catch (err) {
      console.error("Failed to save department:", err)
      alert("Failed to save department")
    }
  }

  const handleDelete = async (dept: Department) => {
    if (dept.staff_count > 0) {
      alert(
        `Cannot delete department with ${dept.staff_count} staff members. Please reassign or remove staff first.`
      )
      return
    }

    if (!confirm(`Are you sure you want to delete "${dept.name}"?`)) {
      return
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/departments/${dept.id}`,
        {
          method: "DELETE",
        }
      )

      if (res.ok) {
        await fetchDepartments()
      } else {
        const error = await res.json()
        alert(error.error || "Failed to delete department")
      }
    } catch (err) {
      console.error("Failed to delete department:", err)
      alert("Failed to delete department")
    }
  }

  const totalStaff = departments.reduce((sum, d) => sum + d.staff_count, 0)
  const totalShifts = departments.reduce((sum, d) => sum + d.shift_count, 0)

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Building2
    return <IconComponent className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        tagline="Organization Structure"
        title="Department Management"
        description="Manage departments, shifts, and staff across your organization"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassPanel variant="strong" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Departments
              </p>
              <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                {departments.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30">
              <Building2 className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Staff
              </p>
              <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {totalStaff}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
              <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Custom Shifts
              </p>
              <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {totalShifts}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
              <Settings2 className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
          Departments
        </h2>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <GlassPanel
            key={dept.id}
            variant="strong"
            className="p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${dept.color}20, ${dept.color}40)`,
                }}
              >
                <div style={{ color: dept.color }}>
                  {getIconComponent(dept.icon)}
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleEdit(dept)}
                  className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors"
                >
                  <Edit2 className="h-4 w-4 text-sky-600" />
                </button>
                <button
                  onClick={() => handleDelete(dept)}
                  className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-rose-600" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-1">{dept.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Code: <span className="font-mono font-semibold">{dept.code}</span>
            </p>

            {dept.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {dept.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">Staff</p>
                <p className="text-lg font-bold text-foreground">
                  {dept.staff_count}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shifts</p>
                <p className="text-lg font-bold text-foreground">
                  {dept.shift_count}
                </p>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDept ? "Edit Department" : "Create Department"}
            </DialogTitle>
            <DialogDescription>
              {editingDept
                ? "Update department information"
                : "Add a new department to your organization"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Customer Care"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code">Department Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="CC"
                maxLength={10}
              />
            </div>

            <div className="grid gap-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {ICON_OPTIONS.map((iconName) => (
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
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PALETTE.map((color) => (
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

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of this department..."
                rows={3}
              />
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
              {editingDept ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
