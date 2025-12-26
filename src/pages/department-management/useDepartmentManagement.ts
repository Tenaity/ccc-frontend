import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import { DEFAULT_FORM_DATA } from "./constants"
import * as deptV2Api from "@/lib/api-v2"
import type { Department, DepartmentFormData } from "./types"

interface UseDepartmentManagementResult {
  departments: Department[]
  loading: boolean
  dialogOpen: boolean
  editingDepartment: Department | null
  formData: DepartmentFormData
  setFormData: Dispatch<SetStateAction<DepartmentFormData>>
  openCreateDialog: () => void
  openEditDialog: (department: Department) => void
  closeDialog: () => void
  refreshDepartments: () => Promise<void>
  saveDepartment: () => Promise<void>
  deleteDepartment: (department: Department) => Promise<void>
  stats: {
    totalDepartments: number
    totalStaff: number
    totalShifts: number
  }
}

export function useDepartmentManagement(): UseDepartmentManagementResult {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState<DepartmentFormData>({ ...DEFAULT_FORM_DATA })

  const refreshDepartments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await deptV2Api.listDepartments()
      setDepartments(data as Department[])
    } catch (error) {
      console.error("Failed to fetch departments:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshDepartments()
  }, [refreshDepartments])

  const openCreateDialog = useCallback(() => {
    setEditingDepartment(null)
    setFormData({ ...DEFAULT_FORM_DATA })
    setDialogOpen(true)
  }, [])

  const openEditDialog = useCallback((department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      code: department.code,
      color: department.color,
      icon: department.icon,
      description: department.description || "",
    })
    setDialogOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setDialogOpen(false)
    setEditingDepartment(null)
  }, [])

  const saveDepartment = useCallback(async () => {
    try {
      if (editingDepartment) {
        await deptV2Api.updateDepartment(editingDepartment.id, formData as deptV2Api.UpdateDepartmentInput)
      } else {
        await deptV2Api.createDepartment(formData as deptV2Api.CreateDepartmentInput)
      }
      await refreshDepartments()
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to save department:", error)
      alert((error as Error).message || "Failed to save department")
    }
  }, [editingDepartment, formData, refreshDepartments])

  const deleteDepartmentMember = useCallback(
    async (department: Department) => {
      if (!confirm(`Are you sure you want to delete "${department.name}"?`)) {
        return
      }

      try {
        await deptV2Api.deleteDepartment(department.id)
        await refreshDepartments()
      } catch (error) {
        console.error("Failed to delete department:", error)
        alert((error as Error).message || "Failed to delete department")
      }
    },
    [refreshDepartments]
  )

  const stats = useMemo(() => {
    // V2 API doesn't include staff_count and shift_count in response
    // Calculate from the departments structure if available
    const totalStaff = 0 // Will be updated when staff data is available
    const totalShifts = 0 // Will be updated when shift data is available

    return {
      totalDepartments: departments.length,
      totalStaff,
      totalShifts,
    }
  }, [departments])

  return {
    departments,
    loading,
    dialogOpen,
    editingDepartment,
    formData,
    setFormData,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    refreshDepartments,
    saveDepartment,
    deleteDepartment: deleteDepartmentMember,
    stats,
  }
}
