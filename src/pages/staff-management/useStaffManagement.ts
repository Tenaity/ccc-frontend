import { useCallback, useEffect, useMemo, useState } from "react"

import { useDepartment } from "@/contexts/DepartmentContext"
import * as staffV2Api from "@/lib/api-v2"

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
      const data = await staffV2Api.listStaff(
        selectedDepartmentId ? { department_id: selectedDepartmentId } : {}
      )
      setStaff(data as Staff[])
    } catch (error) {
      console.error("Failed to fetch staff:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedDepartmentId])

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await staffV2Api.listDepartments(true)
      setDepartments(data as Department[])
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
      if (editingStaff) {
        await staffV2Api.updateStaff(editingStaff.id, formData)
      } else {
        await staffV2Api.createStaff(formData as Parameters<typeof staffV2Api.createStaff>[0])
      }
      await fetchStaff()
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to save staff:", error)
      alert((error as Error).message || "Failed to save staff member")
    }
  }, [editingStaff, fetchStaff, formData])

  const deleteStaffMember = useCallback(
    async (staffMember: Staff) => {
      if (!confirm(`Are you sure you want to delete "${staffMember.full_name}"?`)) {
        return
      }

      try {
        await staffV2Api.deleteStaff(staffMember.id)
        await fetchStaff()
      } catch (error) {
        console.error("Failed to delete staff:", error)
        alert((error as Error).message || "Failed to delete staff member")
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
    deleteStaff: deleteStaffMember,
  }
}
