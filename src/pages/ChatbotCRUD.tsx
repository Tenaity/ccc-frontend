import React, { useState, useMemo } from "react"
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
import { ChevronDown, ChevronUp, Settings2, Search, Plus, Bot, Filter, Download, RefreshCw, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { GlassPanel, GlassButton, GlassBadge } from "@/components/ui/glass"
import { cn } from "@/lib/utils"

interface ChatbotPoint {
  id: string
  raw_text: string
  major_section: string
  full_section_id: string
  source_table: string
  title: string
  containerType: string
  containerSize: string
  price: number
  status: string
}

// Simplified mock data
const mockData: ChatbotPoint[] = Array.from({ length: 50 }, (_, i) => ({
  id: `id-${i}`,
  raw_text: `Dữ liệu thứ ${i + 1}`,
  major_section: i % 2 === 0 ? "Section II" : "Section III",
  full_section_id: `II.1.${i}`,
  source_table: `Bảng ${(i % 5) + 1}`,
  title: `Title ${i + 1}`,
  containerType: i % 2 === 0 ? "Khô" : "Lạnh",
  containerSize: ["20ft", "40ft", "45ft"][i % 3],
  price: 400000 + i * 10000,
  status: ["Đã chuẩn hóa", "Đang xử lý", "Chưa xử lý"][i % 3],
}))

type ColumnKey = keyof ChatbotPoint

const columns: Array<{ key: ColumnKey; label: string }> = [
  { key: "id", label: "ID" },
  { key: "raw_text", label: "Raw Text" },
  { key: "major_section", label: "Major Section" },
  { key: "source_table", label: "Source Table" },
  { key: "title", label: "Title" },
  { key: "containerType", label: "Container Type" },
  { key: "containerSize", label: "Container Size" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
]

export default function ChatbotCRUD() {
  const [data] = useState<ChatbotPoint[]>(mockData)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(columns.map((col) => col.key))
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

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
  }, [data, searchTerm, sortColumn, sortDirection])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const visibleColumnsList = columns.filter((col) => visibleColumns.has(col.key))

  return (
    <>
      <PageHeader
        icon={Bot}
        tagline="AI-Powered Data Management"
        title="Chatbot Intelligence Hub"
        description="Quản lý và tối ưu hóa dữ liệu chatbot Point_v3 với công nghệ tiên tiến"
      />

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <GlassPanel variant="strong" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng Records</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                {filteredData.length}
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
                {data.filter(d => d.status === "Đã chuẩn hóa").length}
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
                {data.filter(d => d.status === "Đang xử lý").length}
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
                {data.filter(d => d.status === "Chưa xử lý").length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800/30 dark:to-gray-800/30">
              <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
        </GlassPanel>
      </div>

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

            <GlassButton variant="outline" size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </GlassButton>

            <GlassButton variant="primary" size="lg" className="gap-2 shadow-lg shadow-sky-500/25">
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

        {/* Premium Table */}
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
                            col.key === "status" && row[col.key] === "Đã chuẩn hóa" && "text-emerald-600 dark:text-emerald-400 font-medium",
                            col.key === "status" && row[col.key] === "Đang xử lý" && "text-amber-600 dark:text-amber-400 font-medium",
                            col.key === "status" && row[col.key] === "Chưa xử lý" && "text-slate-600 dark:text-slate-400 font-medium"
                          )}
                        >
                          {col.key === "price" ? (
                            <span className="font-mono font-medium">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row[col.key] as number)}
                            </span>
                          ) : (
                            String(row[col.key])
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <GlassButton variant="outline" size="sm" className="hover:border-sky-400/50">
                            Sửa
                          </GlassButton>
                          <GlassButton variant="destructive" size="sm">
                            Xóa
                          </GlassButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Enhanced Pagination */}
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
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="hover:border-sky-400/50"
            >
              Đầu
            </GlassButton>
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="hover:border-sky-400/50"
            >
              Sau
            </GlassButton>
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="hover:border-sky-400/50"
            >
              Cuối
            </GlassButton>
          </div>
        </div>
      </GlassPanel>
    </>
  )
}