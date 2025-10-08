import React, { useState, useMemo, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronDown,
  ChevronUp,
  Settings2,
  Search,
  Plus,
  Bot,
  Filter,
  Download,
  RefreshCw,
  Sparkles,
  Edit,
  Trash2,
  X,
  Eye,
  EyeOff,
  Save,
  Loader2,
} from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { GlassPanel, GlassButton, GlassBadge } from "@/components/ui/glass"
import { cn } from "@/lib/utils"
import { ChatbotPoint } from "@/types/chatbot"
import { useToast } from "@/components/ui/use-toast"

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""
const API_KEY = "123456"
const API_BASE = "/api/chatbot-data"

// Helper for API calls with base URL and API key
function buildApiUrl(path: string): string {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return base ? `${base}${cleanPath}` : cleanPath
}

function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const headers = new Headers(options?.headers)
  if (!headers.has("x-api-key")) {
    headers.set("x-api-key", API_KEY)
  }

  return fetch(buildApiUrl(url), {
    ...options,
    headers,
  })
}

type ColumnKey = keyof ChatbotPoint

const allColumns: Array<{ key: ColumnKey; label: string; width?: string }> = [
  { key: "id", label: "ID", width: "w-[200px]" },
  { key: "raw_text", label: "Raw Text", width: "w-[300px]" },
  { key: "major_section", label: "Major Section", width: "w-[150px]" },
  { key: "full_section_id", label: "Full Section ID", width: "w-[150px]" },
  { key: "source_table", label: "Source Table", width: "w-[150px]" },
  { key: "title", label: "Title", width: "w-[200px]" },
  { key: "site", label: "Site", width: "w-[120px]" },
  { key: "anotherPrice", label: "Another Price", width: "w-[120px]" },
  { key: "shipmentDirection", label: "Shipment Direction", width: "w-[150px]" },
  { key: "containerStatus", label: "Container Status", width: "w-[150px]" },
  { key: "containerType", label: "Container Type", width: "w-[150px]" },
  { key: "containerSize", label: "Container Size", width: "w-[140px]" },
  { key: "serviceType", label: "Service Type", width: "w-[140px]" },
  { key: "operationType", label: "Operation Type", width: "w-[140px]" },
  { key: "location", label: "Location", width: "w-[140px]" },
  { key: "from", label: "From", width: "w-[140px]" },
  { key: "to", label: "To", width: "w-[140px]" },
  { key: "unit", label: "Unit", width: "w-[100px]" },
  { key: "price", label: "Price", width: "w-[120px]" },
  { key: "price_type", label: "Price Type", width: "w-[120px]" },
  { key: "base_price_ref", label: "Base Price Ref", width: "w-[150px]" },
  { key: "calculation_formula", label: "Calculation Formula", width: "w-[200px]" },
  { key: "context", label: "Context", width: "w-[200px]" },
  { key: "scope_and_conditions", label: "Scope & Conditions", width: "w-[200px]" },
  { key: "keywords", label: "Keywords", width: "w-[200px]" },
  { key: "embedding_text", label: "Embedding Text", width: "w-[200px]" },
  { key: "status", label: "Status", width: "w-[120px]" },
  { key: "process", label: "Process", width: "w-[120px]" },
  { key: "intent", label: "Intent", width: "w-[120px]" },
  { key: "cauhoi", label: "Câu hỏi", width: "w-[200px]" },
  { key: "MAILY", label: "MAILY", width: "w-[120px]" },
]

const defaultVisibleColumns: ColumnKey[] = [
  "id",
  "title",
  "raw_text",
  "major_section",
  "source_table",
  "containerType",
  "containerSize",
  "price",
  "status",
]

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "Đã chuẩn hóa", label: "Đã chuẩn hóa" },
  { value: "Đang xử lý", label: "Đang xử lý" },
  { value: "Chưa xử lý", label: "Chưa xử lý" },
]

export default function ChatbotDataManagement() {
  const { toast } = useToast()
  const [data, setData] = useState<ChatbotPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(defaultVisibleColumns)
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalRecords, setTotalRecords] = useState(0)

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<ChatbotPoint | null>(null)
  const [formData, setFormData] = useState<Partial<ChatbotPoint>>({})

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiFetch(
        `${API_BASE}?page=${currentPage}&page_size=${pageSize}`
      )
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

  // Create or update record
  const handleSave = async () => {
    setLoading(true)
    try {
      const url = currentRecord?.id
        ? `${API_BASE}/${currentRecord.id}`
        : API_BASE
      const method = currentRecord?.id ? "PUT" : "POST"

      const response = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Thành công",
        description: currentRecord?.id ? "Đã cập nhật" : "Đã tạo mới",
      })
      setEditDialogOpen(false)
      fetchData()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu dữ liệu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete record
  const handleDelete = async () => {
    if (!currentRecord?.id) return
    setLoading(true)
    try {
      const response = await apiFetch(`${API_BASE}/${currentRecord.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Thành công",
        description: "Đã xóa record",
      })
      setDeleteDialogOpen(false)
      fetchData()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa dữ liệu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Export data
  const handleExport = () => {
    const csv = [
      allColumns.map((c) => c.label).join(","),
      ...filteredData.map((row) =>
        allColumns
          .map((col) => {
            const value = row[col.key]
            if (Array.isArray(value)) return `"${value.join("; ")}"`
            return `"${value || ""}"`
          })
          .join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chatbot-data-${new Date().toISOString()}.csv`
    a.click()
  }

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

  const filteredData = useMemo(() => {
    let filtered = [...data]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((row) => row.status === statusFilter)
    }

    // Sort
    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        if (aVal === bVal) return 0
        const comparison = aVal > bVal ? 1 : -1
        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    return filtered
  }, [data, searchTerm, statusFilter, sortColumn, sortDirection])

  const totalPages = Math.ceil(totalRecords / pageSize)
  const visibleColumnsList = allColumns.filter((col) => visibleColumns.has(col.key))

  const statusCounts = useMemo(() => {
    return {
      total: data.length,
      normalized: data.filter((d) => d.status === "Đã chuẩn hóa").length,
      processing: data.filter((d) => d.status === "Đang xử lý").length,
      unprocessed: data.filter((d) => d.status === "Chưa xử lý").length,
    }
  }, [data])

  const openEditDialog = (record?: ChatbotPoint) => {
    if (record) {
      setCurrentRecord(record)
      setFormData(record)
    } else {
      setCurrentRecord(null)
      setFormData({ status: "Chưa xử lý" })
    }
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (record: ChatbotPoint) => {
    setCurrentRecord(record)
    setDeleteDialogOpen(true)
  }

  const openViewDialog = (record: ChatbotPoint) => {
    setCurrentRecord(record)
    setViewDialogOpen(true)
  }

  return (
    <>
      <PageHeader
        icon={Bot}
        tagline="AI-Powered Data Management"
        title="Chatbot Data Management"
        description="Quản lý và tối ưu hóa dữ liệu chatbot với đầy đủ tính năng CRUD"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <GlassPanel variant="strong" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng Records</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                {totalRecords}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30">
              <Bot className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đã chuẩn hóa</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {statusCounts.normalized}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đang xử lý</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {statusCounts.processing}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
              <RefreshCw className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Chưa xử lý</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-slate-600 to-gray-600 bg-clip-text text-transparent">
                {statusCounts.unprocessed}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800/30 dark:to-gray-800/30">
              <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel variant="strong" className="flex flex-col gap-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative group">
              <Search
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                  "text-muted-foreground group-hover:text-sky-500"
                )}
              />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-11 h-12 rounded-xl",
                  "bg-white/80 dark:bg-slate-900/80",
                  "border-slate-200/60 dark:border-slate-800/60",
                  "focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
                )}
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className={cn(
                "w-[180px] h-12 rounded-xl",
                "bg-white/80 dark:bg-slate-900/80"
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <GlassButton variant="outline" size="lg" className="gap-2">
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">Cột hiển thị</span>
                <GlassBadge variant="info" className="ml-1">
                  {visibleColumns.size}/{allColumns.length}
                </GlassBadge>
              </GlassButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] max-h-[400px] overflow-y-auto">
              <DropdownMenuLabel>Chọn cột hiển thị</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setVisibleColumns(new Set(allColumns.map((c) => c.key)))}
              >
                <Eye className="h-4 w-4 mr-2" />
                Hiện tất cả
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setVisibleColumns(new Set(defaultVisibleColumns))}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Mặc định
              </Button>
              <DropdownMenuSeparator />
              {allColumns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={visibleColumns.has(col.key)}
                  onCheckedChange={() => toggleColumn(col.key)}
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <GlassButton
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </GlassButton>

          <GlassButton
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            <span className="hidden sm:inline">Làm mới</span>
          </GlassButton>

          <GlassButton
            variant="primary"
            size="lg"
            className="gap-2 shadow-lg shadow-sky-500/25"
            onClick={() => openEditDialog()}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Thêm mới</span>
          </GlassButton>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-3 pb-2">
          <GlassBadge variant="info" className="gap-1.5">
            <span className="text-xs">Trang:</span>
            <span className="font-semibold">
              {currentPage}/{totalPages}
            </span>
          </GlassBadge>
          <GlassBadge variant="info" className="gap-1.5">
            <span className="text-xs">Tổng:</span>
            <span className="font-semibold">{totalRecords}</span>
          </GlassBadge>
          {sortColumn && (
            <GlassBadge variant="primary" className="gap-1.5">
              <ChevronUp
                className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  sortDirection === "desc" && "rotate-180"
                )}
              />
              <span className="text-xs">Sắp xếp:</span>
              <span className="font-semibold">
                {allColumns.find((c) => c.key === sortColumn)?.label}
              </span>
            </GlassBadge>
          )}
          {searchTerm && (
            <GlassBadge variant="success" className="gap-1.5">
              <Search className="h-3 w-3" />
              <span className="text-xs">Tìm:</span>
              <span className="font-semibold max-w-[120px] truncate">{searchTerm}</span>
            </GlassBadge>
          )}
          {statusFilter && statusFilter !== "all" && (
            <GlassBadge variant="warning" className="gap-1.5">
              <Filter className="h-3 w-3" />
              <span className="text-xs">Lọc:</span>
              <span className="font-semibold">{statusFilter}</span>
            </GlassBadge>
          )}
        </div>

        {/* Table */}
        <div
          className={cn(
            "rounded-xl border border-slate-200/60 dark:border-slate-800/60",
            "overflow-hidden shadow-ios",
            "bg-white/50 dark:bg-slate-900/50"
          )}
        >
          <div className="overflow-auto max-h-[calc(100vh-520px)]">
            <Table>
              <TableHeader className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b-2 border-slate-200/60 dark:border-slate-800/60 z-10">
                <TableRow className="hover:bg-transparent">
                  {visibleColumnsList.map((col) => (
                    <TableHead
                      key={col.key}
                      className={cn(
                        "cursor-pointer group transition-all duration-200",
                        "hover:bg-sky-50/50 dark:hover:bg-sky-900/20",
                        "font-semibold text-foreground",
                        sortColumn === col.key && "bg-sky-50/80 dark:bg-sky-900/30",
                        col.width
                      )}
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {col.label}
                        </span>
                        {sortColumn === col.key ? (
                          <>
                            {sortDirection === "asc" && (
                              <ChevronUp className="h-4 w-4 text-sky-500 animate-in fade-in zoom-in duration-200" />
                            )}
                            {sortDirection === "desc" && (
                              <ChevronDown className="h-4 w-4 text-sky-500 animate-in fade-in zoom-in duration-200" />
                            )}
                          </>
                        ) : (
                          <ChevronUp className="h-4 w-4 text-transparent group-hover:text-slate-300 dark:group-hover:text-slate-600 transition-colors" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="font-semibold text-foreground text-right pr-6 sticky right-0 bg-white/95 dark:bg-slate-900/95">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumnsList.length + 1}
                      className="text-center h-48"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
                        <p className="text-muted-foreground">Đang tải...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumnsList.length + 1}
                      className="text-center h-48"
                    >
                      <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50">
                          <Search className="h-10 w-10" />
                        </div>
                        <div>
                          <p className="font-medium text-lg">Không tìm thấy dữ liệu</p>
                          <p className="text-sm mt-1">
                            Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row) => (
                    <TableRow
                      key={row.id}
                      className={cn(
                        "group transition-all duration-200",
                        "hover:bg-sky-50/50 dark:hover:bg-sky-900/20",
                        "border-b border-slate-200/40 dark:border-slate-800/40"
                      )}
                    >
                      {visibleColumnsList.map((col) => (
                        <TableCell
                          key={col.key}
                          className={cn(
                            "max-w-xs truncate transition-colors",
                            col.key === "status" &&
                              row[col.key] === "Đã chuẩn hóa" &&
                              "text-emerald-600 dark:text-emerald-400 font-medium",
                            col.key === "status" &&
                              row[col.key] === "Đang xử lý" &&
                              "text-amber-600 dark:text-amber-400 font-medium",
                            col.key === "status" &&
                              row[col.key] === "Chưa xử lý" &&
                              "text-slate-600 dark:text-slate-400 font-medium"
                          )}
                          title={String(row[col.key] || "")}
                        >
                          {col.key === "price" && typeof row[col.key] === "number" ? (
                            <span className="font-mono font-medium">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(row[col.key] as number)}
                            </span>
                          ) : Array.isArray(row[col.key]) ? (
                            (row[col.key] as string[]).join(", ")
                          ) : (
                            String(row[col.key] || "")
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-right sticky right-0 bg-white/95 dark:bg-slate-900/95">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(row)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(row)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(row)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Hiển thị</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger
                className={cn(
                  "w-[80px] h-10 rounded-lg",
                  "bg-white/80 dark:bg-slate-900/80"
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm font-medium text-muted-foreground">/ trang</span>
          </div>

          <div className="flex items-center gap-2">
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || loading}
            >
              Đầu
            </GlassButton>
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              Trước
            </GlassButton>
            <GlassBadge variant="primary" className="px-5 py-2 font-semibold">
              {currentPage} / {totalPages}
            </GlassBadge>
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Sau
            </GlassButton>
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || loading}
            >
              Cuối
            </GlassButton>
          </div>
        </div>
      </GlassPanel>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết Record</DialogTitle>
            <DialogDescription>Xem thông tin chi tiết của record</DialogDescription>
          </DialogHeader>
          {currentRecord && (
            <div className="grid grid-cols-2 gap-4">
              {allColumns.map((col) => (
                <div key={col.key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{col.label}</Label>
                  <p className="text-sm font-medium break-words">
                    {Array.isArray(currentRecord[col.key])
                      ? (currentRecord[col.key] as string[]).join(", ")
                      : String(currentRecord[col.key] || "-")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentRecord ? "Chỉnh sửa Record" : "Tạo Record Mới"}
            </DialogTitle>
            <DialogDescription>
              {currentRecord ? "Cập nhật thông tin record" : "Thêm record mới vào hệ thống"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Key fields */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status || ""}
                onValueChange={(val) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đã chuẩn hóa">Đã chuẩn hóa</SelectItem>
                  <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                  <SelectItem value="Chưa xử lý">Chưa xử lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="raw_text">Raw Text</Label>
              <Textarea
                id="raw_text"
                value={formData.raw_text || ""}
                onChange={(e) => setFormData({ ...formData, raw_text: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="major_section">Major Section</Label>
              <Input
                id="major_section"
                value={formData.major_section || ""}
                onChange={(e) =>
                  setFormData({ ...formData, major_section: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source_table">Source Table</Label>
              <Input
                id="source_table"
                value={formData.source_table || ""}
                onChange={(e) =>
                  setFormData({ ...formData, source_table: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="containerType">Container Type</Label>
              <Input
                id="containerType"
                value={formData.containerType || ""}
                onChange={(e) =>
                  setFormData({ ...formData, containerType: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="containerSize">Container Size</Label>
              <Input
                id="containerSize"
                value={formData.containerSize || ""}
                onChange={(e) =>
                  setFormData({ ...formData, containerSize: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit || ""}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa record này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {currentRecord && (
            <div className="py-4">
              <p className="text-sm">
                <span className="font-medium">ID:</span> {currentRecord.id}
              </p>
              <p className="text-sm">
                <span className="font-medium">Title:</span> {currentRecord.title || "-"}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
