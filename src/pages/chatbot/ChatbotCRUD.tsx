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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronUp, Settings2, Search, Plus, Bot, Filter, Download, RefreshCw, Sparkles, Trash2, Edit, AlertCircle, CheckCircle, Loader } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { GlassPanel, GlassButton, GlassBadge } from "@/components/ui/glass"
import { cn } from "@/lib/utils"
import type { ChatbotDataDTO } from "@/types/chatbot"
import { ChatbotDataStatus } from "@/types/chatbot"
import {
  listChatbotData,
  deleteChatbotDataRecord
} from "@/lib/api-chatbot"
import ChatbotDataModal from "@/components/ChatbotDataModal"

type ColumnKey = keyof ChatbotDataDTO

// Default columns to display (always visible)
const DEFAULT_VISIBLE_COLUMNS: ColumnKey[] = [
  "id",
  "title",
  "raw_text",
  "major_section",
  "source_table",
  "full_section_id",
  "container_type",
  "container_size",
  "price",
  "status",
]

// All available columns
const columns: Array<{ key: ColumnKey; label: string }> = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "raw_text", label: "Raw Text" },
  { key: "major_section", label: "Major Section" },
  { key: "full_section_id", label: "Full Section ID" },
  { key: "source_table", label: "Source Table" },
  { key: "container_type", label: "Container Type" },
  { key: "container_size", label: "Container Size" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
  { key: "location", label: "Location" },
  { key: "from_location", label: "From" },
  { key: "to_location", label: "To" },
  { key: "unit", label: "Unit" },
  { key: "keywords", label: "Keywords" },
  { key: "context", label: "Context" },
  { key: "year", label: "Year" },
  { key: "process", label: "Process" },
  { key: "intent", label: "Intent" },
]

export default function ChatbotCRUD() {
  const [data, setData] = useState<ChatbotDataDTO[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(DEFAULT_VISIBLE_COLUMNS)
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [deleting, setDeleting] = useState<Set<string>>(new Set())
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ChatbotDataDTO | null>(null)

  // Fetch data from API
  const fetchData = async (page: number = 1) => {
    setLoading(true)
    setError(null)
    try {
      const result = await listChatbotData(page, pageSize)
      setData(result.items)
      setTotal(result.total)
      setCurrentPage(page)
      // Debug: Log first item to verify field mapping
      if (result.items.length > 0) {
        console.log("First record from API:", result.items[0])
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi tải dữ liệu"
      setError(message)
      console.error("Error fetching chatbot data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount and when page/pageSize changes
  useEffect(() => {
    fetchData(currentPage)
  }, [pageSize])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    fetchData(newPage)
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingRecord(null)
  }

  // Handle modal success
  const handleModalSuccess = () => {
    setSuccessMessage(editingRecord ? "Cập nhật bản ghi thành công!" : "Tạo bản ghi thành công!")
    setTimeout(() => setSuccessMessage(null), 3000)
    fetchData(currentPage)
  }

  // Handle create
  const handleCreate = () => {
    setEditingRecord(null)
    setIsModalOpen(true)
  }

  // Handle edit
  const handleEdit = (record: ChatbotDataDTO) => {
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      setDeleting(prev => new Set([...prev, id]))
      await deleteChatbotDataRecord(id)
      setDeleteConfirm(null)
      setSuccessMessage("Xóa bản ghi thành công!")
      setTimeout(() => setSuccessMessage(null), 3000)

      // Reload current page or go to first page if this was the last item
      const newTotal = total - 1
      if (currentPage > Math.ceil(newTotal / pageSize) && currentPage > 1) {
        await fetchData(currentPage - 1)
      } else {
        await fetchData(currentPage)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi xóa bản ghi"
      setError(message)
      console.error("Error deleting record:", err)
    } finally {
      setDeleting(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
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

    if (searchTerm) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        if (aVal === bVal) return 0
        const safeA = aVal ?? "";
        const safeB = bVal ?? "";
        if (safeA === safeB) return 0;
        const comparison = safeA > safeB ? 1 : -1;
        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    return filtered
  }, [data, searchTerm, sortColumn, sortDirection])

  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const visibleColumnsList = columns.filter((col) => visibleColumns.has(col.key))

  const statusCounts = {
    normalized: data.filter(d => d.status === ChatbotDataStatus.NORMALIZED).length,
    processing: data.filter(d => d.status === ChatbotDataStatus.PROCESSING).length,
    pending: data.filter(d => d.status === ChatbotDataStatus.PENDING).length,
  }

  return (
    <>
      <PageHeader
        icon={Bot}
        tagline="AI-Powered Data Management"
        title="Chatbot Intelligence Hub"
        description="Quản lý và tối ưu hóa dữ liệu chatbot với công nghệ tiên tiến"
      />

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <GlassPanel variant="strong" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng Records</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                {total}
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
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
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
                {statusCounts.pending}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800/30 dark:to-gray-800/30">
              <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Error Message */}
      {error && (
        <GlassPanel className="p-4 mb-6 border-red-200/50 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20">
          <div className="flex gap-3 items-start">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-200">Lỗi</p>
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Success Message */}
      {successMessage && (
        <GlassPanel className="p-4 mb-6 border-green-200/50 dark:border-green-900/30 bg-green-50/50 dark:bg-green-950/20">
          <div className="flex gap-3 items-start">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-200">Thành công</p>
              <p className="text-sm text-green-800 dark:text-green-300">{successMessage}</p>
            </div>
          </div>
        </GlassPanel>
      )}

      <GlassPanel variant="strong" className="flex flex-col gap-6 p-6">
        {/* Enhanced Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Premium Search */}
          <div className="flex-1 min-w-[280px]">
            <div className="relative group">
              <Search className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                "text-muted-foreground group-hover:text-sky-500"
              )} />
              <Input
                placeholder="Tìm kiếm theo bất kỳ trường nào..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-11 h-12 rounded-xl",
                  "bg-white/80 dark:bg-slate-900/80",
                  "border-slate-200/60 dark:border-slate-800/60",
                  "focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20",
                  "transition-all duration-200"
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <GlassButton variant="outline" size="lg" className="gap-2">
                  <Settings2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Cột hiển thị</span>
                  <GlassBadge variant="info" className="ml-1">
                    {visibleColumns.size}/{columns.length}
                  </GlassBadge>
                </GlassButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px]">
                {columns.map((col) => (
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
              onClick={() => fetchData(currentPage)}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              <span className="hidden sm:inline">Làm mới</span>
            </GlassButton>

            <GlassButton variant="outline" size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </GlassButton>

            <GlassButton
              variant="primary"
              size="lg"
              className="gap-2 shadow-lg shadow-sky-500/25"
              onClick={handleCreate}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Thêm mới</span>
            </GlassButton>
          </div>
        </div>

        {/* Enhanced Stats Bar */}
        <div className="flex flex-wrap items-center gap-3 pb-2">
          <GlassBadge variant="info" className="gap-1.5">
            <span className="text-xs">Hiển thị:</span>
            <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredData.length)}</span>
            <span className="text-xs">của</span>
            <span className="font-semibold">{filteredData.length}</span>
          </GlassBadge>
          {sortColumn && (
            <GlassBadge variant="primary" className="gap-1.5">
              <ChevronUp className={cn(
                "h-3 w-3 transition-transform duration-200",
                sortDirection === "desc" && "rotate-180"
              )} />
              <span className="text-xs">Sắp xếp:</span>
              <span className="font-semibold">{columns.find(c => c.key === sortColumn)?.label}</span>
            </GlassBadge>
          )}
          {searchTerm && (
            <GlassBadge variant="success" className="gap-1.5">
              <Search className="h-3 w-3" />
              <span className="text-xs">Tìm kiếm:</span>
              <span className="font-semibold max-w-[120px] truncate">{searchTerm}</span>
            </GlassBadge>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <Loader className="h-8 w-8 text-sky-600 animate-spin" />
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        {/* Premium Table */}
        {!loading && (
          <div className={cn(
            "rounded-xl border border-slate-200/60 dark:border-slate-800/60",
            "overflow-hidden shadow-ios",
            "bg-white/50 dark:bg-slate-900/50"
          )}>
            <div className="overflow-auto max-h-[calc(100vh-480px)]">
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
                          sortColumn === col.key && "bg-sky-50/80 dark:bg-sky-900/30"
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
                    <TableHead className="font-semibold text-foreground text-right pr-6">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={visibleColumnsList.length + 1} className="text-center h-48">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                          <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50">
                            <Search className="h-10 w-10" />
                          </div>
                          <div>
                            <p className="font-medium text-lg">Không tìm thấy dữ liệu</p>
                            <p className="text-sm mt-1">Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row) => (
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
                              col.key === "status" && row[col.key] === ChatbotDataStatus.NORMALIZED && "text-emerald-600 dark:text-emerald-400 font-medium",
                              col.key === "status" && row[col.key] === ChatbotDataStatus.PROCESSING && "text-amber-600 dark:text-amber-400 font-medium",
                              col.key === "status" && row[col.key] === ChatbotDataStatus.PENDING && "text-slate-600 dark:text-slate-400 font-medium"
                            )}
                          >
                            {col.key === "price" && row[col.key] ? (
                              <span className="font-mono font-medium">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row[col.key] as number)}
                              </span>
                            ) : (
                              String(row[col.key] ?? "-")
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <GlassButton
                              variant="outline"
                              size="sm"
                              className="hover:border-sky-400/50 gap-1"
                              disabled={deleting.has(row.id)}
                              onClick={() => handleEdit(row)}
                            >
                              <Edit className="h-3 w-3" />
                              Sửa
                            </GlassButton>
                            {deleteConfirm === row.id ? (
                              <div className="flex gap-1">
                                <GlassButton
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(row.id)}
                                  disabled={deleting.has(row.id)}
                                  className="gap-1"
                                >
                                  {deleting.has(row.id) ? (
                                    <Loader className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3 w-3" />
                                  )}
                                  Xóa
                                </GlassButton>
                                <GlassButton
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDeleteConfirm(null)}
                                  disabled={deleting.has(row.id)}
                                >
                                  Hủy
                                </GlassButton>
                              </div>
                            ) : (
                              <GlassButton
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteConfirm(row.id)}
                                className="gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                Xóa
                              </GlassButton>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Enhanced Pagination */}
        {!loading && (
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
                <SelectTrigger className={cn(
                  "w-[80px] h-10 rounded-lg",
                  "bg-white/80 dark:bg-slate-900/80",
                  "border-slate-200/60 dark:border-slate-800/60",
                  "focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
                )}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm font-medium text-muted-foreground">/ trang</span>
            </div>

            <div className="flex items-center gap-2">
              <GlassButton
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="hover:border-sky-400/50"
              >
                Đầu
              </GlassButton>
              <GlassButton
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="hover:border-sky-400/50"
              >
                Trước
              </GlassButton>
              <GlassBadge variant="primary" className="px-5 py-2 font-semibold">
                {currentPage} / {totalPages}
              </GlassBadge>
              <GlassButton
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="hover:border-sky-400/50"
              >
                Sau
              </GlassButton>
              <GlassButton
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="hover:border-sky-400/50"
              >
                Cuối
              </GlassButton>
            </div>
          </div>
        )}
      </GlassPanel>

      {/* Modal for Create/Edit */}
      <ChatbotDataModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editingData={editingRecord}
      />
    </>
  )
}
