import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"

interface Department {
  id: number
  name: string
  code: string
  color: string
  icon: string
  is_active: boolean
}

interface DepartmentContextValue {
  selectedDepartmentId: number | null
  setSelectedDepartmentId: (id: number | null) => void
  departments: Department[]
  isLoading: boolean
  selectedDepartment: Department | null
}

const DepartmentContext = createContext<DepartmentContextValue | undefined>(undefined)

const STORAGE_KEY = "ccc_selected_department"

export function DepartmentProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDepartmentId, setSelectedDepartmentIdState] = useState<number | null>(() => {
    // Priority: URL param > localStorage > null
    const urlDeptId = searchParams.get("dept")
    if (urlDeptId) {
      return parseInt(urlDeptId)
    }

    const storedDeptId = localStorage.getItem(STORAGE_KEY)
    if (storedDeptId) {
      return parseInt(storedDeptId)
    }

    return null
  })

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/departments?active=1")
        const data = await res.json()
        setDepartments(data.filter((d: Department) => d.is_active))
      } catch (err) {
        console.error("Failed to fetch departments:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  // Sync selectedDepartmentId with URL and localStorage
  const setSelectedDepartmentId = useCallback(
    (id: number | null) => {
      setSelectedDepartmentIdState(id)

      // Update URL
      const newParams = new URLSearchParams(searchParams)
      if (id !== null) {
        newParams.set("dept", id.toString())
        localStorage.setItem(STORAGE_KEY, id.toString())
      } else {
        newParams.delete("dept")
        localStorage.removeItem(STORAGE_KEY)
      }
      setSearchParams(newParams, { replace: true })
    },
    [searchParams, setSearchParams]
  )

  // Sync URL changes back to state
  useEffect(() => {
    const urlDeptId = searchParams.get("dept")
    const parsedId = urlDeptId ? parseInt(urlDeptId) : null

    if (parsedId !== selectedDepartmentId) {
      setSelectedDepartmentIdState(parsedId)
      if (parsedId !== null) {
        localStorage.setItem(STORAGE_KEY, parsedId.toString())
      }
    }
  }, [searchParams, selectedDepartmentId])

  const selectedDepartment = departments.find((d) => d.id === selectedDepartmentId) || null

  return (
    <DepartmentContext.Provider
      value={{
        selectedDepartmentId,
        setSelectedDepartmentId,
        departments,
        isLoading,
        selectedDepartment,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  )
}

export function useDepartment() {
  const context = useContext(DepartmentContext)
  if (!context) {
    throw new Error("useDepartment must be used within DepartmentProvider")
  }
  return context
}
