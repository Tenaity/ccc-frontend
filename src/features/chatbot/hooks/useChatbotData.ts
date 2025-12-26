import { useState, useEffect, useMemo } from "react"
import { ChatbotPoint } from "@/types/chatbot"
import { useToast } from "@/components/ui/use-toast"
import { apiFetch } from "@/lib/api"
import { ColumnKey, defaultVisibleColumns } from "../constants"

const API_BASE = "/api/chatbot-data"

export function useChatbotData() {
  const { toast } = useToast()
  const [data, setData] = useState<ChatbotPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  
  // Filters and Pagination
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  
  // Sorting
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(defaultVisibleColumns)
  )

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiFetch(
        `${API_BASE}?page=${currentPage}&page_size=${pageSize}`
      )
      // Note: Assuming apiFetch handles response.ok check internaly if it throws, 
      // but standard fetch doesn't throw on 400/500 unless wrapped.
      // The original code did response.json() manually.
      if (!response.ok) throw new Error("Failed to fetch")
      
      const result = await response.json()
      setData(result.items || [])
      setTotalRecords(result.total || 0)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize])

  const handleSave = async (formData: Partial<ChatbotPoint>) => {
    setLoading(true)
    try {
      const url = formData.id
        ? `${API_BASE}/${formData.id}`
        : API_BASE
      const method = formData.id ? "PUT" : "POST"

      const response = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Thành công",
        description: formData.id ? "Đã cập nhật" : "Đã tạo mới",
      })
      fetchData()
      return true
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu dữ liệu",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      const response = await apiFetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Thành công",
        description: "Đã xóa record",
      })
      fetchData()
      return true
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa dữ liệu",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchTerm) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((row) => row.status === statusFilter)
    }

    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        if (aVal === bVal) return 0
        const comparison = aVal! > bVal! ? 1 : -1
        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    return filtered
  }, [data, searchTerm, statusFilter, sortColumn, sortDirection])

  const totalPages = Math.ceil(totalRecords / pageSize)

  const statusCounts = useMemo(() => {
    return {
      total: data.length,
      normalized: data.filter((d) => d.status === "Đã chuẩn hóa").length,
      processing: data.filter((d) => d.status === "Đang xử lý").length,
      unprocessed: data.filter((d) => d.status === "Chưa xử lý").length,
    }
  }, [data])

  const handleSort = (column: ColumnKey) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const toggleColumn = (column: ColumnKey) => {
    const newVisible = new Set(visibleColumns)
    if (newVisible.has(column)) {
      newVisible.delete(column)
    } else {
      newVisible.add(column)
    }
    setVisibleColumns(newVisible)
  }

  return {
    data: filteredData,
    loading,
    totalRecords,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortColumn,
    sortDirection,
    handleSort,
    visibleColumns,
    setVisibleColumns,
    toggleColumn,
    statusCounts,
    fetchData,
    handleSave,
    handleDelete,
  }
}
