import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import { DEFAULT_FORM_DATA } from "./constants"
import type { Department, DepartmentFormData } from "./types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""
const API_KEY = "123456"

function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const headers = new Headers(options?.headers)
  if (!headers.has("x-api-key")) {
    headers.set("x-api-key", API_KEY)
  }
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`
  return fetch(fullUrl, { ...options, headers })
}

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
      const res = await apiFetch("/api/departments")
      const data = await res.json()
      setDepartments(data)
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
      const url = editingDepartment
        ? `/api/departments/${editingDepartment.id}`
        : "/api/departments"

      const method = editingDepartment ? "PUT" : "POST"

      const res = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await refreshDepartments()
        setDialogOpen(false)
      } else {
        const error = await res.json()
        alert(error.error || "Failed to save department")
      }
    } catch (error) {
      console.error("Failed to save department:", error)
      alert("Failed to save department")
    }
  }, [editingDepartment, formData, refreshDepartments])

  const deleteDepartment = useCallback(
    async (department: Department) => {
      if (department.staff_count > 0) {
        alert(
          `Cannot delete department with ${department.staff_count} staff members. Please reassign or remove staff first.`
        )
        return
      }

      if (!confirm(`Are you sure you want to delete "${department.name}"?`)) {
        return
      }

      try {
        const res = await apiFetch(`/api/departments/${department.id}`, {
          method: "DELETE",
        })

        if (res.ok) {
          await refreshDepartments()
        } else {
          const error = await res.json()
          alert(error.error || "Failed to delete department")
        }
      } catch (error) {
        console.error("Failed to delete department:", error)
        alert("Failed to delete department")
      }
    },
    [refreshDepartments]
  )

  const stats = useMemo(() => {
    const totalStaff = departments.reduce((sum, dept) => sum + dept.staff_count, 0)
    const totalShifts = departments.reduce((sum, dept) => sum + dept.shift_count, 0)

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
    deleteDepartment,
    stats,
  }
}
