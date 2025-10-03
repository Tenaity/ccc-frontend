import React, { useState, useEffect } from "react"
import { Plus, Users, Building2, UserCheck, UserX, Edit2, Trash2, Search } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Department {
  id: number
  name: string
  code: string
  color: string
}

interface Staff {
  id: number
  full_name: string
  role: string
  can_night: boolean
  base_quota: number
  notes?: string
  department_id?: number
  department_name?: string
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [filterRole, setFilterRole] = useState<string>("all")

  const [formData, setFormData] = useState({
    full_name: "",
    role: "GDV",
    can_night: true,
    base_quota: 26.0,
    notes: "",
    department_id: undefined as number | undefined,
  })

  useEffect(() => {
    Promise.all([fetchStaff(), fetchDepartments()])
  }, [])

  const fetchStaff = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/staff")
      const data = await res.json()
      setStaff(data)
    } catch (err) {
      console.error("Failed to fetch staff:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/departments")
      const data = await res.json()
      setDepartments(data.filter((d: Department) => d.is_active))
    } catch (err) {
      console.error("Failed to fetch departments:", err)
    }
  }

  const handleCreate = () => {
    setEditingStaff(null)
    setFormData({
      full_name: "",
      role: "GDV",
      can_night: true,
      base_quota: 26.0,
      notes: "",
      department_id: undefined,
    })
    setShowDialog(true)
  }

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember)
    setFormData({
      full_name: staffMember.full_name,
      role: staffMember.role,
      can_night: staffMember.can_night,
      base_quota: staffMember.base_quota,
      notes: staffMember.notes || "",
      department_id: staffMember.department_id,
    })
    setShowDialog(true)
  }

  const handleSave = async () => {
    try {
      const url = editingStaff
        ? `http://localhost:8000/api/staff/${editingStaff.id}`
        : "http://localhost:8000/api/staff"

      const method = editingStaff ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await fetchStaff()
        setShowDialog(false)
      } else {
        const error = await res.json()
        alert(error.error || "Failed to save staff member")
      }
    } catch (err) {
      console.error("Failed to save staff:", err)
      alert("Failed to save staff member")
    }
  }

  const handleDelete = async (staffMember: Staff) => {
    if (!confirm(`Are you sure you want to delete "${staffMember.full_name}"?`)) {
      return
    }

    try {
      const res = await fetch(`http://localhost:8000/api/staff/${staffMember.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        await fetchStaff()
      } else {
        const error = await res.json()
        alert(error.error || "Failed to delete staff member")
      }
    } catch (err) {
      console.error("Failed to delete staff:", err)
      alert("Failed to delete staff member")
    }
  }

  // Filtered staff
  const filteredStaff = staff.filter((s) => {
    const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDept = filterDepartment === "all" ||
      (filterDepartment === "unassigned" ? !s.department_id : s.department_id === parseInt(filterDepartment))
    const matchesRole = filterRole === "all" || s.role === filterRole

    return matchesSearch && matchesDept && matchesRole
  })

  const totalStaff = staff.length
  const canNightCount = staff.filter((s) => s.can_night).length
  const averageQuota = staff.length > 0
    ? (staff.reduce((sum, s) => sum + s.base_quota, 0) / staff.length).toFixed(1)
    : "0"

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        tagline="Human Resources"
        title="Staff Management"
        description="Manage staff members, their roles, quotas, and department assignments"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassPanel variant="strong" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Staff
              </p>
              <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                {totalStaff}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30">
              <Users className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Can Work Night Shift
              </p>
              <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {canNightCount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
              <UserCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Quota
              </p>
              <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {averageQuota}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
              <Building2 className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Filters & Search */}
      <GlassPanel variant="strong" className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="GDV">GDV</SelectItem>
              <SelectItem value="TC">TC</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </GlassPanel>

      {/* Staff Table */}
      <GlassPanel variant="strong" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Night Shift
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Base Quota
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredStaff.map((staffMember) => (
                <tr
                  key={staffMember.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900 dark:text-slate-100">
                    #{staffMember.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {staffMember.full_name}
                    </div>
                    {staffMember.notes && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                        {staffMember.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold",
                        staffMember.role === "GDV"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      )}
                    >
                      {staffMember.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                    {staffMember.department_name || (
                      <span className="text-slate-400 dark:text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staffMember.can_night ? (
                      <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <UserX className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900 dark:text-slate-100">
                    {staffMember.base_quota}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(staffMember)}
                        className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4 text-sky-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(staffMember)}
                        className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      {searchQuery || filterDepartment !== "all" || filterRole !== "all"
                        ? "No staff found matching your filters"
                        : "No staff members yet. Click 'Add Staff' to create your first entry."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
            </DialogTitle>
            <DialogDescription>
              {editingStaff
                ? "Update staff member information"
                : "Add a new staff member to the organization"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="Nguyen Van A"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
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
                    setFormData({
                      ...formData,
                      department_id: value === "none" ? undefined : parseInt(value),
                    })
                  }
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      base_quota: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="can_night">Night Shift Capable</Label>
                <Select
                  value={formData.can_night.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, can_night: value === "true" })
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
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional information about this staff member"
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
              {editingStaff ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
