import { useCallback, useEffect, useMemo, useState } from "react"

import { useDepartment } from "@/contexts/DepartmentContext"

import type { Department, RoleFilter, Staff, StaffFormData } from "./types"

const DEFAULT_FORM_DATA: StaffFormData = {
  full_name: "",
  role: "GDV",
  can_night: true,
  base_quota: 26,
  notes: "",
  department_id: undefined,
}

export function useStaffManagement() {
  const { selectedDepartmentId } = useDepartment()
  const [staff, setStaff] = useState<Staff[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<RoleFilter>("all")
  const [formData, setFormData] = useState<StaffFormData>({ ...DEFAULT_FORM_DATA })

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true)
      const url = selectedDepartmentId
        ? `http://localhost:8000/api/staff?department_id=${selectedDepartmentId}`
        : "http://localhost:8000/api/staff"

      const res = await fetch(url)
      const data = await res.json()
      setStaff(data)
    } catch (error) {
      console.error("Failed to fetch staff:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedDepartmentId])

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/api/departments")
      const data = await res.json()
      setDepartments(data.filter((department: Department) => department.is_active))
    } catch (error) {
      console.error("Failed to fetch departments:", error)
    }
  }, [])

  useEffect(() => {
    fetchStaff()
    fetchDepartments()
  }, [fetchStaff, fetchDepartments])

  const openCreateDialog = useCallback(() => {
    setEditingStaff(null)
    setFormData({
      ...DEFAULT_FORM_DATA,
      department_id: selectedDepartmentId ?? undefined,
    })
    setDialogOpen(true)
  }, [selectedDepartmentId])

  const openEditDialog = useCallback((staffMember: Staff) => {
    setEditingStaff(staffMember)
    setFormData({
      full_name: staffMember.full_name,
      role: staffMember.role,
      can_night: staffMember.can_night,
      base_quota: staffMember.base_quota,
      notes: staffMember.notes || "",
      department_id: staffMember.department_id,
    })
    setDialogOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setDialogOpen(false)
    setEditingStaff(null)
  }, [])

  const saveStaff = useCallback(async () => {
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
        setDialogOpen(false)
      } else {
        const error = await res.json()
        alert(error.error || "Failed to save staff member")
      }
    } catch (error) {
      console.error("Failed to save staff:", error)
      alert("Failed to save staff member")
    }
  }, [editingStaff, fetchStaff, formData])

  const deleteStaff = useCallback(
    async (staffMember: Staff) => {
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
      } catch (error) {
        console.error("Failed to delete staff:", error)
        alert("Failed to delete staff member")
      }
    },
    [fetchStaff]
  )

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch = member.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = filterRole === "all" || member.role === filterRole
      return matchesSearch && matchesRole
    })
  }, [staff, searchQuery, filterRole])

  const stats = useMemo(() => {
    const totalStaff = staff.length
    const canNightCount = staff.filter((member) => member.can_night).length
    const averageQuota = totalStaff > 0
      ? Number((staff.reduce((sum, member) => sum + member.base_quota, 0) / totalStaff).toFixed(1))
      : 0

    return {
      totalStaff,
      canNightCount,
      averageQuota,
    }
  }, [staff])

  return {
    departments,
    dialogOpen,
    editingStaff,
    filterRole,
    filteredStaff,
    formData,
    loading,
    isDepartmentScoped: Boolean(selectedDepartmentId),
    searchQuery,
    setFilterRole,
    setFormData,
    setSearchQuery,
    staff,
    stats,
    closeDialog,
    openCreateDialog,
    openEditDialog,
    saveStaff,
    deleteStaff,
  }
}
